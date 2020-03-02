import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input
} from "@material-ui/core";
import * as React from "react";
import { ActionService, EAction } from "../services/ActionService";

const unboxEvent = (
  e: React.ChangeEvent | React.KeyboardEvent | React.MouseEvent
): string => {
  const {
    target: {
      // @ts-ignore
      value = ""
    } = {}
  } = e || {};
  return value;
};

export const CreateNewTreeDialog: React.SFC = () => {
  const [title, setTitle] = React.useState("");
  const actionService = ActionService.getService();
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Create New Tree</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>Hi!</Box>
          <Box>
            <Input value={title} onChange={e => setTitle(unboxEvent(e))} />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
        >
          Disagree
        </Button>
        <Button
          onClick={() => {
            actionService.next(EAction.CreateNewTree, { title });
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
