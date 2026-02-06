import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./Component/redux/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SocketProvider  from "./socket/socketProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </QueryClientProvider>
      </Provider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>,
);
