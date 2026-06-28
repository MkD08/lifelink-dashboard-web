import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "./features/auth/store/toast.store";
import FirebaseMessagingService from "./services/firebaseMessaging.service";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./features/auth/store/auth.store";

// Active l'écoute des notifications lorsque le dashboard est ouvert
FirebaseMessagingService.onForegroundMessage();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);