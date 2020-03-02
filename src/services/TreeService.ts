import { BehaviorSubject, combineLatest } from "rxjs";
import {
  generateUniqueId,
  Id,
  sendMessage,
  EPersistenceMessage
} from "../utils";
import { Item, IItem, ItemService } from "./ItemService";
import { INote } from "./NoteService";
import { skip, filter, skipWhile } from "rxjs/operators";
import { HistoryService } from "./HistoryService";

export interface Tree {
  title: string;
  id: Id;
  hierarchy: IItem[];
  notes: INote[];
}

export class TreeService {
  treeSubject: BehaviorSubject<Tree[]>;
  activeTree: Tree;

  private static treeService: TreeService = (null as unknown) as TreeService;

  constructor() {
    this.treeSubject = new BehaviorSubject([]);

    const itemService = ItemService.getService();
    const historyService = HistoryService.getService();

    this.onLoadTrees();
    this.loadTrees();

    combineLatest(itemService.hierarchyStateSubject)
      .pipe(
        skip(1),
        skipWhile(() => !historyService.isTreePath())
      )
      .subscribe(([hierarchy]) => {
        const activeTree = this.getActiveTree();
        if (!activeTree) return;
        const { id } = this.activeTree;
        const [tree, trees] = this.getTreeById(id);
        if (!tree) return;
        tree.hierarchy = itemService.getItemObjectsFromHierarchy(hierarchy);
        this.saveTrees(trees);
      });

    this.treeSubject
      .pipe(
        skip(1),
        skipWhile(() => !historyService.isDefaultPath())
      )
      .subscribe(trees => {
        this.saveTrees(trees);
      });
  }

  generateTree = (tree: Tree) => {
    return tree.hierarchy.map(
      ({ id, parentId, title }) => new Item(title, id, parentId)
    )[0];
  };

  static getService = () => {
    if (TreeService.treeService) return TreeService.treeService;
    TreeService.treeService = new TreeService();
    return TreeService.treeService;
  };

  getTreeById = (id: Id): [Tree | undefined, Tree[]] => {
    const trees = this.treeSubject.getValue();
    const tree: Tree | undefined = trees.find(t => t.id === id);
    return [tree, trees];
  };

  loadTrees = () => {
    sendMessage(EPersistenceMessage.LoadTrees, {});
  };

  onLoadTrees = () => {
    document.addEventListener(
      EPersistenceMessage.TreesLoaded,
      (e: CustomEvent) => {
        // console.warn("Trees Loaded", e);
        const { detail: { trees = [] as Tree[] } = {} } = e;
        this.treeSubject.next(trees);
      }
    );
  };

  saveTrees = (trees: Tree[]) => {
    sendMessage(EPersistenceMessage.SaveTree, { trees });
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
      hierarchy: [{ id: "root", children: [], title: "Root" }],
      notes: []
    };
    this.addTree(newTree);
  };
}
