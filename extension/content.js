const mappings = {
  name: ['full name', 'name', 'applicant name', 'candidate name'],
  email: ['email', 'e-mail', 'email address'],
  phone: ['phone', 'mobile', 'contact', 'telephone'],
  dob: ['date of birth', 'dob', 'birth date'],
  gender: ['gender', 'sex'],
  address: ['address', 'permanent address', 'residential address', 'full address'],
  city: ['city', 'town', 'district'],
  state: ['state', 'province'],
  pincode: ['pincode', 'pin code', 'postal', 'zip code'],
  aadhaarNumber: ['aadhaar', 'aadhar', 'uidai'],
  panNumber: ['pan number', 'pan card', 'permanent account number']
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
  return Object.entries(mappings).find(([, words]) =>
    words.some(w => text === w || text.includes(w))
  )?.[0];
}

function fields() {
  return [...document.querySelectorAll('input:not([type=hidden]):not([type=password]):not([type=submit]),textarea,select')]
    .filter(x => !x.disabled && match(x));
}

function fill(profile) {
  let filled = 0, review = 0;
  for (const el of fields()) {
    const key = match(el);
    if (!key) continue;
    let value;
    if (key === 'address') value = profile.address?.full;
    else if (key === 'city') value = profile.address?.city;
    else if (key === 'state') value = profile.address?.state;
    else if (key === 'pincode') value = profile.address?.pincode;
    else value = profile[key];
    if (!value) continue;

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
    
    // Add highlighting: Green for filled fields
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
      console.log('ApplyOnce Profile successfully synced to local extension storage.');
    });
  }
});

chrome.runtime.onMessage.addListener((msg, _, send) => {
  if (msg.type === 'COUNT_FIELDS') {
    send({ count: fields().length });
  }
  if (msg.type === 'FILL_FORM') {
    chrome.storage.local.get('applyonceProfile', x => {
      send(fill(x.applyonceProfile || {}));
    });
  }
  return true;
});

// Request profile sync from the web app immediately on load
try {
  window.postMessage({ type: 'APPLYONCE_REQUEST_SYNC' }, '*');
} catch (e) {
  console.warn('Could not post sync request message', e);
}
