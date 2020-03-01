import { BehaviorSubject } from "rxjs";
import { Subscriptions } from "./Subscriptions";

export enum EAction {
  ChangeLocation = "ChangeLocation",
  Nothing = "Nothing",
  CancelDialog = "CancelDialog",
  SubmitDialog = "SubmitDialog",
  OpenDialog = "OpenDialog"
}

export type TActionSubject = BehaviorSubject<Entry<keyof IActionParam>>;

export interface IActionParam {
  // [EAction.Add]: { parentId: Id };
  // [EAction.Remove]: { id: Id };
  // [EAction.Update]: Partial<IExtendedItem>;
  // [EAction.Collapse]: { id: Id };
  // [EAction.Select]: { id: Id; add: boolean };
  // [EAction.SetTitle]: { id: Id; title: string };
  // [EAction.Search]: {};
  // [EAction.NoteSearch]: {};
  // [EAction.AddNote]: {};
  // [EAction.RemoveNote]: { id: Id };
  // [EAction.AddLabel]: { id: Id };
  [EAction.CancelDialog]: {};
  [EAction.SubmitDialog]: {};
  [EAction.OpenDialog]: {
    title: string;
    message: string;
    content: React.ReactNode;
  };
  [EAction.ChangeLocation]: { location: string };
  [EAction.Nothing]: {};
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

  next = (key: keyof IActionParam, props: IActionParam[typeof key]) => {
    this.actionSubject.next([key, props]);
  };
}
