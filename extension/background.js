chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('applyonceProfile', (data) => {
    if (!data.applyonceProfile) {
      chrome.storage.local.set({ applyonceProfile: {} });
    }
  });
});

