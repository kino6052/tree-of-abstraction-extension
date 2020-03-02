const getTrees = () => {
  chrome.storage.sync.get(["trees"], trees => {
    document.dispatchEvent(new CustomEvent("TreesLoaded", { detail: trees }));
  });
};

const saveTree = trees => {
  console.warn("Save Tree", trees);
  chrome.storage.sync.set({ trees });
};

document.addEventListener("LoadTrees", e => getTrees());
document.addEventListener("SaveTree", ({ detail: { trees } }) =>
  saveTree(trees)
);
