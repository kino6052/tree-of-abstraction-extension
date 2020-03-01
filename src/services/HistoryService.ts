import { BehaviorSubject } from "rxjs";
import { createMemoryHistory, MemoryHistory } from "history";

const DEFAULT_PATH = "/";

enum Path {
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
      console.warn(location);
    });
  }

  static getService = () => {
    if (HistoryService.historyService) return HistoryService.historyService;
    HistoryService.historyService = new HistoryService();
    return HistoryService.historyService;
  };

  generateTreeWithIdPath = (id: string) => `${Path.Tree}/${id}`;

  next = (location: string) => {
    this.historySubject.next(location);
  };
}
