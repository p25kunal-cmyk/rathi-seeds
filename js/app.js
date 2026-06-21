import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, onSnapshot 
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
    // BYPASS LOGIN FOR PHASE 2
    document.getElementById('loginView').classList.remove('active');
    document.getElementById('mainNav').style.display = 'flex';
    
    bindEvents();
    listenToCollections();
    switchView('dashboard');
  }

  /* ============ FIRESTORE LISTENERS ============ */
  function listenToCollections() {
    onSnapshot(collection(db, "companies"), (snap) => {
      state.companies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupCompanies();
      renderBillingView();
    });

    onSnapshot(collection(db, "seeds"), (snap) => {
      state.seeds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSetupSeeds();
    });

    onSnapshot(collection(db, "parties"), (snap) => {
      state.parties = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderPartiesList();
      renderDashboard();
    });

    onSnapshot(collection(db, "bookings"), (snap) => {
      state.bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderDashboard();
      onBillingCompanyChange();
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

  /* ============ PHASE 2: DASHBOARD (LEDGER) ============ */
  function renderDashboard() {
    const container = document.getElementById('dashboardContainer');
    if (!container) return;

    if (state.parties.length === 0 || state.bookings.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No ledger data available. Import DB in Setup.</p></div>`;
      return;
    }

    // Group bookings by party
    let ledgerHTML = '';
    
    for (const p of state.parties) {
      const pBookings = state.bookings.filter(b => b.partyName === p.name);
      if (pBookings.length === 0) continue;
      
      let totalGross = 0;
      let totalReceived = 0;
      let totalOutstanding = 0;

      pBookings.forEach(b => {
        totalGross += Number(b.grossBill) || 0;
        totalReceived += Number(b.totalReceived) || 0;
        totalOutstanding += Number(b.outstanding) || 0;
      });

      const isClear = totalOutstanding <= 0;

      ledgerHTML += `
        <div class="card">
          <h3 style="margin:0">${escapeHTML(p.name)}</h3>
          <p class="text-dim text-sm" style="margin-bottom:12px;">📍 ${escapeHTML(p.center)}</p>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Gross Bill:</span>
            <strong>${formatCurrency(totalGross)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Received:</span>
            <strong style="color:var(--clr-success)">${formatCurrency(totalReceived)}</strong>
          </div>
          <hr style="border:0; border-top:1px solid var(--border-clr); margin:8px 0;">
          <div style="display:flex; justify-content:space-between;">
            <span>Outstanding:</span>
            <strong style="color:${isClear ? 'var(--clr-success)' : 'var(--clr-danger)'}">${formatCurrency(totalOutstanding)}</strong>
          </div>
        </div>
      `;
    }

    container.innerHTML = ledgerHTML;
  }

  /* ============ PHASE 2: BILLING ============ */
  function renderBillingView() {
    const select = document.getElementById('billingCompanySelect');
    if (!select) return;
    
    const currVal = select.value;
    select.innerHTML = '<option value="">-- Choose Company --</option>' + 
      state.companies.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
    select.value = currVal;
  }

  function onBillingCompanyChange() {
    const coId = document.getElementById('billingCompanySelect').value;
    const container = document.getElementById('billingPartiesContainer');
    if (!coId) {
      container.innerHTML = '';
      return;
    }

    const co = state.companies.find(c => c.id === coId);
    if (!co) return;

    // Filter bookings for this company
    const coBookings = state.bookings.filter(b => b.companyId === co.coId);
    if (coBookings.length === 0) {
      container.innerHTML = `<div class="card mt-16"><p class="text-dim">No bookings found for this company.</p></div>`;
      return;
    }

    // Group by party
    const partyMap = {};
    coBookings.forEach(b => {
      if (!partyMap[b.partyName]) partyMap[b.partyName] = [];
      partyMap[b.partyName].push(b);
    });

    let billsHTML = '';
    for (const [partyName, bks] of Object.entries(partyMap)) {
      const party = state.parties.find(p => p.name === partyName) || { name: partyName, phone: '' };
      
      let seedLines = '';
      let netTotal = 0;

      bks.forEach(b => {
        const seed = state.seeds.find(s => s.seedId === b.seedId) || { name: b.seedName || "Unknown" };
        netTotal += Number(b.netPayable) || 0;
        seedLines += `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.9rem;">
            <span>${escapeHTML(seed.name)} (${b.bagsFinal} bags @ ₹${b.rate})</span>
            <strong>${formatCurrency(b.netPayable)}</strong>
          </div>
        `;
      });

      // WA Link
      const textBill = `🌾 *${co.name}*\n------------------\n👤 Party: ${party.name}\n${bks.map(b => `• ${b.seedName || 'Seed'} (${b.bagsFinal} bags): ₹${b.netPayable}`).join('\n')}\n------------------\n💰 *Total: ${formatCurrency(netTotal)}*`;
      const waLink = party.phone ? `https://web.whatsapp.com/send/?phone=${party.phone}&text=${encodeURIComponent(textBill)}` : '#';

      billsHTML += `
        <div class="card mt-16">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0">${escapeHTML(party.name)}</h3>
            <span class="text-dim">Net: <strong style="color:var(--text-primary)">${formatCurrency(netTotal)}</strong></span>
          </div>
          <div style="background:var(--bg-primary); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-clr);">
            ${seedLines}
          </div>
          <div style="margin-top:12px; display:flex; gap:8px;">
            <a href="${waLink}" target="_blank" class="btn btn--primary btn--sm" ${!party.phone ? 'style="pointer-events:none; opacity:0.5"' : ''}>
              💬 Send on WhatsApp
            </a>
          </div>
        </div>
      `;
    }

    container.innerHTML = billsHTML;
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
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0;">
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
      return `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0;">
        <div><strong>${escapeHTML(s.name)}</strong> (${escapeHTML(s.weight || 0)} Kg)</div>
        <div class="text-dim text-sm">Rate: ₹${s.currentRate || 0}</div>
      </div>
    `}).join('');
  }

  function openAddCompanyModal() { showToast("Add Company Form Loaded"); }
  function openAddSeedModal() { showToast("Add Seed Form Loaded"); }
  function openAddPartyModal() { showToast("Add Party Form Loaded"); }

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

  /* ============ DATABASE IMPORT ============ */
  async function importDatabase() {
    if (!confirm("Are you sure you want to run the data importer?")) return;
    try {
      showToast("Downloading import data...");
      
      const res = await fetch('import_data.json');
      const data = await res.json();

      const bRes = await fetch('import_bookings.json');
      const bData = await bRes.json();
      
      showToast("Importing Companies...");
      for (const co of data.companies) {
        await addDoc(collection(db, "companies"), {
          coId: co["Co_ID"],
          name: co["Company Name"] || "Unknown",
          season: co["Season"] || "",
          bank: co["Bank"] || "",
          accountNo: co["Account No"] || "",
          ifsc: co["IFSC"] || "",
          notes: co["Notes"] || ""
        });
      }

      showToast("Importing Seeds...");
      for (const s of data.seeds) {
        await addDoc(collection(db, "seeds"), {
          seedId: s["Seed_ID"],
          companyId: s["Co_ID"],
          name: s["Seed Name"] || "Unknown",
          weight: s["Bag Wt (Kg)"] || 0,
          currentRate: s["Current Rate/Bag (₹)"] || 0,
          allotment: s["Allotment %"] || 1
        });
      }

      showToast("Importing Parties...");
      for (const p of data.parties) {
        await addDoc(collection(db, "parties"), {
          name: p["Party Name"] || "Unknown",
          center: p["Center"] || "",
          district: p["District"] || "",
          phone: p["Phone"] || "",
          isActive: p["Active"] === "Y"
        });
      }

      showToast("Importing Bookings...");
      for (const b of bData.bookings) {
        await addDoc(collection(db, "bookings"), {
          partyName: b["Party Name"],
          center: b["Center"],
          companyId: b["Company (Co_ID)"],
          seedId: b["Seed Name (Seed_ID)"],
          bagsFinal: b["Bags Final (Allotted)"],
          rate: b["Rate at Booking (₹)"],
          grossBill: b["Gross Bill (₹)"],
          netPayable: b["Net Payable (₹)"],
          totalReceived: b["Total Received (₹)"],
          outstanding: b["Outstanding Balance (₹)"],
          seedName: state.seeds.find(s => s.seedId === b["Seed Name (Seed_ID)"])?.name || "Seed"
        });
      }
      
      showToast("Import Complete!");
    } catch(err) {
      console.error(err);
      showToast("Import failed. See console.");
    }
  }


  /* ============ UI UTILS ============ */
  function closeModals(e) {
    if (e && e.target.id !== 'addModalOverlay') return;
    document.getElementById('addModalOverlay')?.classList.remove('open');
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

  function formatCurrency(num) {
    if (!num && num !== 0) return '₹0';
    return '₹' + Number(num).toLocaleString('en-IN');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function bindEvents() {
    const tBtn = document.getElementById('themeToggle');
    if(tBtn) {
      tBtn.addEventListener('click', () => {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'dark') {
          root.removeAttribute('data-theme');
        } else {
          root.setAttribute('data-theme', 'dark');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    switchView,
    openAddCompanyModal,
    openAddSeedModal,
    openAddPartyModal,
    closeModals,
    onBillingCompanyChange,
    importDatabase
  };

})();
