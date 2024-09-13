// type PostMessage = (message: unknown, transfer?: Transferable[]) => Promise<unknown>;
// type ProxyExec = ($function: string, $args: unknown[]) => Promise<unknown>;
// type ProxyFetch = (input: NodeJS.fetch.RequestInfo, init?: RequestInit) => Promise<Response>;

type Resolve = (value: unknown) => void;
type Reject = (reason?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ProxyState {
  hasCookie: boolean;
  hasProject: boolean;
  hasPort: boolean;
}

export default class IFrameProxy {
  private _uuid = 0;

  /**
   * The last reported status of the proxy.
   */
  private _status: ProxyState = {hasCookie: false, hasProject: false, hasPort: false};

  /**
   * The iframe that we're meant to render into. If this changes then we should
   * unmount and reset things.
   */
  private _iframe: undefined | HTMLIFrameElement = undefined;

  /**
   * Callback to tell the initializer if we're ready or not. This can be called
   * any time a 403 response is returned to the `proxyFetch()` helper.
   */
  private _updateStatusCallback: (status: ProxyState) => void = () => {};

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

  /**
   * A list of functions to call during `unload()`.
   */
  private _cleanups: (() => void)[] = [];

  private log(...args: unknown[]) {
    console.log('IFrameProxy', this._uuid, ...args);
  }

  public async init(uuid: number, iframe: HTMLIFrameElement, onStatusChanged: (status: ProxyState) => void) {
    this.cleanup();

    this._uuid = uuid;
    this._iframe = iframe;
    this._updateStatusCallback = onStatusChanged;

    window.addEventListener('message', this._handleWindowMessage);
    this._cleanups.push(() => window.removeEventListener('message', this._handleWindowMessage));

    this._updateStatus({
      hasCookie: false,
      hasProject: false,
      hasPort: false,
    });
  }

  public cleanup() {
    this._cleanups.forEach(cleanup => cleanup());
    this._cleanups = [];
  }

  private _updateStatus(status: ProxyState) {
    this.log('Status changed', this._status, this._updateStatusCallback);
    this._status = status;
    this._updateStatusCallback(status);
  }

  get status() {
    return this._status;
  }

  private _handleWindowMessage = (event: MessageEvent) => {
    if (event.data.source !== 'sentry-devtoolbar') {
      return; // Ignore other message sources
    }

    this.log('window._handleWindowMessage', event.data, event);
    switch (event.data.message) {
      case 'cookie-set':
        // When the user is logged in, but the project is not setup for this domain
        this._updateStatus({
          ...this.status,
          hasCookie: true,
          hasProject: false,
        });
        break;
      case 'project-ready':
        // The user is logged in, and ready to go!
        this._updateStatus({
          ...this.status,
          hasCookie: true,
          hasProject: true,
        });
        break;
      case 'port-connect': {
        // We're getting the port from the iframe, for bidirectional comms

        try {
          const port = event.ports[0];
          port.addEventListener('message', this._handlePortMessage);
          port.start();
          this._cleanups.push(() => port.removeEventListener('message', this._handlePortMessage));
          this._cleanups.push(() => port.close());
          this._updateStatus({
            ...this.status,
            hasPort: true,
          });
        } catch (error) {
          this.log('port-connect -> error', error);
        }
        break;
      }
    }
  };

  private _handlePortMessage = (e: MessageEvent) => {
    this.log('port._handlePortMessage', e.data);
    const $id = e.data.id;
    if (!$id) {
      return; // MessageEvent is malformed without an $id
    }
    if (!this._promiseMap.has($id)) {
      return; // Message was handled already?
    }

    const [resolve, reject] = this._promiseMap.get($id) as [Resolve, Reject];
    this._promiseMap.delete($id);

    if ('$result' in e.data) {
      resolve(e.data.$result);
    } else {
      reject(e.data.$error);
    }
  };

  private postMessage = (message: unknown, transfer?: Transferable[]) => {
    this.log('postMessage()', message);
    if (!this._port) {
      this.log('no port open, dropping message', message);
      return;
    }
    return new Promise((resolve, reject) => {
      const $id = this._sequence++;
      this._promiseMap.set($id, [resolve, reject]);
      this.log('port.postMessage() => ', {$id, message, transfer});
      this._port?.postMessage({$id, message}, transfer ?? []);
    });
  };

  public exec = ($function: string, $args: unknown[]) => {
    return this.postMessage({$function, $args});
  };

  public reload = () => {
    this._iframe?.contentWindow?.location.reload();
  };

  public fetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    return this.exec('fetch', [input, init]) as Promise<Response>;
  };
}
