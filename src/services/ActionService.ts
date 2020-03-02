import { BehaviorSubject } from "rxjs";
import { Subscriptions } from "./Subscriptions";
import { Tree } from "./TreeService";

export enum EAction {
  CreateNewTree = "CreateNewTree",
  ChangeLocation = "ChangeLocation",
  Nothing = "Nothing",
  CloseDialog = "CloseDialog",
  SubmitDialog = "SubmitDialog",
  OpenDialog = "OpenDialog",
  GoToTree = "GoToTree"
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
  [EAction.CreateNewTree]: { title: string };
  [EAction.CloseDialog]: {};
  [EAction.SubmitDialog]: {};
  [EAction.OpenDialog]: {
    content: React.ReactNode;
  };
  [EAction.ChangeLocation]: { location: string };
  [EAction.Nothing]: {};
  [EAction.GoToTree]: { tree: Tree };
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
