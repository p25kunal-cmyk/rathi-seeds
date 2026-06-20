/**
 * app.js — Rathi Seeds Main Application
 *
 * Handles views, navigation, state management, and user interactions.
 * Data persists in localStorage.
 */

const App = (() => {
  'use strict';

  /* ============ STATE ============ */
  const STORAGE_KEY = 'rathiSeeds_data';

  let state = {
    files: [],          // Array of parsed file data
    activeView: 'upload',
    selectedParties: new Set(),
    searchQuery: '',
    activeFilter: 'all',
    activeFileIndex: 0,
    viewingBillPartyId: null,
    hideZeroBags: false,
  };

  /* ============ INITIALIZATION ============ */
  function init() {
    loadState();
    bindEvents();
    renderNav();
    switchView(state.files.length > 0 ? 'parties' : 'upload');
  }

  /* ============ STORAGE ============ */
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.files = parsed.files || [];
        state.activeFileIndex = parsed.activeFileIndex || 0;
        
        // Clear old incompatible data
        if (state.files.length > 0 && !state.files[0].parties[0].dynamicData) {
          state.files = [];
          state.activeFileIndex = 0;
          saveState();
        }
      }
    } catch (e) {
      console.warn('Failed to load saved data:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        files: state.files,
        activeFileIndex: state.activeFileIndex,
      }));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  }

  /* ============ NAVIGATION ============ */
  function switchView(view) {
    state.activeView = view;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${view}`)?.classList.add('active');
    document.querySelectorAll('.bottom-nav__item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });

    // Render view content
    if (view === 'upload')  renderUploadView();
    if (view === 'parties') renderPartiesView();
    if (view === 'bills')   renderBillsView();
  }

  function renderNav() {
    const nav = document.getElementById('bottomNav');
    nav.innerHTML = `
      <button class="bottom-nav__item" data-view="upload" id="nav-upload">
        <span class="bottom-nav__icon">📤</span>
        <span class="bottom-nav__label">Upload</span>
      </button>
      <button class="bottom-nav__item" data-view="parties" id="nav-parties">
        <span class="bottom-nav__icon">👥</span>
        <span class="bottom-nav__label">Parties</span>
      </button>
      <button class="bottom-nav__item" data-view="bills" id="nav-bills">
        <span class="bottom-nav__icon">🧾</span>
        <span class="bottom-nav__label">Bills</span>
      </button>
    `;

    nav.querySelectorAll('.bottom-nav__item').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
  }

  /* ============ UPLOAD VIEW ============ */
  function renderUploadView() {
    const container = document.getElementById('view-upload');
    const hasFiles = state.files.length > 0;

    let filesHTML = '';
    if (hasFiles) {
      filesHTML = '<div class="data-cards">';
      state.files.forEach((file, idx) => {
        const date = new Date(file.uploadedAt).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
        filesHTML += `
          <div class="data-card">
            <div class="data-card__icon">📊</div>
            <div class="data-card__info">
              <div class="data-card__name">${file.product}</div>
              <div class="data-card__meta">${file.parties.length} parties · ${file.sheetName} · ${date}</div>
            </div>
            <div class="data-card__actions">
              <button class="data-card__delete" onclick="App.deleteFile(${idx}, event)" title="Remove">✕</button>
            </div>
          </div>`;
      });
      filesHTML += '</div>';
    }

    container.innerHTML = `
      <h1 class="section-title">📤 Upload Data</h1>
      <p class="section-subtitle">Upload your Excel booking files to get started</p>

      <div class="upload-zone" id="uploadZone">
        <div class="upload-zone__icon">📁</div>
        <div class="upload-zone__text">Tap to upload Excel file</div>
        <div class="upload-zone__hint">or drag & drop .xlsx file here</div>
        <input type="file" id="fileInput" accept=".xlsx,.xls">
      </div>

      <div class="upload-status" id="uploadStatus"></div>

      ${filesHTML ? '<h2 class="section-title mt-24" style="font-size:1.1rem">📂 Uploaded Files</h2>' + filesHTML : ''}
    `;

    // Bind upload events
    const zone = document.getElementById('uploadZone');
    const input = document.getElementById('fileInput');

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    input.addEventListener('change', () => {
      if (input.files[0]) handleFile(input.files[0]);
    });
  }

  function handleFile(file) {
    if (!file.name.match(/\.xlsx?$/i)) {
      showUploadStatus('error', '❌ Invalid File', 'Please upload an .xlsx file');
      return;
    }

    showUploadStatus('loading', '⏳ Processing...', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = ExcelParser.parseFile(e.target.result, file.name);

        if (parsed.parties.length === 0) {
          showUploadStatus('error', '⚠️ No Data Found', 'Could not find party data in this file');
          return;
        }

        // Check if file with same product already exists
        const existingIdx = state.files.findIndex(f => f.product === parsed.product);
        if (existingIdx >= 0) {
          state.files[existingIdx] = parsed;
        } else {
          state.files.push(parsed);
        }

        state.activeFileIndex = existingIdx >= 0 ? existingIdx : state.files.length - 1;
        saveState();

        showUploadStatus('success', '✅ Upload Successful!',
          `${parsed.parties.length} parties loaded from "${parsed.sheetName}"`);

        // Re-render to show updated file list
        setTimeout(() => renderUploadView(), 1500);
      } catch (err) {
        console.error(err);
        showUploadStatus('error', '❌ Parse Error', err.message);
      }
    };

    reader.onerror = () => {
      showUploadStatus('error', '❌ Read Error', 'Could not read the file');
    };

    reader.readAsArrayBuffer(file);
  }

  function showUploadStatus(type, title, detail) {
    const el = document.getElementById('uploadStatus');
    if (!el) return;
    el.className = `upload-status visible ${type === 'loading' ? '' : type}`;
    el.innerHTML = `
      <div class="upload-status__title">${title}</div>
      <div class="upload-status__detail">${detail}</div>
    `;
  }

  function deleteFile(index, event) {
    if (event) event.stopPropagation();
    if (!confirm('Remove this file data?')) return;
    state.files.splice(index, 1);
    state.activeFileIndex = Math.max(0, Math.min(state.activeFileIndex, state.files.length - 1));
    saveState();
    renderUploadView();
  }

  /* ============ PARTIES VIEW ============ */
  function renderPartiesView() {
    const container = document.getElementById('view-parties');

    if (state.files.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📂</div>
          <div class="empty-state__title">No Data Yet</div>
          <div class="empty-state__text">Upload an Excel file first to see your parties</div>
          <button class="btn btn--primary mt-16" onclick="App.switchView('upload')">📤 Upload Now</button>
        </div>`;
      return;
    }

    const fileData = state.files[state.activeFileIndex];
    const parties = filterParties(fileData.parties);
    const centers = ExcelParser.getCenters(fileData);
    const selectedCount = state.selectedParties.size;

    // File selector (if multiple files)
    let fileSelectorHTML = '';
    if (state.files.length > 1) {
      fileSelectorHTML = '<div class="chip-group mb-16">';
      state.files.forEach((f, idx) => {
        fileSelectorHTML += `
          <button class="chip ${idx === state.activeFileIndex ? 'active' : ''}"
                  onclick="App.switchFile(${idx})">
            ${f.product}
          </button>`;
      });
      fileSelectorHTML += '</div>';
    }

    // Center filter chips
    let filterHTML = '<div class="chip-group">';
    filterHTML += `<button class="chip ${state.activeFilter === 'all' ? 'active' : ''}"
                           onclick="App.filterByCenter('all')">All</button>`;
    centers.forEach(c => {
      filterHTML += `<button class="chip ${state.activeFilter === c ? 'active' : ''}"
                             onclick="App.filterByCenter('${c.replace(/'/g, "\\'")}')">${c}</button>`;
    });
    filterHTML += '</div>';

    // Stats
    const totalBags = fileData.parties.reduce((s, p) => s + (p.totalBags || 0), 0);
    const totalAmt = fileData.parties.reduce((s, p) => s + (p.totalAmt || 0), 0);

    // Party list
    let listHTML = '<div class="party-list">';
    parties.forEach(party => {
      const isSelected = state.selectedParties.has(party.id);
      listHTML += `
        <div class="party-item ${isSelected ? 'selected' : ''}" data-id="${party.id}">
          <div class="party-item__checkbox" onclick="event.stopPropagation(); App.toggleParty(${party.id})">
            ${isSelected ? '✓' : ''}
          </div>
          <div class="party-item__info" onclick="App.viewPartyBill(${party.id})">
            <div class="party-item__name">${party.name.trim()}</div>
            <div class="party-item__detail">
              ${party.center ? `<span>📍 ${party.center}</span>` : ''}
              ${(party.dynamicTags || []).map((t, i) => 
                `<span class="party-item__tag ${i % 2 !== 0 ? 'party-item__tag--accent' : ''}">${t.shortLabel}: ${t.value}</span>`
              ).join('')}
            </div>
          </div>
          <span class="party-item__arrow" onclick="App.viewPartyBill(${party.id})">›</span>
        </div>`;
    });
    listHTML += '</div>';

    container.innerHTML = `
      <h1 class="section-title">👥 Parties</h1>
      <p class="section-subtitle">${fileData.product} · ${fileData.parties.length} parties</p>

      ${fileSelectorHTML}

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card__value">${fileData.parties.length}</div>
          <div class="stat-card__label">Parties</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${totalBags}</div>
          <div class="stat-card__label">Total Bags</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${abbreviateNumber(totalAmt)}</div>
          <div class="stat-card__label">Total Amt</div>
        </div>
      </div>

      <div class="search-bar">
        <span class="search-bar__icon">🔍</span>
        <input type="text" class="search-bar__input" id="searchInput"
               placeholder="Search parties..." value="${state.searchQuery}"
               oninput="App.onSearch(this.value)">
      </div>

      ${filterHTML}

      <div style="margin-bottom: 12px; margin-top: 12px;">
        <label style="display:inline-flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--clr-text-mid); cursor:pointer;">
          <input type="checkbox" ${state.hideZeroBags ? 'checked' : ''} onchange="App.toggleHideZeroBags()" style="accent-color: var(--clr-primary); width:16px; height:16px;">
          Hide parties with 0 bags
        </label>
      </div>

      <div class="action-bar">
        <span class="action-bar__count">
          <strong>${selectedCount}</strong> selected of ${parties.length}
        </span>
        <button class="btn btn--ghost btn--sm" onclick="App.selectAll()">Select All</button>
        <button class="btn btn--ghost btn--sm" onclick="App.deselectAll()">Clear</button>
      </div>

      ${listHTML}

      ${selectedCount > 0 ? `
        <button class="btn btn--fab" onclick="App.generateSelectedBills()" title="Generate Bills for Selected">
          🧾
        </button>
      ` : ''}
    `;
  }

  function filterParties(parties) {
    let filtered = parties;

    if (state.hideZeroBags) {
      filtered = filtered.filter(p => p.totalBags > 0);
    }

    // Filter by center
    if (state.activeFilter !== 'all') {
      filtered = filtered.filter(p => p.center === state.activeFilter);
    }

    // Filter by search
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.center && p.center.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  function onSearch(query) {
    state.searchQuery = query;
    renderPartiesView();
    // Re-focus search input
    setTimeout(() => {
      const input = document.getElementById('searchInput');
      if (input) { input.focus(); input.setSelectionRange(query.length, query.length); }
    }, 10);
  }

  function filterByCenter(center) {
    state.activeFilter = center;
    renderPartiesView();
  }

  function toggleHideZeroBags() {
    state.hideZeroBags = !state.hideZeroBags;
    renderPartiesView();
  }

  function toggleParty(id) {
    if (state.selectedParties.has(id)) {
      state.selectedParties.delete(id);
    } else {
      state.selectedParties.add(id);
    }
    renderPartiesView();
  }

  function selectAll() {
    const fileData = state.files[state.activeFileIndex];
    const parties = filterParties(fileData.parties);
    parties.forEach(p => state.selectedParties.add(p.id));
    renderPartiesView();
  }

  function deselectAll() {
    state.selectedParties.clear();
    renderPartiesView();
  }

  function switchFile(index) {
    state.activeFileIndex = index;
    state.selectedParties.clear();
    state.searchQuery = '';
    state.activeFilter = 'all';
    saveState();
    renderPartiesView();
  }

  /* ============ BILLS VIEW ============ */
  function renderBillsView() {
    const container = document.getElementById('view-bills');

    if (state.files.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🧾</div>
          <div class="empty-state__title">No Bills Yet</div>
          <div class="empty-state__text">Upload data and select parties to generate bills</div>
          <button class="btn btn--primary mt-16" onclick="App.switchView('upload')">📤 Upload Now</button>
        </div>`;
      return;
    }

    // If viewing a single party bill
    if (state.viewingBillPartyId !== null) {
      renderSingleBill(container);
      return;
    }

    // If selected parties exist, show their bills
    if (state.selectedParties.size > 0) {
      renderSelectedBills(container);
      return;
    }

    // Default: prompt to select
    container.innerHTML = `
      <h1 class="section-title">🧾 Bills</h1>
      <p class="section-subtitle">Select parties to generate bills</p>
      <div class="empty-state">
        <div class="empty-state__icon">📋</div>
        <div class="empty-state__title">Select Parties First</div>
        <div class="empty-state__text">Go to Parties tab and select the parties you want to generate bills for</div>
        <button class="btn btn--primary mt-16" onclick="App.switchView('parties')">👥 Go to Parties</button>
      </div>`;
  }

  function renderSingleBill(container) {
    const fileData = state.files[state.activeFileIndex];
    const party = fileData.parties.find(p => p.id === state.viewingBillPartyId);

    if (!party) {
      state.viewingBillPartyId = null;
      renderBillsView();
      return;
    }

    const billHTML = BillGenerator.generateBillHTML(party);

    container.innerHTML = `
      <button class="back-btn" onclick="App.closeBillView()">← Back to Parties</button>
      <h1 class="section-title">🧾 Bill</h1>
      <p class="section-subtitle">${fileData.product} · ${party.name.trim()}</p>
      ${billHTML}
    `;
  }

  function renderSelectedBills(container) {
    const fileData = state.files[state.activeFileIndex];
    const selectedParties = fileData.parties.filter(p => state.selectedParties.has(p.id));

    let billsHTML = '';
    selectedParties.forEach(party => {
      billsHTML += BillGenerator.generateBillHTML(party);
    });

    container.innerHTML = `
      <h1 class="section-title">🧾 Generated Bills</h1>
      <p class="section-subtitle">${selectedParties.length} bills · ${fileData.product}</p>

      <div class="action-bar mb-16">
        <button class="btn btn--primary btn--sm" onclick="App.copyAllBills()">
          📋 Copy All Bills
        </button>
        <button class="btn btn--outline btn--sm" onclick="App.switchView('parties')">
          ← Back
        </button>
      </div>

      ${billsHTML}
    `;
  }

  function viewPartyBill(id) {
    state.viewingBillPartyId = id;
    switchView('bills');
  }

  function closeBillView() {
    state.viewingBillPartyId = null;
    switchView('parties');
  }

  function generateSelectedBills() {
    if (state.selectedParties.size === 0) {
      showToast('Select parties first');
      return;
    }
    switchView('bills');
  }

  /* ============ COPY FUNCTIONS ============ */
  function copyBillText(partyId) {
    const fileData = state.files[state.activeFileIndex];
    const party = fileData.parties.find(p => p.id === partyId);
    if (!party) return;

    const text = BillGenerator.generateBillText(party);
    copyToClipboard(text);
  }

  function showBillText(partyId) {
    const fileData = state.files[state.activeFileIndex];
    const party = fileData.parties.find(p => p.id === partyId);
    if (!party) return;

    const text = BillGenerator.generateBillText(party);

    // Show in modal
    const overlay = document.getElementById('modalOverlay');
    const sheet = document.getElementById('modalSheet');

    sheet.innerHTML = `
      <div class="modal-sheet__handle"></div>
      <div class="modal-sheet__title">📝 Bill Text — ${party.name.trim()}</div>
      <div class="bill-text">${escapeHTML(text)}</div>
      <div style="display:flex; gap:8px">
        <button class="btn btn--primary" onclick="App.copyBillText(${partyId}); App.closeModal()">
          📋 Copy
        </button>
        <button class="btn btn--outline" onclick="App.closeModal()">
          Close
        </button>
      </div>
    `;

    overlay.classList.add('open');
  }

  function copyAllBills() {
    const fileData = state.files[state.activeFileIndex];
    const selectedParties = fileData.parties.filter(p => state.selectedParties.has(p.id));

    if (selectedParties.length === 0) {
      showToast('No parties selected');
      return;
    }

    const allText = selectedParties.map(party =>
      BillGenerator.generateBillText(party)
    ).join('\n\n' + '═'.repeat(40) + '\n\n');

    copyToClipboard(allText);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ Copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ Copied to clipboard!');
    });
  }

  /* ============ MODAL ============ */
  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
  }

  /* ============ TOAST ============ */
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  /* ============ HELPERS ============ */
  function abbreviateNumber(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000)   return '₹' + (num / 100000).toFixed(1) + 'L';
    if (num >= 1000)     return '₹' + (num / 1000).toFixed(0) + 'K';
    return '₹' + num;
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindEvents() {
    // Close modal on overlay click
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  /* ============ PUBLIC API ============ */
  return {
    init,
    switchView,
    switchFile,
    onSearch,
    filterByCenter,
    toggleHideZeroBags,
    toggleParty,
    selectAll,
    deselectAll,
    viewPartyBill,
    closeBillView,
    generateSelectedBills,
    copyBillText,
    showBillText,
    copyAllBills,
    closeModal,
    deleteFile,
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
