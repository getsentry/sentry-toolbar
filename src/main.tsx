// import React from 'react';
import ReactDOM from 'react-dom/client';

// We're breaking out of src/lib, which is where `toolbar/*` points to.
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import App from './env/demo/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
