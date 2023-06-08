import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./styles/index.css";

import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./redux/store";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
