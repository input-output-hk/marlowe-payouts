// 1) Import React and React Dom libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import dotenv from 'dotenv';

import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';

let runtimeURL = process.env.MARLOWE_RUNTIME_WEB_URL;
await fetch(`/config.json`).then(async (res) => {
  if (res.status === 200) {
    const { marloweWebServerUrl } = await res.json();
    if (!!marloweWebServerUrl) {
      runtimeURL = marloweWebServerUrl;
    }
  }
});

const hasValidRuntimeInstance = runtimeURL !== undefined && runtimeURL !== null && runtimeURL !== '' && runtimeURL.startsWith('http');

//  2) Get a reference to the div with ID root
const el = document.getElementById('root');

if (!el) {
  throw new Error('Root element not found');
}

//  3) Tell React to take control of that element
const root = ReactDOM.createRoot(el);

// 4) Show the component on the screen
if (hasValidRuntimeInstance) {
  root.render(<App runtimeURL={runtimeURL || 'DEFAULT_VALUE'} />);
} else {
  alert("Missing valid config.json file with marloweWebServerUrl OR env keys are not set")
}
