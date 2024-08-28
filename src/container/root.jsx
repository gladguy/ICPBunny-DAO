import { BrowserRouter as Router } from "react-router-dom";
import App from "../App";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useEffect } from "react";
import { initJuno } from "@junobuild/core";

const Root = () => {
  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "fw25x-naaaa-aaaal-adbpq-cai",
      }))();
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </>
  );
};

export default Root;
