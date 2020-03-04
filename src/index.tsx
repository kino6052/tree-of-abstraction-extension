import * as React from "react";
import * as ReactDOM from "react-dom";

import { init, callback } from "./services";
import { App } from "./App";

init();
ReactDOM.render(<App />, document.getElementById("example"), callback);
