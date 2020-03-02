import * as React from "react";
import Drawer from "@material-ui/core/Drawer";
import Switch from "@material-ui/core/Switch";
import { Route } from "react-router-dom";
import { MainMenu, TreeMenu } from "./SideMenus";
import { EPath } from "../services/HistoryService";

export const AppDrawer: React.SFC = () => {
  return (
    <Drawer
      className={"drawer"}
      variant="permanent"
      classes={{
        paper: "drawer"
      }}
      anchor="left"
    >
      <Switch>
        <Route exact path={EPath.Default}>
          <MainMenu />
        </Route>
        <Route path={EPath.Tree}>
          <TreeMenu />
        </Route>
      </Switch>
    </Drawer>
  );
};
