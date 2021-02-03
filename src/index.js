import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import burgerBuilderReducer from './redux-store/reducers/burgerBuilder'
import burgerOrderReducer from './redux-store/reducers/order'
import authReducer from './redux-store/reducers/auth'

import thunk from 'redux-thunk'

const composeEnhancers = process.env.NODE_ENV === "development" ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  burgerOrder: burgerOrderReducer,
  auth: authReducer
})

const STORE = createStore(rootReducer, 
                          composeEnhancers(
                            applyMiddleware(thunk)
                          ));

const app = (
  <Provider store={STORE}>
    <BrowserRouter basename="/" forceRefresh={true}>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(
app, document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
