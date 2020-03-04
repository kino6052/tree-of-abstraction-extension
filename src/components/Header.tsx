import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/Add";
import Upload from "@material-ui/icons/CloudUpload";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { ActionService, EAction } from "../services/ActionService";
import { EPath } from "../services/HistoryService";
import { TreeService } from "../services/TreeService";
import { CreateNewTreeDialog, CreateNewNoteDialog } from "./DialogInputs";
import styled from "styled-components";

export const Header: React.SFC = () => {
  return (
    <AppBar position="fixed" className={"appBar"}>
      <Toolbar classes={{ root: "root" }}>
        <Switch>
          <Route exact path={EPath.Default}>
            <MainMenuHeaderContent />
          </Route>
          <Route path={EPath.Tree}>
            <TreeHeaderContent />
          </Route>
        </Switch>
      </Toolbar>
    </AppBar>
  );
};

export const UploadWrapper = styled.div`
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
  }
`;

export const MainMenuHeaderContent: React.SFC = () => {
  const actionService = ActionService.getService();
  return (
    <React.Fragment>
      <Typography variant="h6" noWrap>
        Toolset
      </Typography>
      <div>
        <IconButton
          color="inherit"
          aria-label="Create New Tree"
          edge="end"
          onClick={() =>
            actionService.next(EAction.OpenDialog, {
              content: <CreateNewTreeDialog />
            })
          }
        >
          <Add />
        </IconButton>
        <IconButton color="inherit" aria-label="Upload Tree" edge="end">
          <UploadWrapper>
            <label>
              <Upload />
              <input
                type="file"
                className="jsonUpload"
                accept="application/json"
              />
            </label>
          </UploadWrapper>
        </IconButton>
      </div>
    </React.Fragment>
  );
};

export const TreeHeaderContent: React.SFC = () => {
  const actionService = ActionService.getService();
  const treeService = TreeService.getService();
  const { title = "" } = treeService.activeTree || {};
  return (
    <React.Fragment>
      <Typography variant="h6" noWrap>
        {title}
      </Typography>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={() =>
          actionService.next(EAction.OpenDialog, {
            content: <CreateNewNoteDialog />
          })
        }
      >
        <Add />
      </IconButton>
    </React.Fragment>
  );
};
