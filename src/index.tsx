import { i18n } from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import reducer from './redux/reducers';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import { ThemeProvider } from 'styled-components';
import { theme } from './themes';
import '../i18n.ts';
import Loading from './components/loading/loading';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <React.Suspense fallback={<Loading />}>
            <App />
          </React.Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
registerServiceWorker();
