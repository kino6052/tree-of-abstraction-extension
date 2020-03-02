// import React from "react";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/Add";
import styled from "styled-components";
import { ActionService, EAction } from "../services/ActionService";
import { HistoryService } from "../services/HistoryService";
import { useSharedState } from "../utils";
import { NoteItem } from "./NoteItem";
import { MainMenu, TreeMenu } from "./SideMenus";
import { TreeService } from "../services/TreeService";
import { TreeItem } from "./TreeItem";
import { CreateNewTreeDialog } from "./DialogInputs";
import { generate } from "rxjs";

const drawerWidth = 400;

const DrawerWrapper = styled.div`
  .root {
    display: "flex";
  }
  .appBar {
    width: calc(100% - ${drawerWidth}px);
    margin-left: ${drawerWidth}px;
    display: flex;
    flex-direction: row;
    .root {
      width: 100%;
      justify-content: space-between;
    }
  }
  .drawer {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
  .drawerPaper {
    width: drawerWidth;
  }
  .toolbar {
    height: 56px;
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    padding: 0 24px;
    width: 100%;
    /* theme.mixins.toolbar, */
    svg {
      margin-right: 24px;
    }
  }
  .content {
    flex-grow: 1;import Drawer from "@material-ui/core/Drawer";
    margin-left: ${drawerWidth}px;
    padding: 24px;
    /* padding-top: 86px; */
    /* background-color: theme.palette.background.default}; */
    /* padding: theme.spacing(3); */
  }
  .search {
    width: 100%;
  }
`;

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
        <Route exact path="/">
          <MainMenu />
        </Route>
        <Route path="/tree">
          <TreeMenu />
        </Route>
      </Switch>
    </Drawer>
  );
};

export const TreeList: React.SFC = () => {
  const treeService = TreeService.getService();
  const actionService = ActionService.getService();
  const [trees] = useSharedState(treeService.treeSubject);
  return (
    <React.Fragment>
      {trees.map(tree => (
        <TreeItem
          tree={tree}
          // @ts-ignore
          onClick={() => {
            actionService.next(EAction.GoToTree, { tree });
          }}
        />
      ))}
    </React.Fragment>
  );
};

export const Main: React.SFC = () => {
  return (
    <main className={"content"}>
      <div className={"toolbar"} />
      <Switch>
        <Route exact path="/">
          <TreeList />
        </Route>
        <Route path="/tree">
          <NoteItem />
          <NoteItem />
          <NoteItem />
        </Route>
      </Switch>
    </main>
  );
};

export const Header: React.SFC = () => {
  const actionService = ActionService.getService();
  return (
    <AppBar position="fixed" className={"appBar"}>
      <Toolbar classes={{ root: "root" }}>
        <Typography variant="h6" noWrap>
          Root
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={() =>
            actionService.next(EAction.OpenDialog, {
              content: <CreateNewTreeDialog />
            })
          }
          // className={clsx(open && classes.hide)}
        >
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export const MyDrawer: React.SFC = () => {
  const historyService = HistoryService.getService();
  const [] = useSharedState(historyService.historySubject);
  return (
    <Router history={historyService.history}>
      <DrawerWrapper>
        <div className={"root"}>
          <CssBaseline />
          <Header />
          <AppDrawer />
          <Main />
        </div>
      </DrawerWrapper>
    </Router>
  );
};
