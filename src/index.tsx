// 1) Import React and React Dom libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';

import { mkRestClient } from "@marlowe.io/runtime-rest-client";

let runtimeURL = process.env.MARLOWE_RUNTIME_WEB_URL;
let scanURL = process.env.MARLOWE_SCAN_URL;
await fetch(`/config.json`).then(async (res) => {
  if (res.status === 200) {
    const { marloweWebServerUrl, marloweScanURL } = await res.json();
    if (!!marloweWebServerUrl) {
      runtimeURL = marloweWebServerUrl;
    }
    if (!!marloweScanURL) {
      scanURL = marloweScanURL;
    }
  }
});

const CONFIGURATION_ERROR = Symbol()

try {
  if (typeof runtimeURL !== "string")
    throw new Error("Missing valid config.json file with marloweWebServerUrl OR env MARLOWE_RUNTIME_WEB_URL is not set!", { cause: CONFIGURATION_ERROR });

  if (typeof scanURL !== "string")
    throw new Error("Missing valid config.json file with marloweScanURL OR env MARLOWE_SCAN_URL is not set!", { cause: CONFIGURATION_ERROR });

  const restClient = mkRestClient(runtimeURL);
  const hasValidRuntimeInstance = await restClient.healthcheck();

  if (!hasValidRuntimeInstance)
    throw new Error("Invalid runtime instance set!", { cause: CONFIGURATION_ERROR });

  const el = document.getElementById('root');

  if (!el)
    throw new Error('Root element not found');

  const root = ReactDOM.createRoot(el);
  root.render(<App runtimeURL={runtimeURL} scanURL={scanURL} />);
} catch (e) {
  if (e instanceof Error && e.cause === CONFIGURATION_ERROR)
    alert(e.message);
  else throw e
}
