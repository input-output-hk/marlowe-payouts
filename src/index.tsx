// 1) Import React and React Dom libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';


//  2) Get a reference to the div with ID root
const el = document.getElementById('root');

if (!el) {
  throw new Error('Root element not found');
}

//  3) Tell React to take control of that element
const root = ReactDOM.createRoot(el);

// 4) Show the component on the screen
root.render(<App />);
