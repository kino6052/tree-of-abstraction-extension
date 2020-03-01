import { BehaviorSubject } from "rxjs";

export interface Tree {
  title: string;
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

  getTrees = () => this.treeSubject.getValue();
}
