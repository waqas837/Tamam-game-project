import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import socket from "./socket.js";
// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      },
      (error) => {
        console.error("Service Worker registration failed:", error);
      }
    );
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
  </>
);
