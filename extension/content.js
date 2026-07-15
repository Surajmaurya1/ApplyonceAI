const fieldMappings = {
  name: {
    patterns: ['full name', 'name', 'applicant name', 'candidate name'],
    path: 'name'
  },
  email: {
    patterns: ['email', 'email address', 'e-mail'],
    path: 'email'
  },
  phone: {
    patterns: ['phone', 'mobile', 'contact number', 'telephone'],
    path: 'phone'
  },
  dob: {
    patterns: ['date of birth', 'dob', 'birth date'],
    path: 'dob'
  },
  gender: {
    patterns: ['gender', 'sex'],
    path: 'gender'
  },
  address: {
    patterns: ['address', 'permanent address', 'residential address', 'full address'],
    path: 'address.full'
  },
  city: {
    patterns: ['city', 'town', 'district'],
    path: 'address.city'
  },
  state: {
    patterns: ['state', 'province'],
    path: 'address.state'
  },
  pincode: {
    patterns: ['pincode', 'pin code', 'postal code', 'zip code'],
    path: 'address.pincode'
  },
  aadhaar: {
    patterns: ['aadhaar', 'aadhar', 'uidai'],
    path: 'aadhaarNumber'
  },
  pan: {
    patterns: ['pan number', 'pan card', 'permanent account number'],
    path: 'panNumber'
  },
  qualification: {
    patterns: ['qualification', 'highest qualification', 'education'],
    path: 'education[0].level'
  },
  percentage: {
    patterns: ['percentage', 'marks', 'cgpa', 'gpa'],
    path: 'education[0].percentage'
  },
  passingYear: {
    patterns: ['passing year', 'year of passing', 'graduation year'],
    path: 'education[0].year'
  }
};

const protectedWords = ['password', 'captcha', 'otp', 'security', 'verification', 'secret', 'pin'];

function info(el) {
  let label = el.labels?.[0]?.textContent || document.querySelector(`label[for="${el.id}"]`)?.textContent || '';
  return [el.name, el.id, el.placeholder, el.getAttribute('aria-label'), label]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function match(el) {
  const text = info(el);
  if (protectedWords.some(w => text.includes(w))) return null;
  
  for (const [key, mapping] of Object.entries(fieldMappings)) {
    const matched = mapping.patterns.some(pattern => {
      if (pattern === 'name') {
        return text === 'name' || new RegExp('\\bname\\b').test(text);
      }
      return text.includes(pattern);
    });
    if (matched) return key;
  }
  return null;
}

function fields() {
  return [...document.querySelectorAll('input:not([type=hidden]):not([type=password]):not([type=submit]),textarea,select')]
    .filter(x => !x.disabled && match(x));
}

function getValueByPath(obj, path) {
  if (!path) return undefined;
  return path.split(/[.[\]]+/).filter(Boolean).reduce((acc, part) => {
    return acc != null ? acc[part] : undefined;
  }, obj);
}

function fill(profile) {
  let filled = 0, review = 0;
  console.log('Attempting autofill with profile data:', profile);
  
  for (const el of fields()) {
    const key = match(el);
    if (!key) continue;
    
    const mapping = fieldMappings[key];
    if (!mapping) continue;
    
    const value = getValueByPath(profile, mapping.path);
    if (value === undefined || value === null || value === '') continue;

    console.log(`Matching field: ${key} -> ${value}`);

    if (el.tagName === 'SELECT') {
      const option = [...el.options].find(o =>
        o.text.toLowerCase() === String(value).toLowerCase() || o.value === value
      );
      if (!option) {
        review++;
        continue;
      }
      el.value = option.value;
    } else if (el.type === 'radio') {
      if (String(el.value).toLowerCase() !== String(value).toLowerCase()) continue;
      el.checked = true;
    } else {
      el.value = value;
    }

const originalValues = new Map();

function fill(profile) {
  let filled = 0, review = 0;
  console.log('Attempting autofill with profile data:', profile);
  originalValues.clear();
  
  for (const el of fields()) {
    const key = match(el);
    if (!key) continue;
    
    const mapping = fieldMappings[key];
    if (!mapping) continue;
    
    const value = getValueByPath(profile, mapping.path);
    if (value === undefined || value === null || value === '') continue;

    console.log(`Matching field: ${key} -> ${value}`);

    // Cache original value for Undo action
    originalValues.set(el, {
      value: el.tagName === 'SELECT' ? el.value : (el.type === 'radio' ? el.checked : el.value),
      type: el.type
    });

    if (el.tagName === 'SELECT') {
      const option = [...el.options].find(o =>
        o.text.toLowerCase() === String(value).toLowerCase() || o.value === value
      );
      if (!option) {
        review++;
        continue;
      }
      el.value = option.value;
    } else if (el.type === 'radio') {
      if (String(el.value).toLowerCase() !== String(value).toLowerCase()) continue;
      el.checked = true;
    } else {
      el.value = value;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Green highlight for filled fields
    el.style.outline = '2px solid #00D26A';
    el.style.outlineOffset = '2px';
    setTimeout(() => {
      el.style.outline = '';
    }, 4000);
    
    filled++;
  }
  return { filled, review };
}

function undo() {
  let reverted = 0;
  originalValues.forEach((orig, el) => {
    if (el.tagName === 'SELECT') {
      el.value = orig.value;
    } else if (el.type === 'radio') {
      el.checked = orig.value;
    } else {
      el.value = orig.value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    reverted++;
  });
  originalValues.clear();
  return reverted;
}

// Sync listener for webapp profile changes
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'APPLYONCE_SYNC_PROFILE') {
    chrome.storage.local.set({ applyonceProfile: event.data.profile }, () => {
      console.log('ApplyOnce Profile successfully synced to local extension storage:', event.data.profile);
    });
  }
});

chrome.runtime.onMessage.addListener((msg, _, send) => {
  if (msg.type === 'COUNT_FIELDS') {
    send({ count: fields().length });
  }
  if (msg.type === 'FILL_FORM') {
    chrome.storage.local.get('applyonceProfile', x => {
      const result = fill(x.applyonceProfile || {});
      send(result);
    });
  }
  if (msg.type === 'UNDO_FILL') {
    const revertedCount = undo();
    send({ count: revertedCount });
  }
  if (msg.type === 'TRIGGER_SYNC') {
    try {
      window.postMessage({ type: 'APPLYONCE_REQUEST_SYNC' }, '*');
      send({ success: true });
    } catch (e) {
      send({ success: false, error: e.message });
    }
  }
  return true;
});

// Sync request retries to solve loading race conditions
let syncRetries = 0;
function requestSync() {
  if (syncRetries >= 5) return;
  syncRetries++;
  try {
    window.postMessage({ type: 'APPLYONCE_REQUEST_SYNC' }, '*');
  } catch (e) {
    console.warn('Could not post sync request message', e);
  }
  
  chrome.storage.local.get('applyonceProfile', (data) => {
    if (!data.applyonceProfile || Object.keys(data.applyonceProfile).length === 0) {
      setTimeout(requestSync, 1000);
    }
  });
}
requestSync();

// --- Floating UI Widget Assistant ---
function injectFloatingAssistant() {
  if (document.getElementById('applyonce-assistant-root')) return;

  const root = document.createElement('div');
  root.id = 'applyonce-assistant-root';
  root.style.position = 'fixed';
  root.style.bottom = '80px';
  root.style.right = '20px';
  root.style.zIndex = '999999';
  root.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  const style = document.createElement('style');
  style.textContent = `
    #applyonce-assistant-root button {
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    #applyonce-assistant-root button:hover {
      transform: scale(1.03);
    }
    .applyonce-bubble {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #7C5CFF;
      color: white;
      border: 1px solid rgba(124, 92, 255, 0.3);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .applyonce-card {
      width: 260px;
      background: #171923;
      border: 1px solid #2A2D3A;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
      padding: 12px;
      color: #FAFAFA;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .applyonce-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      border-bottom: 1px solid #2A2D3A;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .applyonce-card-btn {
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      border: 0;
      text-align: center;
    }
    .applyonce-card-btn-primary {
      background: #4F8CFF;
      color: white;
    }
    .applyonce-card-btn-primary:hover {
      background: #3D7AED;
    }
    .applyonce-card-btn-secondary {
      background: #2A2D3A;
      color: #A1A1AA;
      border: 1px solid #2A2D3A;
    }
    .applyonce-card-btn-secondary:hover {
      color: white;
      background: #1E2030;
    }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('button');
  bubble.className = 'applyonce-bubble';
  bubble.innerHTML = '✦';
  bubble.title = 'ApplyOnce AI Assistant';

  const card = document.createElement('div');
  card.className = 'applyonce-card';
  card.style.display = 'none';

  card.innerHTML = `
    <div class="applyonce-card-header">
      <span>✦ ApplyOnce AI</span>
      <button style="background:transparent; border:0; color:#A1A1AA; font-size:14px; cursor:pointer;" id="applyonce-close-btn">&times;</button>
    </div>
    <div style="font-size: 11px; color:#A1A1AA; margin-bottom: 6px;" id="applyonce-fields-status">
      Scanning elements...
    </div>
    <button class="applyonce-card-btn applyonce-card-btn-primary" id="applyonce-fill-btn" style="margin-bottom: 6px;">Auto-fill Form</button>
    <button class="applyonce-card-btn applyonce-card-btn-secondary" id="applyonce-undo-btn">Undo Autofill</button>
  `;

  root.appendChild(bubble);
  root.appendChild(card);
  document.body.appendChild(root);

  let isDragging = false;
  let startY, startBottom;

  bubble.addEventListener('mousedown', (e) => {
    isDragging = false;
    startY = e.clientY;
    startBottom = parseInt(root.style.bottom || '80');
    
    const onMouseMove = (moveEvent) => {
      isDragging = true;
      const deltaY = startY - moveEvent.clientY;
      root.style.bottom = `${startBottom + deltaY}px`;
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  bubble.addEventListener('click', () => {
    if (isDragging) return;
    const isShowing = card.style.display !== 'none';
    card.style.display = isShowing ? 'none' : 'flex';
    bubble.style.display = isShowing ? 'flex' : 'none';
    
    const count = fields().length;
    document.getElementById('applyonce-fields-status').textContent = count > 0 
      ? `${count} input fields detected.` 
      : 'No input fields detected.';
  });

  card.querySelector('#applyonce-close-btn').addEventListener('click', () => {
    card.style.display = 'none';
    bubble.style.display = 'flex';
  });

  card.querySelector('#applyonce-fill-btn').addEventListener('click', () => {
    chrome.storage.local.get('applyonceProfile', x => {
      const res = fill(x.applyonceProfile || {});
      toastNotification(`Auto-filled ${res.filled} fields.`);
    });
  });

  card.querySelector('#applyonce-undo-btn').addEventListener('click', () => {
    const reverted = undo();
    toastNotification(`Reverted ${reverted} fields.`);
  });
}

function toastNotification(text) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#1E2030';
  toast.style.color = '#FAFAFA';
  toast.style.border = '1px solid #2A2D3A';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '12px';
  toast.style.zIndex = '9999999';
  toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingAssistant);
} else {
  injectFloatingAssistant();
}


