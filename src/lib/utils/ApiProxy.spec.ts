import ApiProxy from 'toolbar/utils/ApiProxy';

describe('IFrameProxy', () => {
  function postMessageToWindow(proxy: ApiProxy, data: unknown, ports: MessagePort[] = []) {
    // @ts-expect-error: Accessing a private method
    const handleWindowMessage = proxy._handleWindowMessage;

    // @ts-expect-error: This is an incomplete mock
    handleWindowMessage({data, ports});
  }

  function getPorts() {
    const {port1, port2} = new MessageChannel();
    return {
      responsePort: port1, // port1 stays inside the iframe
      requestPort: port2, // port2 gets sent into the window
      requestPostMessageSpy: jest.spyOn(port2, 'postMessage'), // port2.postMessage makes requests
      responsePostMessageSpy: jest.spyOn(port1, 'postMessage'), // port1.postMessage replies to requests
      sendPortConnect: (proxy: ApiProxy) => {
        postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port2]);
      },
    };
  }

  beforeEach(() => {
    ApiProxy.TEST_ONLY_clear_singleton();
  });

  describe('constructor()', () => {
    it('should have a disabled state by default', () => {
      const proxy = ApiProxy.singleton();
      expect(proxy.status).toEqual({
        hasCookie: false,
        hasProject: false,
        hasPort: false,
      });
    });

    it('should listen to window messages on init', () => {
      const spy = jest.spyOn(window, 'addEventListener');
      const proxy = ApiProxy.singleton();

      // @ts-expect-error: Accessing a private method
      expect(spy).toHaveBeenCalledWith('message', proxy._handleWindowMessage);
    });

    it('should callback when status changes', () => {
      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);

      // @ts-expect-error: Accessing a private method
      proxy._updateStatus({
        hasCookie: true,
        hasProject: true,
        hasPort: true,
      });
      expect(callback).toHaveBeenCalledWith({
        hasCookie: true,
        hasProject: true,
        hasPort: true,
      });
    });
  });

  describe('_handleWindowMessage', () => {
    it('should ignore messages without source==="sentry-toolbar"', () => {
      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {});

      expect(callback).not.toHaveBeenCalled();
    });

    it('should update status after getting a cookie-set messages', () => {
      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);

      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'cookie-set'});
      expect(proxy.status).toEqual(
        expect.objectContaining({
          hasCookie: true,
          hasProject: false,
        })
      );
      expect(callback).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hasCookie: true,
          hasProject: false,
        })
      );
    });

    it('should update status after getting a project-ready messages', () => {
      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);

      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'project-ready'});
      expect(proxy.status).toEqual(
        expect.objectContaining({
          hasCookie: true,
          hasProject: true,
        })
      );
      expect(callback).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hasCookie: true,
          hasProject: true,
        })
      );
    });

    it('should listen to a MessagePort on the port-connect message', () => {
      const port = new MessagePort();
      const addEventListener = jest.spyOn(port, 'addEventListener');
      const start = jest.spyOn(port, 'start');

      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port]);

      // @ts-expect-error: Accessing a private method
      expect(addEventListener).toHaveBeenCalledWith('message', proxy._handlePortMessage);
      // @ts-expect-error: Accessing a private member
      expect(proxy._port).toBeDefined();
      expect(start).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          hasPort: true,
        })
      );
    });

    it('should cleanup the received port', () => {
      const port = new MessagePort();
      const removeEventListener = jest.spyOn(port, 'removeEventListener');
      const close = jest.spyOn(port, 'close');

      const callback = jest.fn();
      const proxy = ApiProxy.singleton();
      proxy.setOnStatusChanged(callback);
      postMessageToWindow(proxy, {source: 'sentry-toolbar', message: 'port-connect'}, [port]);

      proxy.cleanup();

      // @ts-expect-error: Accessing a private method
      expect(removeEventListener).toHaveBeenCalledWith('message', proxy._handlePortMessage);
      expect(close).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith({
        hasCookie: false,
        hasProject: false,
        hasPort: false,
      });
    });
  });

  describe('_handlePortMessage', () => {
    function outstandingPromises(proxy: ApiProxy) {
      // @ts-expect-error: Accessing a private member
      return proxy._promiseMap;
    }

    it('should resolve cached promises based on the message $result', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec('log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should reject cached promises based on the message $error', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec('log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      // Reject the in-progress promise(s)
      responsePort.postMessage({$id: 1, $error: 'Something went wrong'});
      expect(promise).rejects.toBe('Something went wrong');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });

    it('should handle and ignore malformed messages', () => {
      const {responsePort, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec('log', ['hello world']);
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

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);
      expect(outstandingPromises(proxy).size).toBe(0); // No promises to start

      const promise = proxy.exec('log', ['hello world']);
      expect(outstandingPromises(proxy).size).toBe(1); // Added to the list of promises

      responsePort.postMessage({$id: 14, $result: 'hello back'});
      expect(outstandingPromises(proxy).size).toBe(1); // Promises are unchanged

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: 'hello to you'});
      expect(promise).resolves.toBe('hello to you');
      expect(outstandingPromises(proxy).size).toBe(0); // Promise is resovled
    });
  });

  describe('Send messages: exec/fetch', () => {
    it('should drop messaages when the port is not set', () => {
      const proxy = ApiProxy.singleton();
      const promise = proxy.exec('log', ['hello world']);

      expect(promise).toBeUndefined();
    });

    it('should send sequential messages and cache a promise for later', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);

      proxy.exec('log', ['hello world']);
      proxy.exec('log', ['foo bar']);

      expect(requestPostMessageSpy).toHaveBeenCalledWith(
        {$id: 1, message: {$function: 'log', $args: ['hello world']}},
        []
      );
      expect(requestPostMessageSpy).toHaveBeenCalledWith({$id: 2, message: {$function: 'log', $args: ['foo bar']}}, []);

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: undefined});
      responsePort.postMessage({$id: 2, $result: undefined});
    });

    it('should send fetch commands messages', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);

      proxy.exec('fetch', ['/welcome']);
      expect(requestPostMessageSpy).toHaveBeenLastCalledWith(
        {$id: 1, message: {$function: 'fetch', $args: ['/welcome']}},
        []
      );

      // Resolve the in-progress promise(s)
      responsePort.postMessage({$id: 1, $result: undefined});
    });

    it('should resolve promises with the resolved data', () => {
      const {responsePort, requestPostMessageSpy, sendPortConnect} = getPorts();

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);

      const promise = proxy.exec('log', ['hello world']);
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

      const proxy = ApiProxy.singleton();
      sendPortConnect(proxy);

      const promise = proxy.exec('log', ['hello world']);
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
