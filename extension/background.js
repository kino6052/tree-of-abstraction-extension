chrome.browserAction.onClicked.addListener(() => {
  var newURL = "./index.html";
  chrome.tabs.create({ url: newURL });
});
