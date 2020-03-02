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
  activeTree: Tree;

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

  setActiveTree = (tree: Tree) => (this.activeTree = tree);

  getActiveTree = () => this.activeTree;

  createTree = (title: string) => {
    const newTree: Tree = {
      title,
      id: generateUniqueId(),
      hierarchy: [{ id: "root", children: [], title: "Root" }]
    };
    this.addTree(newTree);
  };
}
