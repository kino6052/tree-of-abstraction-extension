// import React from "react";
import styled from "styled-components";

import { HierarchyList, HierarchyItem } from "./HierarchyItem";
import { ArrowBack, Add } from "@material-ui/icons";
import * as React from "react";
import { Search } from "./Search";
import { IconButton } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { NoteItem } from "./NoteItem";
import { createMemoryHistory, createBrowserHistory } from "history";
import { Router, Route } from "react-router-dom";
import { Subject } from "rxjs";
import { useSharedState } from "../utils";
import { BehaviorSubject } from "rxjs";

const drawerWidth = 240;

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

const history = createMemoryHistory();

const historySubject = new BehaviorSubject("/");

historySubject.subscribe(location => {
  history.push(location);
});

export const MyDrawer: React.SFC = () => {
  const [] = useSharedState(historySubject);
  return (
    <Router history={history}>
      <DrawerWrapper>
        <div className={"root"}>
          <CssBaseline />
          <AppBar position="fixed" className={"appBar"}>
            <Toolbar classes={{ root: "root" }}>
              <Typography variant="h6" noWrap>
                Root
              </Typography>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                // onClick={handleDrawerOpen}
                // className={clsx(open && classes.hide)}
              >
                <Add />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            className={"drawer"}
            variant="permanent"
            classes={{
              paper: "drawer"
            }}
            anchor="left"
          >
            <Route exact path="/">
              <div className={"toolbar"}>
                {/* <ArrowBack /> */}
                <Typography>Toolset</Typography>
              </div>
              <Divider />
              <HierarchyList>
                <HierarchyItem
                  // @ts-ignore
                  onClick={() => {
                    console.warn("here");
                    history.push("/stuff");
                  }}
                  text={"Personal Library"}
                  icon="test"
                />
              </HierarchyList>
            </Route>
            <Route path="/stuff">
              <div className={"toolbar"}>
                <ArrowBack onClick={() => historySubject.next("/")} />
                <Typography>Personal Library</Typography>
              </div>
              <Divider />
              <Search />
              <HierarchyList>
                {[1, 2, 3].map(i => (
                  <HierarchyItem text={`${i}`} indentation={i} />
                ))}
              </HierarchyList>
            </Route>
          </Drawer>
          <main className={"content"}>
            <Route path="/stuff">
              <div className={"toolbar"} />
              <NoteItem />
              <NoteItem />
              <NoteItem />
            </Route>
          </main>
        </div>
        ); }
      </DrawerWrapper>
    </Router>
  );
};
