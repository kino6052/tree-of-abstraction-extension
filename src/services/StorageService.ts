import { BehaviorSubject } from "rxjs";
import Dexie from "dexie";
import { Tree } from "./TreeService";
import { Id } from "../utils";

export class DatabaseService {
  databaseSubject: BehaviorSubject<string>;
  private static databaseService: DatabaseService = (null as unknown) as DatabaseService;
  db: Dexie;
  constructor() {
    this.databaseSubject = new BehaviorSubject("");
    this.databaseSubject.subscribe(location => {});
    this.db = new Dexie("tree-db");
    this.db.version(1).stores({
      trees: "id,hierarchy,notes,title"
    });
  }

  static getService = () => {
    if (DatabaseService.databaseService) return DatabaseService.databaseService;
    DatabaseService.databaseService = new DatabaseService();
    return DatabaseService.databaseService;
  };

  next = (location: string) => {
    this.databaseSubject.next(location);
  };

  addOrUpdateTree = (tree: Tree, cb: () => void) => {
    // @ts-ignore
    this.db.trees.put(tree).then(cb);
  };

  removeTree = (id: Id, cb: () => void) => {
    // @ts-ignore
    this.db.trees.delete(id);
  };

  getAll = (cb: (trees: Tree[]) => void) => {
    // @ts-ignore
    this.db.trees.toArray().then(cb);
  };
}
