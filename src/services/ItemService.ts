import { Subject, BehaviorSubject } from "rxjs";
import { filter, takeWhile, map } from "rxjs/operators";
import { Id, generateUniqueId } from "../utils";

export type HierarchyType = [IExtendedItem, number];

export interface IItem {
  id: Id;
  title: string;
  parentId?: Id;
  children: Id[];
}

export interface IExtendedItem extends IItem {
  visible: boolean;
  done: boolean;
}

export class ItemService {
  private static itemService: ItemService = (null as unknown) as ItemService;
  removeSubject: Subject<{ id: string }>;
  itemSubject: Subject<{
    id: string;
    cb: (item: IExtendedItem) => void;
  }>;
  parentSubject: Subject<{
    id: string;
    cb: (child: IExtendedItem) => void;
  }>;
  itemSearchStateSubject: BehaviorSubject<string>;
  selectedItemStateSubject: BehaviorSubject<string[]>;
  hierarchyStateSubject: BehaviorSubject<HierarchyType[]>;
  constructor() {
    // if (!root) root = new Item("root");

    this.itemSubject = new Subject<{
      id: Id;
      cb: (item: IExtendedItem) => void;
    }>();
    this.removeSubject = new Subject<{ id: Id }>();

    this.parentSubject = new Subject<{
      id: Id;
      cb: (child: IExtendedItem) => void;
    }>();

    this.itemSearchStateSubject = new BehaviorSubject<string>("");

    this.hierarchyStateSubject = new BehaviorSubject<HierarchyType[]>([]);

    this.selectedItemStateSubject = new BehaviorSubject<Id[]>([]);
  }

  static getService = () => {
    if (ItemService.itemService) return ItemService.itemService;
    ItemService.itemService = new ItemService();
    return ItemService.itemService;
  };

  getItem = (id: Id, cb: (item: IExtendedItem) => void) => {
    this.itemSubject.next({ id, cb });
  };

  getItems = (
    ids: Id[],
    cb: (items: IExtendedItem[]) => void,
    forEachCb?: (item: IExtendedItem) => void
  ) => {
    // console.warn(item, forEachCb);
    let count = ids.length || 0;
    const result: IExtendedItem[] = [];
    ids.forEach(id => {
      this.getItem(id, item => {
        if (forEachCb) forEachCb(item);
        result.push(item);
        count -= 1;
        if (count === 0) cb(result);
      });
    });
  };

  getChildren = (
    item: IExtendedItem,
    cb: (children: IExtendedItem[]) => void,
    forEachCb?: (item: IExtendedItem) => void
  ) => {
    if (item.children.length === 0) cb([]);
    this.getItems(item.children, cb, forEachCb);
  };

  add = (parentId: Id) => {
    new Item("Untitled", parentId);
  };

  remove = (id: Id) => {
    // const root = this.root;
    // if (id === root.id) return;
    this.removeSubject.next({ id });
  };

  setVisible = (
    id: Id,
    isVisible: boolean,
    cb: (item: IExtendedItem) => void
  ) => {
    this.itemSubject.next({
      id,
      cb: item => {
        item.visible = isVisible;
        cb(item);
      }
    });
  };

  getIndentation = (item: IExtendedItem, cb: (indentation: number) => void) => {
    let result: number = 0;
    const stack: string[] = [item.id];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      this.itemSubject.next({
        id: cur,
        cb: item => {
          result += 1;
          if (item.parentId) {
            stack.push(item.parentId!);
          }
        }
      });
    }
    cb(result - 1);
  };

  getHierarchy = (
    item: IExtendedItem,
    cb: (result: Array<[IExtendedItem, number]>) => void,
    forEachCb?: (item: IExtendedItem) => void
  ) => {
    const stack: Array<[IExtendedItem, number]> = [[item, 0]];
    const result: Array<[IExtendedItem, number]> = [];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      result.push(cur);
      this.getChildren(cur[0], children => {
        children.reverse().forEach(c => {
          if (typeof forEachCb === "function") forEachCb(c);
          this.getIndentation(c, indentation => {
            stack.push([c, indentation]);
          });
        });
      });
    }
    cb(result);
  };

  updateHierarchy = (root: IExtendedItem) =>
    this.getHierarchy(
      root,
      hierarchy => {
        this.hierarchyStateSubject.next(hierarchy);
      },
      item => {
        const query = this.itemSearchStateSubject.getValue();
        if (!query) return;
        item.visible = search(item, query);
      }
    );
  collapseAll = (id: Id, cb: () => void) => {
    this.getItem(id, item => {
      this.getHierarchy(item, cb, item => {
        item.visible = false;
      });
    });
  };

  uncollapseChildren = (id: Id, cb: () => void) => {
    this.getItem(id, item => {
      this.getChildren(item, cb, item => {
        item.visible = true;
      });
    });
  };

  getAreChildrenVisible = (
    id: Id,
    cb: (areChildrenVisible: boolean) => void
  ) => {
    let areChildrenVisible = true;
    this.getItem(id, item => {
      this.getChildren(
        item,
        () => {
          cb(areChildrenVisible);
        },
        item => {
          areChildrenVisible = areChildrenVisible && item.visible;
        }
      );
    });
  };

  collapse = (id: Id, cb: () => void) => {
    this.getAreChildrenVisible(id, areChildrenVisible => {
      if (areChildrenVisible) this.collapseAll(id, cb);
      else this.uncollapseChildren(id, cb);
    });
  };

  select = (id: Id) => {
    this.selectedItemStateSubject.next([id]);
  };

  addToSelection = (id: Id) => {
    const selectedIds = this.selectedItemStateSubject.getValue();
    this.selectedItemStateSubject.next([...selectedIds, id]);
  };
}

export const search = (item: IExtendedItem, query: string) => {
  const title = item.title.toLocaleLowerCase();
  const q = query.toLocaleLowerCase();
  if (title.includes(q)) return true;
  return false;
};

export class Item implements IExtendedItem {
  id: Id;
  title: string;
  parentId: Id | undefined;
  visible: boolean = true;
  done: boolean = false;
  children: Id[] = [];
  meta: {} = {};
  private addChild = (parentId: Id) => {
    const { itemSubject } = ItemService.getService();
    itemSubject.next({
      id: parentId,
      cb: parent => {
        parent.children.push(this.id);
      }
    });
  };
  constructor(title: string, id: Id = generateUniqueId(), parentId?: Id) {
    const { removeSubject, itemSubject } = ItemService.getService();
    this.id = id;
    this.title = title;
    // Respond to getNodeById Requests
    itemSubject
      .pipe(
        takeWhile(() => !this.done),
        filter(({ id }) => id === this.id)
      )
      .subscribe(({ cb }) => cb(this));
    removeSubject.pipe(takeWhile(() => !this.done)).subscribe(({ id }) => {
      this.children = this.children.filter(c => c !== id);
      if (id === this.id) this.done = true;
    });
    if (parentId) {
      this.parentId = parentId;
      this.addChild.call(this, parentId);
    }
  }
}
