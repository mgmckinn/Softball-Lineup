/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => console.log("App is ready for offline use!"),
  onUpdate: (registration) => {
    if (window.confirm("New version available! Reload to update?")) {
      window.location.reload();
    }
  },
});
