import { BehaviorSubject } from "rxjs";
import { generateUniqueId, Id } from "../utils";
import { Item, IItem } from "./ItemService";

export interface Tree {
  title: string;
  id: Id;
  hierarchy: IItem[];
}

export class TreeService {
  treeSubject: BehaviorSubject<Tree[]>;
  private static treeService: TreeService = (null as unknown) as TreeService;

  constructor() {
    this.treeSubject = new BehaviorSubject([]);
    this.treeSubject.subscribe(trees => {
      console.warn(trees);
    });
  }

  static getService = () => {
    if (TreeService.treeService) return TreeService.treeService;
    TreeService.treeService = new TreeService();
    return TreeService.treeService;
  };

  next = (trees: Tree[]) => {
    this.treeSubject.next(trees);
  };

  addTree = (tree: Tree) => {
    const old = this.treeSubject.getValue();
    this.treeSubject.next([...old, tree]);
  };

  getTrees = () => this.treeSubject.getValue();

  createTree = (title: string) => {
    const newTree: Tree = {
      title,
      id: generateUniqueId(),
      hierarchy: []
    };
    this.addTree(newTree);
  };
}
