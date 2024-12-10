import {getSentryIFrameOrigin} from 'toolbar/sentryApi/urls';
import {DebugTarget, type Configuration} from 'toolbar/types/config';

type Resolve = (value: unknown) => void;
type Reject = (reason?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

type HandleStatusChange = (status: ProxyState) => void;
export type ProxyState =
  | 'disconnected'
  | 'connecting'
  | 'logged-out'
  | 'missing-project'
  | 'invalid-domain'
  | 'logged-in';

let _SINGLETON: null | ApiProxy = null;

export default class ApiProxy {
  /**
   * The last reported status of the proxy.
   */
  private _state: ProxyState = 'connecting';

  /**
   * Callback to tell the initializer if we're ready or not. This can be called
   * any time a 403 response is returned to the `proxyFetch()` helper.
   */
  private _updateStatusCallback: HandleStatusChange = () => {};

  /**
   * The port that we're using to send messages into the iframe.
   */
  private _port: undefined | MessagePort;

  /**
   * A UUID (counter) that uniquely tracks each request to the iframe, in order
   * to correlate responses with the promiseMap
   */
  private _sequence = 0;

  /**
   * The promise resolve/reject functions that are outstanding and need to be
   * satisfied by a response from the iframe.
   */
  private _promiseMap = new Map<number, [Resolve, Reject]>();

  public static singleton(config: Configuration, iframe: {current: HTMLIFrameElement | null}) {
    if (!_SINGLETON) {
      _SINGLETON = new ApiProxy(config, iframe);
    }
    return _SINGLETON;
  }

  public constructor(
    private _config: Configuration,
    private _iframe: {current: HTMLIFrameElement | null}
  ) {
    this._log('instance created');
  }

  private _log(...args: unknown[]) {
    if (this._config.debug?.includes(DebugTarget.LOGGING)) {
      console.log('ApiProxy', ...args);
    }
  }

  public listen() {
    window.addEventListener('message', this._handleWindowMessage);
  }

  public setOnStatusChanged(onStatusChanged: HandleStatusChange) {
    this._updateStatusCallback = onStatusChanged;
  }

  public dispose() {
    this._log('dispose()');
    window.removeEventListener('message', this._handleWindowMessage);
    this._disposePort();
    this.setState('connecting');
  }

  private _disposePort() {
    this._log('disposePort()');
    this._port?.removeEventListener('message', this._handlePortMessage);
    this._port?.close();
    this._port = undefined;
  }

  public setState(state: ProxyState) {
    this._log('updateState()', state);
    this._state = state;
    this._updateStatusCallback(state);
  }

  get state() {
    return this._state;
  }

  private _handleWindowMessage = (event: MessageEvent) => {
    if (event.origin !== getSentryIFrameOrigin(this._config) || event.data.source !== 'sentry-toolbar') {
      return; // Ignore other message sources
    }

    this._log('window._handleWindowMessage', event.data, event);
    switch (event.data.message) {
      case 'logged-out': // fallthrough
      case 'missing-project': // fallthrough
      case 'invalid-domain': // fallthrough
      case 'logged-in': // fallthrough
      case 'stale':
        this._disposePort();
        this.setState(event.data.message);
        break;
      case 'port-connect': {
        // We're getting the port from the iframe, for bidirectional comms
        try {
          const port = event.ports.at(0);
          if (!port) {
            throw new Error('Unexpected: Port was not included in message');
          }
          this._port = port;
          port.addEventListener('message', this._handlePortMessage);
          port.start();
        } catch (error) {
          this._log('port-connect -> error', error);
        }
        break;
      }
    }
  };

  private _handlePortMessage = (e: MessageEvent) => {
    this._log('port._handlePortMessage', e.data);
    const $id = e.data.$id;
    if (!$id) {
      this._log('message missing $id');
      return; // MessageEvent is malformed without an $id
    }
    if (!this._promiseMap.has($id)) {
      this._log('message already handled', $id, {_promiseMap: Array.from(this._promiseMap.entries())});
      return; // Message was handled already?
    }

    const [resolve, reject] = this._promiseMap.get($id) as [Resolve, Reject];
    this._promiseMap.delete($id);

    if ('$result' in e.data) {
      this._log('resolving message with', e.data.$result);
      resolve(e.data.$result);
    } else {
      this._log('rejecting message with', e.data.$error);
      reject(e.data.$error);
    }
  };

  private _postPortMessage = (signal: AbortSignal, message: unknown, transfer?: Transferable[]) => {
    this._log('_postPortMessage()', message);
    if (!this._port) {
      this._log('Port is not open, dropping message', message);
      return;
    }

    return new Promise((resolve, reject) => {
      const $id = ++this._sequence;
      this._promiseMap.set($id, [resolve, reject]);
      this._log(
        'port._postPortMessage() => ',
        {$id, message, transfer},
        {_promiseMap: Array.from(this._promiseMap.entries())}
      );

      signal.addEventListener(
        'abort',
        () => {
          this._log('request was aborted', $id);
          this._promiseMap.delete($id);
          reject('Request was aborted');
        },
        {once: true}
      );

      this._port?.postMessage({$id, message}, transfer ?? []);
    });
  };

  public exec = (signal: AbortSignal, $function: 'log' | 'fetch', $args: unknown[]) => {
    return this._postPortMessage(signal, {$function, $args});
  };

  public login(delay_ms: number | undefined) {
    this._iframe.current?.contentWindow?.postMessage(
      {source: 'sentry-toolbar', message: 'request-login', delay_ms},
      getSentryIFrameOrigin(this._config)
    );
  }

  public logout() {
    this._iframe.current?.contentWindow?.postMessage(
      {source: 'sentry-toolbar', message: 'request-logout'},
      getSentryIFrameOrigin(this._config)
    );
  }
}
