import defaultConfig from 'toolbar/context/defaultConfig';
import {getSentryIFrameOrigin} from 'toolbar/sentryApi/urls';
import ApiProxy from 'toolbar/utils/ApiProxy';

jest.mock('toolbar/context/defaultConfig');

describe('ApiProxy', () => {
  function postMessageToWindow(proxy: ApiProxy, data: unknown, ports: MessagePort[] = []) {
    // @ts-expect-error: Accessing a private method
    const handleWindowMessage = proxy._handleWindowMessage;
    // @ts-expect-error: Accessing a private member
    const expectedOrigin = getSentryIFrameOrigin(proxy._config);
    // @ts-expect-error: This is an incomplete mock
    handleWindowMessage({origin: expectedOrigin, data, ports});
  }

  function getPorts() {
    const {port1, port2} = new MessageChannel();
    return {
      responsePort: port1, // port1 stays inside the iframe
      requestPort: port2, // port2 gets sent into the window
      requestPostMessageSpy: jest.spyOn(port2, 'postMessage'), // port2.postMessage makes requests
      responsePostMessageSpy: jest.spyOn(port1, 'postMessage'), // port1.postMessage replies to requests
      sendPortConnect: (proxy: ApiProxy) => {
        postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'domain-allowed'});
        postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port2]);
      },
    };
  }

  describe('constructor()', () => {
    it('should have a disabled state by default', () => {
      const proxy = new ApiProxy(defaultConfig);
      expect(proxy.state).toEqual('connecting');
    });

    it('should listen to window messages after calling listen()', () => {
      const spy = jest.spyOn(window, 'addEventListener');
      const proxy = new ApiProxy(defaultConfig);

      expect(spy).not.toHaveBeenCalled();

      proxy.listen();
      // @ts-expect-error: Accessing a private method
      expect(spy).toHaveBeenCalledWith('message', proxy._handleWindowMessage);
    });

    it('should callback when status changes', () => {
      const callback = jest.fn();
      const proxy = new ApiProxy(defaultConfig);
      proxy.setOnStatusChanged(callback);

      // @ts-expect-error: Accessing a private method
      proxy._updateStatus({
        hasPort: true,
        isProjectConfigured: true,
      });
      expect(callback).toHaveBeenCalledWith({
        hasPort: true,
        isProjectConfigured: true,
      });
    });
  });

  describe('_handleWindowMessage', () => {
    it('should ignore messages without source==="sentry-toolbar"', () => {
      const callback = jest.fn();
      const proxy = new ApiProxy(defaultConfig);
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {});

      expect(callback).not.toHaveBeenCalled();
    });

    it('should listen to a MessagePort on the port-connect message', () => {
      const port = new MessagePort();
      const addEventListener = jest.spyOn(port, 'addEventListener');
      const start = jest.spyOn(port, 'start');

      const callback = jest.fn();
      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port]);

      // @ts-expect-error: Accessing a private method
      expect(addEventListener).toHaveBeenCalledWith('message', proxy._handlePortMessage);
      // @ts-expect-error: Accessing a private member
      expect(proxy._port).toBeDefined();
      expect(start).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('logged-out');
    });

    it('should cleanup the received port', () => {
      const port = new MessagePort();
      const removeEventListener = jest.spyOn(port, 'removeEventListener');
      const close = jest.spyOn(port, 'close');

      const callback = jest.fn();
      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port]);
      expect(callback).toHaveBeenCalledWith('logged-out');

      proxy.dispose();

      // @ts-expect-error: Accessing a private method
      expect(removeEventListener).toHaveBeenCalledWith('message', proxy._handlePortMessage);
      expect(close).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('connecting');
    });
  });

  describe('_handlePortMessage', () => {
    function outstandingPromises(proxy: ApiProxy) {
      // @ts-expect-error: Accessing a private member
      return proxy._promiseMap;
    }

    it('should resolve cached promises based on the message $result', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should reject cached promises based on the message $error', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      // Reject the in-progress promise(s)
      responsePort.postMessage({$id: 1, $error: 'Something went wrong'});
      expect(promise).rejects.toBe('Something went wrong');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should handle and ignore malformed messages', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      responsePort.postMessage('hello back');
      expect(outstandingPromises(proxy).size).toBe(1); // Promises are unchanged

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should ignore messages in reply to an unknown promise', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      responsePort.postMessage({$id: 14, $result: 'hello back'});
      expect(outstandingPromises(proxy).size).toBe(1); // Promises are unchanged

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should ignore messages that have had their signal aborted', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const abortController = new AbortController();
      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec(abortController.signal, 'log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      abortController.abort();
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is dropped

      // When the message returns from the iframe, it's ignored
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).rejects.toBe('Request was aborted');
    });
  });

  describe('Send messages: exec', () => {
    it('should drop messaages when the port is not set', () => {
      const proxy = new ApiProxy(defaultConfig);
      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);

      expect(promise).toBeUndefined();
    });

    it('should send sequential messages and cache a promise for later', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);

      proxy.exec(new AbortController().signal, 'log', ['hello world']);
      proxy.exec(new AbortController().signal, 'log', ['foo bar']);

      expect(requestPostMessageSpy).toHaveBeenCalledWith(
        {$id: 1, message: {$function: 'log', $args: ['hello world']}},
        []
      );
      expect(requestPostMessageSpy).toHaveBeenCalledWith({$id: 2, message: {$function: 'log', $args: ['foo bar']}}, []);

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: undefined});
      responsePort.postMessage({$id: 2, $result: undefined});
    });

    it('should send fetch messages', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);

      proxy.exec(new AbortController().signal, 'fetch', ['/welcome']);
      expect(requestPostMessageSpy).toHaveBeenLastCalledWith(
        {$id: 1, message: {$function: 'fetch', $args: ['/welcome']}},
        []
      );

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: undefined});
    });

    it('should resolve promises with the resolved data', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(requestPostMessageSpy).toHaveBeenCalledWith(
        {$id: 1, message: {$function: 'log', $args: ['hello world']}},
        []
      );

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
    });

    it('should reject promises with the error object', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = new ApiProxy(defaultConfig);
      proxy.listen();
      sendPortConnect(proxy);

      const promise = proxy.exec(new AbortController().signal, 'log', ['hello world']);
      expect(requestPostMessageSpy).toHaveBeenCalledWith(
        {$id: 1, message: {$function: 'log', $args: ['hello world']}},
        []
      );

      // Resolve the in-progress promise(s)
      const errorObject = new Error('oops');
      responsePort.postMessage({data: {$id: 1, $error: errorObject}});
      expect(promise).rejects.toBe(errorObject);
    });
  });
});
