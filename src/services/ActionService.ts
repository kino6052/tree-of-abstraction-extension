import { BehaviorSubject } from "rxjs";
import { Subscriptions } from "./Subscriptions";

export enum EAction {
  ChangeLocation = "ChangeLocation"
}

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
  [EAction.ChangeLocation]: { location: string };
}

export type Entry = { [K in EAction]?: IActionParam[K] };

export class ActionService {
  actionSubject: BehaviorSubject<Entry>;
  private static actionService: ActionService = (null as unknown) as ActionService;

  constructor() {
    this.actionSubject = new BehaviorSubject({});
    Object.keys(Subscriptions).forEach(k => {
      Subscriptions[k as keyof typeof Subscriptions](this.actionSubject);
    });
  }

  static getService = () => {
    if (ActionService.actionService) return ActionService.actionService;
    ActionService.actionService = new ActionService();
    return ActionService.actionService;
  };

  next = (entry: Entry) => {
    this.actionSubject.next(entry);
  };
}
