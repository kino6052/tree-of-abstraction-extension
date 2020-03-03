// import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import styled from "styled-components";
import { ActionService, EAction } from "../services/ActionService";
import { EPath, HistoryService } from "../services/HistoryService";
import { TreeService } from "../services/TreeService";
import { useSharedState } from "../utils";
import { AppDrawer } from "./AppDrawer";
import { Header } from "./Header";
import { NoteItem } from "./NoteItem";
import { TreeItem } from "./TreeItem";
import { NoteService } from "../services/NoteService";

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

export const NoteList: React.SFC = () => {
  const actionService = ActionService.getService();
  const { notesStateSubject } = NoteService.getService();
  const [notes] = useSharedState(notesStateSubject);
  return (
    <React.Fragment>
      {notes.map(note => (
        <NoteItem note={note} />
      ))}
    </React.Fragment>
  );
};

export const Main: React.SFC = () => {
  return (
    <main className={"content"}>
      <div className={"toolbar"} />
      <Switch>
        <Route exact path={EPath.Default}>
          <TreeList />
        </Route>
        <Route path={EPath.Tree}>
          <NoteList />
        </Route>
      </Switch>
    </main>
  );
};

export const Dashboard: React.SFC = () => {
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