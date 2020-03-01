import * as React from "react";
import * as ReactDOM from "react-dom";

import { init } from "./services";
import { App } from "./App";

init();
ReactDOM.render(<App />, document.getElementById("example"));
