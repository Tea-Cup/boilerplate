import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.onreadystatechange = () => {
  if (document.readyState !== 'interactive') {
    return;
  }

  ReactDOM.render(<App />, document.getElementById('App'));
};
