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
import { Tree } from "../services/TreeService";
import { Note, INote } from "../services/NoteService";
import { Item } from "../services/ItemService";

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

export const RemoveTreeDialog: React.SFC<{ tree: Tree }> = props => {
  const actionService = ActionService.getService();
  const { tree: { id, title } = {} as Tree } = props;
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Remove Tree "{title}"?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>Are you sure you want to remove the tree?</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            actionService.next(EAction.RemoveTree, { id });
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
          autoFocus
        >
          Remove
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export const RemoveNoteDialog: React.SFC<{ note: INote }> = props => {
  const actionService = ActionService.getService();
  const { note: { id, title } = {} as Note } = props;
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Remove Note "{title}"?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>Are you sure you want to remove the note?</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            actionService.next(EAction.RemoveNote, { id });
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
          autoFocus
        >
          Remove
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export const RemoveItemDialog: React.SFC<{ item: Item }> = props => {
  const actionService = ActionService.getService();
  const { item: { id, title } = {} as Item } = props;
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">Remove Item "{title}"?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>Are you sure you want to remove the item?</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            actionService.next(EAction.RemoveItem, { id });
            actionService.next(EAction.CloseDialog, {});
          }}
          color="primary"
          autoFocus
        >
          Remove
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
