import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import BounteousTheme from "./components/BounteousTheme/BounteousTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BounteousTheme />
    <App />
  </React.StrictMode>
);
