// jest-dom adds custom jest matchers for asserting on DOM nodes.
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

type MessageEventHandler = (event: MessageEvent) => void;
window.MessagePort = jest.fn().mockImplementation(() => {
  const callbacks: MessageEventHandler[] = [];
  return {
    postMessage: jest.fn((data: unknown, ports?: undefined | MessagePort[]) => {
      callbacks.forEach(callback => {
        callback(new MessageEvent('message', {data, ports}));
      });
    }),
    addEventListener: jest.fn((_: 'message', handler: MessageEventHandler) => {
      callbacks.push(handler);
    }),
    removeEventListener: jest.fn(),
    start: jest.fn(),
    close: jest.fn(),
  };
});

// Mock MessageChannel allows passing messages from port1 into port2 only.
window.MessageChannel = jest.fn().mockImplementation(() => {
  const port1Callbacks: MessageEventHandler[] = [];
  const port2Callbacks: MessageEventHandler[] = [];
  return {
    port1: {
      postMessage: (data: unknown, ports?: undefined | MessagePort[]) => {
        port2Callbacks.forEach(callback => {
          callback(new MessageEvent('message', {data, ports}));
        });
      },
      addEventListener: (_: 'message', handler: MessageEventHandler) => {
        port1Callbacks.push(handler);
      },
      removeEventListener: jest.fn(),
      start: jest.fn(),
      close: jest.fn(),
    },
    port2: {
      postMessage: (data: unknown, ports?: undefined | MessagePort[]) => {
        port1Callbacks.forEach(callback => {
          callback(new MessageEvent('message', {data, ports}));
        });
      },
      addEventListener: (_: 'message', handler: MessageEventHandler) => {
        port2Callbacks.push(handler);
      },
      removeEventListener: jest.fn(),
      start: jest.fn(),
      close: jest.fn(),
    },
  };
});
