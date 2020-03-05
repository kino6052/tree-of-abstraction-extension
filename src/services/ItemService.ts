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
  private static itemService: ItemService;
  itemSubject = new Subject<{
    id: Id;
    cb: (item: IExtendedItem) => void;
  }>();
  removeSubject = new Subject<{ id?: Id }>();

  parentSubject = new Subject<{
    id: Id;
    cb: (child: IExtendedItem) => void;
  }>();

  itemSearchStateSubject = new BehaviorSubject<string>("");

  hierarchyStateSubject = new BehaviorSubject<HierarchyType[]>([]);

  selectedItemStateSubject = new BehaviorSubject<Id[]>([]);

  static getService = () => {
    if (ItemService.itemService) return ItemService.itemService;
    ItemService.itemService = new ItemService();
    return ItemService.itemService;
  };

  changeSelectedItemToNewParent = (id: Id, cb: () => void) => {
    const current = this.selectedItemStateSubject.getValue()[0];
    if (current) {
      this.getItems([id, current], items => {
        const newParent = items[0];
        const item = items[1];
        if (item.parentId) {
          this.getItem(item.parentId!, oldParent => {
            oldParent.children = oldParent.children.filter(c => c !== item.id);
            item.parentId = newParent.id;
            newParent.children = [
              ...newParent.children.filter(c => c !== item.id),
              item.id
            ];
            cb();
          });
        } else {
          item.parentId = newParent.id;
          newParent.children = [
            ...newParent.children.filter(c => c !== item.id),
            item.id
          ];
          cb();
        }
      });
    }
  };

  reset = () => {
    this.removeSubject.next({});
  };

  update = () => {
    const root = this.getRoot();
    if (root) this.updateHierarchy(root);
  };

  getItemObjectsFromHierarchy = (hierarchy: HierarchyType[]): IItem[] =>
    hierarchy.map(([i]) => {
      const {
        id,
        title,
        children,
        parentId,
        isCollapsed,
        visible
      } = i as EditableItem;
      return { id, title, children, parentId, isCollapsed, visible };
    });

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
    const root = this.getRoot();
    if (root && id === root.id) return;
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

  getRoot = () => {
    const hierarchy = this.hierarchyStateSubject.getValue();
    if (hierarchy && hierarchy[0]) return hierarchy[0][0];
    return;
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

  updateHierarchy = (root: IExtendedItem) => {
    if (!root) return;
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
  };

  collapseAll = (id: Id, cb: () => void) => {
    this.getItem(id, (item: EditableItem) => {
      item.isCollapsed = true;
      this.getHierarchy(item, cb, (item: EditableItem) => {
        item.visible = false;
      });
    });
  };

  uncollapseAll = (item: EditableItem, cb: () => void) => {
    item.isCollapsed = false;
    const stack: EditableItem[] = [item];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      cur.visible = true;
      if (!cur.isCollapsed) {
        this.getChildren(
          cur,
          () => {},
          (c: EditableItem) => {
            stack.push(c);
          }
        );
      }
    }
    cb();
  };

  getAllChildren = (
    items: IExtendedItem[],
    cb: (items: IExtendedItem[]) => void
  ) => {
    const result = [];
    const stack: IExtendedItem[] = [...items];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      result.push(cur);
      this.getChildren(
        cur,
        () => {},
        (c: IExtendedItem) => {
          stack.push(c);
        }
      );
    }
    cb(result);
  };

  uncollapseChildren = (id: Id, cb: () => void) => {
    this.getItem(id, (item: EditableItem) => {
      item.isCollapsed = false;
      this.getChildren(item, cb, child => {
        child.visible = true;
      });
    });
  };

  collapseChildren = (id: Id, cb: () => void) => {
    this.getItem(id, (item: EditableItem) => {
      item.isCollapsed = true;
      this.getChildren(item, cb, (child: EditableItem) => {
        child.visible = false;
        child.isCollapsed = true;
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
  constructor(title: string, id: Id, parentId?: Id) {
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
      if (!id) this.done = true; // Remove All
      this.children = this.children.filter(c => c !== id);
      if (id === this.id) this.done = true;
    });
    if (parentId) {
      this.parentId = parentId;
      this.addChild(parentId);
    }
  }
}

export class EditableItem extends Item {
  isEditing: boolean = false;
  isCollapsed: boolean = true;
  constructor(
    title: string,
    id: Id,
    parentId?: Id,
    visible = true,
    isCollapsed = false
  ) {
    super(title, id, parentId);
    this.visible = visible;
    this.isCollapsed = isCollapsed;
  }
}
