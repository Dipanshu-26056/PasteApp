import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e1e1e",
              color: "#e5e5e5",
              border: "0.5px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
              borderRadius: "8px",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
