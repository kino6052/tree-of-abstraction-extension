import { HistoryService } from "./HistoryService";
import { TreeService } from "./TreeService";

export const init = () => {
  TreeService.getService().next([{ title: "One" }, { title: "Two" }]);
};

export const callback = () => {
  // TreeService.getService().next([{ title: "One" }, { title: "Two" }]);
};
