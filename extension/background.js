chrome.runtime.onInstalled.addListener(()=>chrome.storage.local.get('applyonceProfile',x=>{if(!x.applyonceProfile)chrome.storage.local.set({applyonceProfile:{}})}));
