import { HistoryService } from "./HistoryService";
import { TreeService, Tree } from "./TreeService";
import { onUpload, generateUniqueId } from "../utils";
import { DatabaseService } from "./StorageService";

export const init = () => {
  // const db = DatabaseService.getService();
  // db.addOrUpdateTree(
  //   {
  //     id: generateUniqueId(),
  //     title: "Test",
  //     hierarchy: [],
  //     notes: []
  //   },
  //   () => {
  //     db.getAll(trees => {
  //       trees.forEach(t => {
  //         db.removeTree(t.id, console.warn);
  //       });
  //     });
  //   }
  // );
};

export const callback = () => {
  onUpload(json => {
    console.warn(1, json, JSON.parse(json));
    const { hierarchy, notes, title } = JSON.parse(json);
    console.warn(2, hierarchy, notes, title);
    const treeService = TreeService.getService();
    console.warn(3);
    if (hierarchy && notes) {
      const tree: Tree = {
        id: generateUniqueId(),
        hierarchy,
        notes,
        title
      };
      console.warn(4);
      treeService.addTree(tree);
      // treeService.updateTrees();
    }
    console.warn(5);
  });
  // TreeService.getService().next([{ title: "One" }, { title: "Two" }]);
};
