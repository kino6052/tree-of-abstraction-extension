import { BehaviorSubject } from "rxjs";
import { Entry, EAction, IActionParam, TActionSubject } from "./ActionService";
import { filter } from "rxjs/internal/operators/filter";
import { HistoryService, EPath } from "./HistoryService";
import { DialogService } from "./DialogService";
import { TreeService } from "./TreeService";
import { ItemService, Item } from "./ItemService";

const subscribe = <T extends keyof IActionParam>(
  subject: BehaviorSubject<Entry<keyof IActionParam>>,
  action: T,
  callback: (entry: Entry<T>) => void
) => {
  subject.pipe(filter(e => e[0] === action)).subscribe(callback);
};

export const Subscriptions = {
  onGoToTree: (subject: TActionSubject) => {
    subscribe(subject, EAction.GoToTree, ([_, { tree }]) => {
      const treeService = TreeService.getService();
      const historyService = HistoryService.getService();
      const itemService = ItemService.getService();
      const root = tree.hierarchy.map(
        ({ id, parentId, title }) => new Item(title, id, parentId)
      )[0];
      itemService.getHierarchy(
        root,
        () => {
          itemService.updateHierarchy(root);
          treeService.setActiveTree(tree);
          historyService.next(EPath.Tree);
        },
        console.warn
      );
    });
  },
  onCreateNewTree: (subject: TActionSubject) => {
    subscribe(subject, EAction.CreateNewTree, ([_, { title }]) => {
      TreeService.getService().createTree(title);
    });
  },
  onHistoryChange: (subject: TActionSubject) => {
    subscribe(subject, EAction.ChangeLocation, ([_, { location }]) => {
      HistoryService.getService().next(location);
    });
  },
  onOpenDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.OpenDialog, ([_, { content }]) => {
      console.warn("open");
      DialogService.getService().openDialog(content);
      // TODO: Implement
    });
  },
  onCloseDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.CloseDialog, ([_, {}]) => {
      // console.warn("cancel");
      DialogService.getService().closeDialog();
      // TODO: Implement
    });
  }
};
