import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoGpzQqpro0nVW51x9F2VfZ3k6hkLhAZ8",
  authDomain: "rathi-seeds-bill.firebaseapp.com",
  projectId: "rathi-seeds-bill",
  storageBucket: "rathi-seeds-bill.firebasestorage.app",
  messagingSenderId: "940991039209",
  appId: "1:940991039209:web:34e95b2747195a41eb5278"
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

window.App = (() => {
  'use strict';

  let state = {
    activeView: 'dashboard',
    companies: [],
    seeds: [],
    parties: [],
    bookings: [],
  };

  function init() {
    setupAuth();
    bindEvents();
  }

  /* ============ AUTHENTICATION ============ */
  function setupAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        document.getElementById('loginView').classList.remove('active');
        document.getElementById('logoutBtn').style.display = 'inline-flex';
        document.getElementById('mainNav').style.display = 'flex';
        
        // Start listening to databases
        listenToCollections();
        switchView('dashboard');
      } else {
        document.getElementById('loginView').classList.add('active');
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('mainNav').style.display = 'none';
        
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      const btn = document.getElementById('loginBtn');
      const errEl = document.getElementById('loginError');
      
      btn.textContent = "Logging in...";
      errEl.textContent = "";

      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (err) {
        errEl.textContent = "Invalid email or password.";
      } finally {
        btn.textContent = "Log In";
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      signOut(auth);
    });
  }

  /* ============ FIRESTORE LISTENERS ============ */
  function listenToCollections() {
    onSnapshot(collection(db, "companies"), (snap) => {
      state.companies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupCompanies();
    });

    onSnapshot(collection(db, "seeds"), (snap) => {
      state.seeds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupSeeds();
    });

    onSnapshot(collection(db, "parties"), (snap) => {
      state.parties = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderPartiesList();
    });

    onSnapshot(collection(db, "bookings"), (snap) => {
      state.bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderDashboard();
    });
  }

  /* ============ NAVIGATION ============ */
  function switchView(viewId) {
    state.activeView = viewId;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(viewId + 'View')?.classList.add('active');
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.textContent.toLowerCase().includes(viewId.substring(0,4)));
    if (activeBtn) activeBtn.classList.add('active');

    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'billing') renderBillingView();
    if (viewId === 'parties') renderPartiesList();
    if (viewId === 'setup') {
      renderSetupCompanies();
      renderSetupSeeds();
    }
  }

  /* ============ PHASE 1: SETUP (COMPANIES & SEEDS) ============ */
  function renderSetupCompanies() {
    const container = document.getElementById('setupCompaniesList');
    if (!container) return;
    
    if (state.companies.length === 0) {
      container.innerHTML = `<p class="text-dim">No companies added yet.</p>`;
      return;
    }

    container.innerHTML = state.companies.map(c => `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0; display:flex; justify-content:space-between;">
        <div><strong>${escapeHTML(c.name)}</strong></div>
      </div>
    `).join('');
  }

  function renderSetupSeeds() {
    const container = document.getElementById('setupSeedsList');
    if (!container) return;
    
    if (state.seeds.length === 0) {
      container.innerHTML = `<p class="text-dim">No seeds added yet.</p>`;
      return;
    }

    container.innerHTML = state.seeds.map(s => {
      const co = state.companies.find(c => c.id === s.companyId);
      const coName = co ? co.name : 'Unknown';
      return `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0;">
        <div><strong>${escapeHTML(s.name)}</strong> (${escapeHTML(s.weight)} Kg)</div>
        <div class="text-dim text-sm">${escapeHTML(coName)} • Rate: ₹${s.currentRate}</div>
      </div>
    `}).join('');
  }

  function openAddCompanyModal() {
    const html = `
      <div class="modal-sheet__handle"></div>
      <div class="modal-sheet__title">Add New Company</div>
      <form id="addCompanyForm" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label class="form-label">Company Name</label>
          <input type="text" id="coName" class="form-input" required placeholder="e.g. Savira Seeds">
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%">Save Company</button>
      </form>
    `;
    openModal(html);

    document.getElementById('addCompanyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('coName').value;
      try {
        await addDoc(collection(db, "companies"), { name });
        closeModals();
        showToast("Company added!");
      } catch (err) {
        console.error(err);
        showToast("Error adding company");
      }
    });
  }

  function openAddSeedModal() {
    if (state.companies.length === 0) {
      showToast("Please add a company first.");
      return;
    }

    const coOptions = state.companies.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');

    const html = `
      <div class="modal-sheet__handle"></div>
      <div class="modal-sheet__title">Add Seed Type</div>
      <form id="addSeedForm" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label class="form-label">Company</label>
          <select id="seedCo" class="form-select" required>${coOptions}</select>
        </div>
        <div>
          <label class="form-label">Seed Name</label>
          <input type="text" id="seedName" class="form-input" required placeholder="e.g. Pushpa">
        </div>
        <div>
          <label class="form-label">Bag Weight (Kg)</label>
          <input type="number" id="seedWt" class="form-input" required placeholder="e.g. 25">
        </div>
        <div>
          <label class="form-label">Current Rate (₹)</label>
          <input type="number" id="seedRate" class="form-input" required placeholder="e.g. 2999">
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%">Save Seed</button>
      </form>
    `;
    openModal(html);

    document.getElementById('addSeedForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, "seeds"), {
          companyId: document.getElementById('seedCo').value,
          name: document.getElementById('seedName').value,
          weight: document.getElementById('seedWt').value,
          currentRate: document.getElementById('seedRate').value
        });
        closeModals();
        showToast("Seed added!");
      } catch (err) {
        console.error(err);
        showToast("Error adding seed");
      }
    });
  }

  /* ============ PHASE 1: PARTIES ============ */
  function renderPartiesList() {
    const container = document.getElementById('partiesListContainer');
    if (!container) return;

    if (state.parties.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No parties found. Add one above.</p></div>`;
      return;
    }

    container.innerHTML = state.parties.map(p => `
      <div class="card" style="display:flex; flex-direction:column; gap:4px;">
        <h3 style="margin:0">${escapeHTML(p.name)}</h3>
        <div class="text-dim text-sm">📍 ${escapeHTML(p.center || 'No Center')} | 📞 ${escapeHTML(p.phone || 'N/A')}</div>
      </div>
    `).join('');
  }

  function openAddPartyModal() {
    const html = `
      <div class="modal-sheet__handle"></div>
      <div class="modal-sheet__title">Add New Party</div>
      <form id="addPartyForm" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label class="form-label">Party Name</label>
          <input type="text" id="partyName" class="form-input" required placeholder="e.g. Sai k k">
        </div>
        <div>
          <label class="form-label">Center / Area</label>
          <input type="text" id="partyCenter" class="form-input" placeholder="e.g. Bhankheda">
        </div>
        <div>
          <label class="form-label">WhatsApp Number</label>
          <input type="text" id="partyPhone" class="form-input" placeholder="e.g. 919307032698">
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%">Save Party</button>
      </form>
    `;
    openModal(html);

    document.getElementById('addPartyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, "parties"), {
          name: document.getElementById('partyName').value,
          center: document.getElementById('partyCenter').value,
          phone: document.getElementById('partyPhone').value,
          isActive: true
        });
        closeModals();
        showToast("Party added!");
      } catch (err) {
        console.error(err);
        showToast("Error adding party");
      }
    });
  }

  /* ============ PHASE 2 PLACEHOLDERS ============ */
  function renderDashboard() {
    const container = document.getElementById('dashboardContainer');
    if (!container) return;
    container.innerHTML = `<div class="card"><em>Dashboard analytics coming in Phase 2.</em></div>`;
  }

  function renderBillingView() {
    // Populates company select
    const select = document.getElementById('billingCompanySelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Choose Company --</option>' + 
      state.companies.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
  }

  function onBillingCompanyChange() {
    const coId = document.getElementById('billingCompanySelect').value;
    const container = document.getElementById('billingPartiesContainer');
    if (!coId) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = `<div class="card mt-16"><em>Billing generator for this company coming in Phase 2.</em></div>`;
  }


  /* ============ UI UTILS ============ */
  function openModal(htmlContent) {
    const overlay = document.getElementById('addModalOverlay');
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = htmlContent;
    overlay.classList.add('open');
  }

  function closeModals(e) {
    // If e is passed, only close if clicking overlay directly
    if (e && e.target.id !== 'addModalOverlay') return;
    document.getElementById('addModalOverlay').classList.remove('open');
  }

  function showToast(msg) {
    let t = document.getElementById('toastMsg');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toastMsg';
      t.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:10px 20px; border-radius:20px; font-size:14px; z-index:9999; transition:opacity 0.3s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 3000);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
  }

  function bindEvents() {
    const tBtn = document.getElementById('themeToggle');
    if(tBtn) {
      tBtn.addEventListener('click', () => {
        const root = document.documentElement;
        const meta = document.getElementById('themeColorMeta');
        if (root.getAttribute('data-theme') === 'dark') {
          root.removeAttribute('data-theme');
          localStorage.setItem('rathiSeeds_theme', 'light');
          if(meta) meta.content = '#e8f0eb';
        } else {
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('rathiSeeds_theme', 'dark');
          if(meta) meta.content = '#0f1a15';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  // Return public API
  return {
    switchView,
    openAddCompanyModal,
    openAddSeedModal,
    openAddPartyModal,
    closeModals,
    onBillingCompanyChange
  };

})();
