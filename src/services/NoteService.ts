import { IExtendedItem } from "./ItemService";
import { Id } from "../utils";

export interface INote {
  id: Id;
  title: string;
  labels: IExtendedItem[];
  html: string;
  done: boolean;
  visible: boolean;
}
