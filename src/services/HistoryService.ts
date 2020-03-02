import { BehaviorSubject } from "rxjs";
import { createMemoryHistory, MemoryHistory } from "history";

const DEFAULT_PATH = "/";

export enum EPath {
  Default = "/",
  Tree = "/tree"
}

export class HistoryService {
  historySubject: BehaviorSubject<string>;
  history: MemoryHistory;
  private static historyService: HistoryService = (null as unknown) as HistoryService;

  constructor() {
    this.history = createMemoryHistory();
    this.historySubject = new BehaviorSubject(DEFAULT_PATH);
    this.historySubject.subscribe(location => {
      this.history.push(location);
      console.warn(location, this.history, this.history.location.pathname);
    });
  }

  static getService = () => {
    if (HistoryService.historyService) return HistoryService.historyService;
    HistoryService.historyService = new HistoryService();
    return HistoryService.historyService;
  };

  generateTreeWithIdPath = (id: string) => `${EPath.Tree}/${id}`;

  next = (location: string) => {
    this.historySubject.next(location);
  };
}
