import Dialog from "@material-ui/core/Dialog";
import * as React from "react";
import { ActionService, EAction } from "../services/ActionService";
import { DialogService } from "../services/DialogService";
import { useSharedState } from "../utils";

export const AlertDialog: React.SFC = () => {
  const dialogService = DialogService.getService();
  const [{ isOpen, content }] = useSharedState(dialogService.dialogSubject);
  const actionService = ActionService.getService();
  return (
    <div>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => actionService.next(EAction.CloseDialog, {})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {content}
      </Dialog>
    </div>
  );
};
