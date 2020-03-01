import { BehaviorSubject } from "rxjs";
import { Entry, EAction } from "./ActionService";
import { filter } from "rxjs/internal/operators/filter";
import { HistoryService } from "./HistoryService";

export const Subscriptions = {
  onHistoryChange: (actionSubject: BehaviorSubject<Entry>) => {
    actionSubject
      .pipe(filter(e => !!e[EAction.ChangeLocation]))
      .subscribe(e => {
        const { location } = e[EAction.ChangeLocation]!;
        HistoryService.getService().next(location);
      });
  }
};
