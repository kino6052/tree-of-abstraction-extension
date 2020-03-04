import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  TextField,
  Typography,
  FormControl
} from "@material-ui/core";
import * as React from "react";
import { ActionService, EAction } from "../services/ActionService";
import { unboxEvent } from "../utils";

export const CreateNewTreeDialog: React.SFC = () => {
  const [title, setTitle] = React.useState("");
  const actionService = ActionService.getService();
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Create New Tree</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>Create new Tree</Box>
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

export const CreateNewNoteDialog: React.SFC = () => {
  const [title, setTitle] = React.useState("Untitled");
  const [subtitle, setSubtitle] = React.useState("Subtitle");
  const [html, setHtml] = React.useState("<h1>Example</h1>");
  const actionService = ActionService.getService();
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Create New Note</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Create new Note</Typography>
          <FormControl fullWidth>
            <TextField
              label="Title"
              defaultValue={title}
              value={title}
              onChange={e => setTitle(unboxEvent(e))}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Subtitle"
              defaultValue={subtitle}
              value={subtitle}
              onChange={e => setSubtitle(unboxEvent(e))}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="HTML"
              multiline
              rows="4"
              defaultValue={html}
              margin="normal"
              variant="outlined"
              value={html}
              onChange={e => setHtml(unboxEvent(e))}
            />
          </FormControl>
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
            actionService.next(EAction.AddNote, { title, html });
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
