import * as React from "react";
import { AlertDialog } from "./components/Dialog";
import { Dashboard } from "./components/Dashboard";

export const App: React.SFC = () => {
  return (
    <React.Fragment>
      <AlertDialog />
      <Dashboard />
    </React.Fragment>
  );
};
