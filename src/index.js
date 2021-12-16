import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './Store'
import { Global } from "@emotion/react"
import styles from './styles'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Global styles={styles} />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();