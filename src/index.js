
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './App';
import store from './store'
import { I18nextProvider } from 'react-i18next'
import i18next from './translations/i18next'

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <App />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);

