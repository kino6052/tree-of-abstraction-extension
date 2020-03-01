import * as React from "react";
import { AlertDialog } from "./components/Dialog";
import { MyDrawer } from "./components/Drawer";

export const App: React.SFC = () => {
  return (
    <React.Fragment>
      <AlertDialog />
      <MyDrawer />
    </React.Fragment>
  );
};
