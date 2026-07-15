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

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Green highlight for filled fields
    el.style.outline = '2px solid #22c55e';
    el.style.outlineOffset = '2px';
    setTimeout(() => {
      el.style.outline = '';
    }, 4000);
    
    filled++;
  }
  return { filled, review };
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

