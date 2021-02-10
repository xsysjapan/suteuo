import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import configureStore from "./redux/configureStore";

Amplify.configure(awsExports);
const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
