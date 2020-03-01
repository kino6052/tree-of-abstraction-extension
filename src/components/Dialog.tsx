import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSharedState } from "../utils";
import { DialogService } from "../services/DialogService";
import { ActionService, EAction } from "../services/ActionService";

export const AlertDialog: React.SFC = () => {
  const dialogService = DialogService.getService();
  const [{ isOpen, message, title, content }] = useSharedState(
    dialogService.dialogSubject
  );
  const actionService = ActionService.getService();
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => actionService.next(EAction.CancelDialog, {})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              actionService.next(EAction.CancelDialog, {});
            }}
            color="primary"
          >
            Disagree
          </Button>
          <Button
            onClick={() => actionService.next(EAction.SubmitDialog, {})}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
