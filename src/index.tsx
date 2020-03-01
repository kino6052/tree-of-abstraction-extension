import * as React from "react";
import * as ReactDOM from "react-dom";

import { MyDrawer } from "./components/Drawer";
import { init } from "./services";

init();
ReactDOM.render(<MyDrawer />, document.getElementById("example"));
