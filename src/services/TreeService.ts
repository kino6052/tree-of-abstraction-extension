import { BehaviorSubject, combineLatest, timer } from "rxjs";
import {
  generateUniqueId,
  Id,
  sendMessage,
  EPersistenceMessage
} from "../utils";
import { EditableItem, IItem, ItemService } from "./ItemService";
import { INote, NoteService, Note, EditableNote } from "./NoteService";
import { skip, filter, skipWhile, debounce } from "rxjs/operators";
import { HistoryService } from "./HistoryService";

export interface Tree {
  title: string;
  id: Id;
  hierarchy: IItem[];
  notes: INote[];
}

const DEBOUNCE_INTERVAL = 1000;

export class TreeService {
  treeSubject: BehaviorSubject<Tree[]>;
  activeTree: Tree;

  private static treeService: TreeService = (null as unknown) as TreeService;

  constructor() {
    this.treeSubject = new BehaviorSubject([]);

    const itemService = ItemService.getService();
    const noteService = NoteService.getService();

    const historyService = HistoryService.getService();

    // This is the update logic for every action
    // on hierarchy and notes
    combineLatest(
      itemService.hierarchyStateSubject,
      noteService.notesStateSubject
    )
      .pipe(
        skip(2), // Skip for Both
        skipWhile(() => !historyService.isTreePath()),
        debounce(() => timer(DEBOUNCE_INTERVAL))
      )
      .subscribe(([hierarchy, notes]) => {
        // TODO: Simplify
        const activeTree = this.getActiveTree();
        if (!activeTree) return;
        const { id } = this.activeTree;
        const [tree] = this.getTreeById(id);
        if (!tree) return;
        tree.hierarchy = itemService.getItemObjectsFromHierarchy(hierarchy);
        tree.notes = notes;
        this.saveTree(tree);
      });

    // This is OK
    this.treeSubject
      .pipe(
        skip(2), // Skip subscription and initial load
        skipWhile(() => !historyService.isDefaultPath()),
        debounce(() => timer(DEBOUNCE_INTERVAL))
      )
      .subscribe(trees => {
        this.saveTreeIds(trees);
      });

    // Load Trees from Sync Storage
    this.onLoadTrees();
    this.loadTrees();
  }

  generateTree = (tree: Tree) => {
    // Required to Properly Initialize Logic
    // For Both Notes and Items
    const itemService = ItemService.getService();
    const hierarchy = tree.hierarchy.map(
      ({ id, parentId, title, isCollapsed, visible }: EditableItem) =>
        new EditableItem(title, id, parentId, visible, isCollapsed)
    );
    tree.notes.map(({ title, id, html, labels }) => {
      const labelIds = labels.map(l => l.id);
      itemService.getItems(labelIds, newLabels => {
        new EditableNote(title, id, html, newLabels);
      });
    });
    return hierarchy[0];
  };

  downloadTree = (id: Id) => {
    const result = this.treeSubject.getValue().find(t => t.id === id);
    if (!result) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(result));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tree.json");
    dlAnchorElem.click();
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
        const { detail: { trees = [] as Tree[] } = {} } = e;
        this.treeSubject.next(trees);
      }
    );
  };

  saveTree = (tree: Tree) => {
    sendMessage(EPersistenceMessage.SaveTree, { tree });
  };

  saveTreeIds = (trees: Tree[]) => {
    const treeIds = trees.map(t => t.id);
    sendMessage(EPersistenceMessage.SaveTreeIds, { treeIds });
  };

  next = (trees: Tree[]) => {
    this.treeSubject.next(trees);
  };

  addTree = (tree: Tree) => {
    if (!tree) return;
    const old = this.treeSubject.getValue();
    const newTrees = [...old, tree];
    this.treeSubject.next(newTrees);
    this.saveTree(tree);
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
