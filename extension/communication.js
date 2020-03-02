const getTrees = () => {
  chrome.storage.sync.get(["treeIds"], treeIdsObject => {
    chrome.storage.sync.get(treeIdsObject.treeIds, treesObject => {
      const trees = Object.entries(treesObject).map(to => to[1]);
      document.dispatchEvent(
        new CustomEvent("TreesLoaded", { detail: { trees } })
      );
    });
  });
};

const saveTree = tree => {
  console.warn("Save Tree", tree);
  chrome.storage.sync.set({ [tree.id]: tree });
};

const saveTreeIds = treeIds => {
  console.warn("Save Tree Ids", treeIds);
  chrome.storage.sync.set({ treeIds });
};

document.addEventListener("LoadTrees", e => getTrees());
document.addEventListener("SaveTree", e => {
  console.warn("On Save Tree: ", e.detail);
  const {
    detail: { tree }
  } = e;
  saveTree(tree);
});
document.addEventListener("SaveTreeIds", e => {
  console.warn("On Save Tree Ids: ", e.detail);
  const {
    detail: { treeIds }
  } = e;
  saveTreeIds(treeIds);
});
