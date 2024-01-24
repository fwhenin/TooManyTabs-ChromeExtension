

let domainsToMatch: string[] = [
  "youtube.com",
  "mail.google.com"
];

let consolidateAllTabsToCurrentWindow = true;

let getTabsToClose = (callbackFn: (tabIds: number[]) => void) => {
  chrome.tabs.query({}, (tabs) => {
    let tabIdsToClose: number[] = [];
    tabs.forEach((tab) => {
      if (tab.discarded || (isValidUrl(tab.url!) && domainsToMatch.some(d => (new URL(tab.url!).host.indexOf(d) > -1)))) {
        tabIdsToClose.push(tab.id!);
      }
    });
    callbackFn(tabIdsToClose);
  });
}

let isValidUrl = (potentialUrl: string) => {
  try {
    new URL(potentialUrl);
    return true;
  } catch (err) {
    return false;
  }
}

let updateBadgeText = () => {
  getTabsToClose((tabIds) => {
    let count = tabIds.length;
    if (count > 0){
      chrome.action.setBadgeText({text: count.toString()});
    }else{
      chrome.action.setBadgeText({text: ''});
    }
  });
}

chrome.action.onClicked.addListener(
  function (activeTab) {
    let currentWindowId = activeTab.windowId;

    chrome.tabs.query({}, function (tabs) {

      getTabsToClose((tabIds) => {
        chrome.tabs.remove(tabIds, () => {
          updateBadgeText();
        });
      });

      if (consolidateAllTabsToCurrentWindow){
        tabs.forEach((tab) => {
          if (tab.windowId !== currentWindowId) {
            // move to current window
            chrome.tabs.move(tab.id!, {
              index: -1,
              windowId: currentWindowId
            });
          }
        });
      }
    });
  },
);

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
  updateBadgeText();
});
