import { BehaviorSubject } from "rxjs";
import { Entry, EAction, IActionParam, TActionSubject } from "./ActionService";
import { filter } from "rxjs/internal/operators/filter";
import { HistoryService } from "./HistoryService";
import { DialogService } from "./DialogService";

const subscribe = <T extends keyof IActionParam>(
  subject: BehaviorSubject<Entry<keyof IActionParam>>,
  action: T,
  callback: (entry: Entry<T>) => void
) => {
  subject.pipe(filter(e => e[0] === action)).subscribe(callback);
};

export const Subscriptions = {
  onHistoryChange: (subject: TActionSubject) => {
    subscribe(subject, EAction.ChangeLocation, ([_, { location }]) => {
      HistoryService.getService().next(location);
    });
  },
  onOpenDialog: (subject: TActionSubject) => {
    subscribe(
      subject,
      EAction.OpenDialog,
      ([_, { title, message, content }]) => {
        console.warn("open");
        DialogService.getService().openDialog(title, message, content);
        // TODO: Implement
      }
    );
  },
  onSubmitDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.SubmitDialog, ([_, {}]) => {
      console.warn("submit");
      // TODO: Implement
    });
  },
  onCancelDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.CancelDialog, ([_, {}]) => {
      console.warn("cancel");
      // TODO: Implement
    });
  }
};
