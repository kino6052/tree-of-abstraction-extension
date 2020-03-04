import { HistoryService } from "./HistoryService";
import { TreeService } from "./TreeService";
import { onUpload } from "../utils";

export const init = () => {
  // TreeService.getService().next([{ title: "One" }, { title: "Two" }]);
};

export const callback = () => {
  onUpload(json => console.warn(json));
  // TreeService.getService().next([{ title: "One" }, { title: "Two" }]);
};
