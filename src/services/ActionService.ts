import { BehaviorSubject } from "rxjs";
import { Subscriptions } from "./Subscriptions";
import { Tree } from "./TreeService";
import { Id } from "../utils";
import { ChangeEvent } from "react";
import { IExtendedItem } from "./ItemService";
import { INote } from "./NoteService";

export enum EAction {
  CreateNewTree = "CreateNewTree",
  ChangeLocation = "ChangeLocation",
  Nothing = "Nothing",
  CloseDialog = "CloseDialog",
  SubmitDialog = "SubmitDialog",
  OpenDialog = "OpenDialog",
  GoToTree = "GoToTree",
  EditItem = "EditItem",
  RemoveItem = "RemoveItem",
  AddChild = "AddChild",
  AddNote = "AddNote",
  HierarchyInputChange = "HierarchyInputChange",
  ToggleCollapse = "ToggleCollapse",
  SelectItem = "SelectItem",
  UpdateHierarchy = "UpdateHierarchy",
  RemoveNote = "RemoveNote",
  EditNote = "EditNote",
  RemoveLabel = "RemoveLabel"
}

export type TActionSubject = BehaviorSubject<Entry<keyof IActionParam>>;

export interface IActionParam {
  [EAction.CreateNewTree]: { title: string };
  [EAction.CloseDialog]: {};
  [EAction.SubmitDialog]: {};
  [EAction.ChangeLocation]: { location: string };
  [EAction.Nothing]: {};
  [EAction.GoToTree]: { tree: Tree };
  [EAction.AddChild]: { id: Id };
  [EAction.EditItem]: { id: Id };
  [EAction.RemoveItem]: { id: Id };
  [EAction.AddNote]: { title: string; html: string };
  [EAction.ToggleCollapse]: { id: Id };
  [EAction.SelectItem]: { id: Id };
  [EAction.RemoveNote]: { id: Id };
  [EAction.EditNote]: { id: Id };
  [EAction.RemoveLabel]: { note: INote; label: IExtendedItem };
  [EAction.OpenDialog]: {
    content: React.ReactNode;
  };
  [EAction.HierarchyInputChange]: {
    id: Id;
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  };
  [EAction.UpdateHierarchy]: {};
}

export type Entry<T extends keyof IActionParam> = [T, IActionParam[T]];

export class ActionService {
  actionSubject: BehaviorSubject<Entry<keyof IActionParam>>;
  private static actionService: ActionService = (null as unknown) as ActionService;

  constructor() {
    this.actionSubject = new BehaviorSubject([EAction.Nothing, {}]);
    Object.keys(Subscriptions).forEach(k => {
      Subscriptions[k as keyof typeof Subscriptions](this.actionSubject);
    });
  }

  static getService = () => {
    if (ActionService.actionService) return ActionService.actionService;
    ActionService.actionService = new ActionService();
    return ActionService.actionService;
  };

  next = <K extends keyof IActionParam>(key: K, props: IActionParam[K]) => {
    this.actionSubject.next([key, props]);
  };
}
