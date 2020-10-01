import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './config/theme';

import { Provider } from 'react-redux';
import store from './store';

import './index.css';
import App from './App';
import 'leaflet/dist/leaflet.css';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event: any) => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });

      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});
