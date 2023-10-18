// 1) Import React and React Dom libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';

import { mkRestClient } from "@marlowe.io/runtime-rest-client";

let runtimeURL = process.env.MARLOWE_RUNTIME_WEB_URL;
await fetch(`/config.json`).then(async (res) => {
  if (res.status === 200) {
    const { marloweWebServerUrl } = await res.json();
    if (!!marloweWebServerUrl) {
      runtimeURL = marloweWebServerUrl;
    }
  }
});

if (runtimeURL === undefined || runtimeURL === null) {
  alert("Missing valid config.json file with marloweWebServerUrl OR env keys are not set!")
} else {
  const restClient = mkRestClient(runtimeURL)
  const hasValidRuntimeInstance = await restClient.healthcheck()

  if (!hasValidRuntimeInstance) {
    alert("Invalid runtime instance set!")
  } else {
    //  2) Get a reference to the div with ID root
    const el = document.getElementById('root');

    if (!el) {
      throw new Error('Root element not found');
    }

    //  3) Tell React to take control of that element
    const root = ReactDOM.createRoot(el);

    // 4) Show the component on the screen
    root.render(<App runtimeURL={runtimeURL} />);
  }
}
