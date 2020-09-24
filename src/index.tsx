import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ThemeProvider, CssBaseline } from '@material-ui/core';
import appTheme from './components/app-theme';

import { Provider } from 'react-redux';
import store from './store';

import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
