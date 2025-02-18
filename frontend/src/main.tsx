import React from "react";
import ReactDOM from "react-dom/client";

// Import Bootstrap CSS and JS if your modal (or other parts) rely on it:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import your custom styles
import "./assets/css/styles.css";

import App from "./App";
import { UserProvider } from "./context/UserContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No 'root' element found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);