const statusEl = document.querySelector('#status');
const statusBadgeEl = document.querySelector('#status-badge');
const resultEl = document.querySelector('#result');
const fillBtn = document.querySelector('#fill');
const profilePreviewEl = document.querySelector('#profile-preview');
const openDashboardEl = document.querySelector('#open-dashboard');
const syncNowEl = document.querySelector('#sync-now');

// Helper to open link in a new tab
function openLink(url) {
  chrome.tabs.create({ url });
}

openDashboardEl.addEventListener('click', (e) => {
  e.preventDefault();
  openLink('http://localhost:5173/dashboard');
});

// Update profile preview details
function updateProfilePreview() {
  chrome.storage.local.get('applyonceProfile', (data) => {
    const profile = data.applyonceProfile;
    if (profile && Object.keys(profile).length > 0 && (profile.name || profile.email)) {
      document.querySelector('#profile-sync-status').textContent = 'Synced';
      document.querySelector('#profile-sync-status').style.color = '#22c55e';
      
      // Add profile details preview if not already added
      const previewDetailsId = 'profile-preview-details';
      let detailsEl = document.querySelector(`#${previewDetailsId}`);
      if (!detailsEl) {
        detailsEl = document.createElement('div');
        detailsEl.id = previewDetailsId;
        detailsEl.style.marginTop = '8px';
        detailsEl.style.borderTop = '1px dashed #262626';
        detailsEl.style.paddingTop = '8px';
        profilePreviewEl.appendChild(detailsEl);
      }
      
      detailsEl.innerHTML = `
        <div class="profile-item">
          <span class="profile-label">Name:</span>
          <span class="profile-val">${profile.name || '—'}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Email:</span>
          <span class="profile-val">${profile.email || '—'}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Phone:</span>
          <span class="profile-val">${profile.phone || '—'}</span>
        </div>
      `;
    } else {
      document.querySelector('#profile-sync-status').textContent = 'Not synced';
      document.querySelector('#profile-sync-status').style.color = '#f59e0b';
      
      const detailsEl = document.querySelector('#profile-preview-details');
      if (detailsEl) detailsEl.remove();
    }
  });
}

// Initial status scan on tab load
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab || !tab.id) return;
  
  // If we are on chrome:// or chrome-extension://, content scripts cannot run
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    statusBadgeEl.textContent = 'Inactive';
    statusBadgeEl.className = 'status-badge status-warning';
    statusEl.textContent = 'Navigate to a web form or application page to auto-fill.';
    fillBtn.disabled = true;
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: 'COUNT_FIELDS' }, (response) => {
    // If runtime error (e.g. extension not fully injected or loaded)
    if (chrome.runtime.lastError) {
      statusBadgeEl.textContent = 'Ready';
      statusBadgeEl.className = 'status-badge status-warning';
      statusEl.textContent = 'Navigate to any page or refresh to start scanning.';
      return;
    }

    const count = response?.count || 0;
    if (count > 0) {
      statusBadgeEl.textContent = `${count} fields`;
      statusBadgeEl.className = 'status-badge status-success';
      statusEl.textContent = 'Supported fields detected on this page.';
    } else {
      statusBadgeEl.textContent = '0 fields';
      statusBadgeEl.className = 'status-badge status-warning';
      statusEl.textContent = 'No supported form inputs detected on this page.';
    }
  });
});

// Auto-fill trigger
fillBtn.onclick = () => {
  resultEl.textContent = 'Filling form...';
  resultEl.style.color = '#a1a1aa';
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !tab.id) return;
    chrome.tabs.sendMessage(tab.id, { type: 'FILL_FORM' }, (response) => {
      if (chrome.runtime.lastError) {
        resultEl.textContent = 'Failed to communicate with page. Please refresh.';
        resultEl.style.color = '#ef4444';
        return;
      }
      if (response && response.filled > 0) {
        resultEl.textContent = `Complete: ${response.filled} filled, ${response.review} need review.`;
        resultEl.style.color = '#22c55e';
      } else {
        resultEl.textContent = 'No matching profile values found to fill.';
        resultEl.style.color = '#f59e0b';
      }
    });
  });
};

// Sync profile trigger
syncNowEl.onclick = (e) => {
  e.preventDefault();
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !tab.id) return;
    // Send a message to content script on current page to trigger a postMessage request if it is the web app
    chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_SYNC' }, (response) => {
      // Reload from storage
      setTimeout(() => {
        updateProfilePreview();
        resultEl.textContent = 'Reloaded profile from storage.';
        resultEl.style.color = '#22c55e';
      }, 300);
    });
  });
};

// Load preview on popup open
updateProfilePreview();

