

 chrome.action.onClicked.addListener(
  function(activeTab) { 
    let currentWindowId = activeTab.windowId;
  
    chrome.tabs.query({}, function(tabs) { 
    
      let tabIds: number[] = [];

      let matchedDomainIds: number[] = [];

      let domainsToMatch: string[] = [
        "youtube.com",
      ];
      tabs.forEach((tab) => {
        if (tab.discarded){
          tabIds.push(tab.id!);
        }
        else if (domainsToMatch.some(d => (new URL(tab.url!).host.indexOf(d) > -1)))
        {
            matchedDomainIds.push(tab.id!);
        }
        else if (tab.windowId !== currentWindowId)
        {
          // move to current window
          chrome.tabs.move(tab.id!, {
            index: -1,
            windowId: currentWindowId
          });
        }
      });

      chrome.tabs.remove(tabIds);
      chrome.tabs.remove(matchedDomainIds);
     } );
   },
);
