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
    activeView: "dashboard",
    companies: [],
    seeds: [],
    parties: [],
    bookings: [],
    cdRates: [],
    payments: []
  };
  /* ============ BUSINESS MATH UTILITIES ============ */
  function getGrossBill(booking) {
    return (booking.bagsFinal || 0) * (booking.rateAtBooking || booking.rate || 0);
  }

  function getBalanceForCD(booking) {
    return getGrossBill(booking) - (booking.bookingDis || 0);
  }

  function getCDDiscount(booking) {
    if (!booking.cdRound) return 0;
    const cd = state.cdRates.find(c => c.id === booking.cdRound);
    if (!cd) return 0;
    return Math.round(getBalanceForCD(booking) * cd.rate);
  }

  function getNetPayable(booking) {
    return getBalanceForCD(booking) - getCDDiscount(booking);
  }

  function getTotalReceived(partyName, coId) {
    return state.payments
      .filter(p => p.partyId === partyName && p.coId === coId && p.cleared)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  function getOutstandingBalance(partyName, coId) {
    const totalNet = state.bookings
      .filter(b => b.partyName === partyName && b.companyId === coId)
      .reduce((sum, b) => sum + getNetPayable(b), 0);
    const totalPaid = getTotalReceived(partyName, coId);
    return totalNet - totalPaid;
  }

  function getPartyStatus(outstanding, received) {
    if (outstanding <= 0 && received > 0) return "Cleared";
    if (received > 0) return "Partial";
    return "Pending";
  }

  function init() {
    // BYPASS LOGIN FOR PHASE 2
    document.getElementById('loginView').classList.remove('active');
    document.getElementById('mainNav').style.display = 'flex';
    
    bindEvents();
    // listenToCollections(); /* BYPASSED FOR LOCAL DEMO */
    
    renderSetupCompanies();
    renderSetupSeeds();
    renderPartiesList();
    renderDashboard();
    renderBillingView();

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
  function switchView(viewId, title = '') {
    state.activeView = viewId;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(viewId + 'View')?.classList.add('active');
    
    // Update active button
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => {
      const onclick = b.getAttribute('onclick') || '';
      return onclick.includes(`switchView('${viewId}'`);
    });
    if (activeBtn) activeBtn.classList.add('active');

    // Update Header Title
    const headerTitle = document.getElementById('topHeaderTitle');
    if (headerTitle && title) {
      headerTitle.textContent = title;
    }
    
    // Close sidebar on mobile
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('open');

    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'billing') renderBillingView();
    if (viewId === 'parties') renderPartiesList();
    if (viewId === 'companies') renderCompanyView();
    if (viewId === 'bookings') renderBookingsView();
    if (viewId === 'payments') renderPaymentsView();
    if (viewId === 'bulkbills') renderBulkBillsView();
    if (viewId === 'setup') {
      renderSetupCompanies();
      renderSetupSeeds();
      renderSetupCDRates();
    }
  }

  function renderCompanyView() {
    const select = document.getElementById('companySelect');
    if (!select) return;

    if (select.options.length <= 1 && state.companies.length > 0) {
      select.innerHTML = '<option value="">-- Select a Company --</option>' + 
        state.companies.map(c => `<option value="${c.coId || c.id}">${c.name}</option>`).join('');
    }

    const coId = select.value;
    const container = document.getElementById('companiesContainer');
    if (!container) return;

    if (!coId) {
      container.innerHTML = '<p class="text-dim">Please select a company above.</p>';
      return;
    }

    const coBookings = state.bookings.filter(b => b.companyId === coId);
    if (coBookings.length === 0) {
      container.innerHTML = '<div class="card"><p class="text-dim">No bookings for this company yet.</p></div>';
      return;
    }

    // Seed-wise breakdown
    const seedMap = {};
    coBookings.forEach(b => {
      if(!seedMap[b.seedName]) seedMap[b.seedName] = 0;
      seedMap[b.seedName] += b.bagsFinal;
    });

    let seedBreakdownHtml = `<div class="card mb-16"><h3 class="mt-0">Seed-wise Breakdown</h3>`;
    for(const [seed, bags] of Object.entries(seedMap)) {
       seedBreakdownHtml += `<div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid var(--border-clr); padding-bottom:4px;"><span>${escapeHTML(seed)}</span><strong>${bags} Bags</strong></div>`;
    }
    seedBreakdownHtml += `</div>`;

    // Parties List
    const partyMap = {};
    coBookings.forEach(b => {
      if(!partyMap[b.partyName]) partyMap[b.partyName] = { bags: 0, net: 0 };
      partyMap[b.partyName].bags += b.bagsFinal;
      partyMap[b.partyName].net += getNetPayable(b);
    });

    let partiesHtml = `<div class="card"><h3 class="mt-0">Parties Overview</h3><div class="parties-grid">`;
    for(const [partyName, data] of Object.entries(partyMap)) {
       const received = getTotalReceived(partyName, coId);
       const outstanding = data.net - received;
       const statusBadge = outstanding <= 0 ? 
         `<span style="background:var(--clr-success); color:#fff; padding:2px 8px; border-radius:12px; font-size:0.75rem;">Cleared</span>` :
         `<span style="background:var(--clr-danger); color:#fff; padding:2px 8px; border-radius:12px; font-size:0.75rem;">Due: ${formatCurrency(outstanding)}</span>`;

       partiesHtml += `
         <div style="border:1px solid var(--border-clr); padding:12px; border-radius:var(--radius-sm);">
           <h4 style="margin:0 0 8px 0;">${escapeHTML(partyName)}</h4>
           <div class="text-dim text-sm mb-8">Bags: <strong>${data.bags}</strong> | Net: ${formatCurrency(data.net)}</div>
           <div>${statusBadge}</div>
         </div>
       `;
    }
    partiesHtml += `</div></div>`;

    container.innerHTML = seedBreakdownHtml + partiesHtml;
  }
  function renderBookingsView() {
    const el = document.getElementById('bookingsContainer');
    if (!el) return;
    if (state.bookings.length === 0) {
       el.innerHTML = '<p class="text-dim">No bookings found.</p>';
       return;
    }
    el.innerHTML = state.bookings.map(b => {
       const co = state.companies.find(c => c.coId === b.companyId || c.id === b.companyId) || { name: b.companyId };
       const seed = state.seeds.find(s => s.seedId === b.seedId) || { name: b.seedName };
       const gross = getGrossBill(b);
       const net = getNetPayable(b);

       return `
         <div class="card" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
               <h4 style="margin:0">${escapeHTML(b.partyName)}</h4>
               <strong style="color:var(--clr-primary);">${formatCurrency(net)}</strong>
            </div>
            <div class="text-dim text-sm" style="margin-bottom:8px;">${escapeHTML(co.name)} • ${escapeHTML(seed.name)}</div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding-top:8px; border-top:1px dashed var(--border-clr);">
               <span>Bags: <strong>${b.bagsFinal}</strong> @ ₹${b.rateAtBooking || b.rate || 0}</span>
               <span>Gross: ${formatCurrency(gross)}</span>
            </div>
            ${b.cdRound ? `<div style="text-align:right; font-size:0.8rem; color:var(--text-dim); margin-top:4px;">CD Round: ${b.cdRound}</div>` : ''}
         </div>
       `;
    }).join('');
  }
  function renderPaymentsView() {
    const el = document.getElementById('paymentsContainer');
    if (!el) return;
    if (!state.payments || state.payments.length === 0) {
       el.innerHTML = '<p class="text-dim">No payments found.</p>';
       return;
    }
    el.innerHTML = state.payments.map(p => {
       const co = state.companies.find(c => c.coId === p.coId || c.id === p.coId) || { name: p.coId };
       return `
         <div class="card" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
               <h4 style="margin:0">${escapeHTML(p.partyId)}</h4>
               <div class="text-dim text-sm">${escapeHTML(co.name)} • ${escapeHTML(p.type)}</div>
               <div class="text-dim text-sm" style="margin-top:4px;">📅 ${escapeHTML(p.date)} | Ref: ${escapeHTML(p.ref)}</div>
            </div>
            <div style="text-align:right;">
               <strong style="color:var(--clr-success); font-size:1.1rem;">${formatCurrency(p.amount)}</strong>
               <div class="text-sm mt-4">
                  ${p.cleared ? '<span style="background:var(--clr-success); color:white; padding:2px 8px; border-radius:12px; font-size:0.7rem;">Cleared</span>' : '<span style="background:var(--clr-danger); color:white; padding:2px 8px; border-radius:12px; font-size:0.7rem;">Pending</span>'}
               </div>
            </div>
         </div>
       `;
    }).join('');
  }
  function renderBulkBillsView() {
    const el = document.getElementById('bulkbillsContainer');
    if (!el) return;

    if (state.companies.length === 0) {
      el.innerHTML = '<p class="text-dim">No companies available.</p>';
      return;
    }

    let html = `
      <div class="card mb-16" style="max-width:400px;">
        <label class="form-label">Select Company for Bulk Billing</label>
        <select id="bulkCompanySelect" class="form-select" onchange="App.generateBulkBillPreview()">
          <option value="">-- Select Company --</option>
          ${state.companies.map(c => `<option value="${c.coId || c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div id="bulkBillOutput"></div>
    `;
    el.innerHTML = html;
  }

  function generateBulkBillPreview() {
    const coId = document.getElementById('bulkCompanySelect').value;
    const output = document.getElementById('bulkBillOutput');
    if (!coId) { output.innerHTML = ''; return; }

    const coName = state.companies.find(c => c.coId === coId || c.id === coId)?.name || coId;
    const coBookings = state.bookings.filter(b => b.companyId === coId);

    if (coBookings.length === 0) {
      output.innerHTML = '<p class="text-dim">No bookings for this company.</p>';
      return;
    }

    const partyMap = {};
    coBookings.forEach(b => {
      if(!partyMap[b.partyName]) partyMap[b.partyName] = 0;
      partyMap[b.partyName] += getNetPayable(b);
    });

    let msg = `*${coName.toUpperCase()} - OUTSTANDING SUMMARY*\\n\\n`;
    for(const [pName, net] of Object.entries(partyMap)) {
      const received = getTotalReceived(pName, coId);
      const outstanding = net - received;
      if (outstanding > 0) {
        msg += `*${pName}*: ${formatCurrency(outstanding)}\\n`;
      }
    }

    output.innerHTML = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0;">WhatsApp Summary</h3>
          <button class="btn btn--primary btn--sm" onclick="navigator.clipboard.writeText(document.getElementById('bulkBillText').innerText); App.showToast('Copied!')">Copy Text</button>
        </div>
        <div id="bulkBillText" class="text-box" style="white-space: pre-wrap;">${escapeHTML(msg)}</div>
      </div>
    `;
  }
  function renderSetupCDRates() {
    const el = document.getElementById('setupCDRatesList');
    if (!el) return;
    if (!state.cdRates || state.cdRates.length === 0) {
      el.innerHTML = '<p class="text-dim">No CD Rates added yet.</p>';
      return;
    }
    el.innerHTML = state.cdRates.map(c => `
      <div style="border-bottom: 1px solid var(--border-clr); padding: 8px 0; display:flex; justify-content:space-between;">
        <div>
           <strong>${escapeHTML(c.round)}</strong> <span class="text-dim text-sm">(${escapeHTML(c.coId)})</span>
           <div class="text-dim text-sm">Deadline: ${c.deadline ? escapeHTML(c.deadline) : 'None'}</div>
        </div>
        <div style="font-weight:bold; color:var(--clr-primary);">
           ${(c.rate * 100).toFixed(1)}%
        </div>
      </div>
    `).join('');
  }

  /* ============ PHASE 2: DASHBOARD (LEDGER) ============ */
  let dashboardChartsInstance = {};

  function renderDashboard() {
    const container = document.getElementById('dashboardContainer');
    if (!container) return;

    if (state.parties.length === 0 || state.bookings.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No ledger data available. Import DB in Setup.</p></div>`;
      document.getElementById('dashboardCharts').style.display = 'none';
      return;
    }

    // Group bookings by party
    let ledgerHTML = '';
    const coSales = {};
    const partyOutstandings = [];
    
    for (const p of state.parties) {
      const pBookings = state.bookings.filter(b => b.partyName === p.name);
      if (pBookings.length === 0) continue;
      
      let totalGross = 0;
      let totalReceived = 0;
      let totalOutstanding = 0;

      pBookings.forEach(b => {
        totalGross += getGrossBill(b);
        const net = getNetPayable(b);
        const coName = state.companies.find(c => c.coId === b.companyId || c.id === b.companyId)?.name || b.companyId;
        if(!coSales[coName]) coSales[coName] = 0;
        coSales[coName] += net;
      });

      const uniqueCoIds = [...new Set(pBookings.map(b => b.companyId))];
      uniqueCoIds.forEach(coId => {
         totalReceived += getTotalReceived(p.name, coId);
         totalOutstanding += getOutstandingBalance(p.name, coId);
      });

      partyOutstandings.push({name: p.name, out: totalOutstanding});

      const isClear = totalOutstanding <= 0;

      ledgerHTML += `
        <div class="card">
          <h3 style="margin:0; cursor:pointer; color:var(--clr-primary);" onclick="App.openPartyDetailModal('${escapeHTML(p.name).replace(/'/g, "\\'")}')">${escapeHTML(p.name)} 🔗</h3>
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

    // Render Charts
    document.getElementById('dashboardCharts').style.display = 'grid';
    renderCharts(coSales, partyOutstandings);
  }

  function renderCharts(coSales, partyOutstandings) {
    if (!window.Chart) return;
    
    // Donut Chart
    const ctxDonut = document.getElementById('salesDonutChart');
    if (!ctxDonut) return;
    if (dashboardChartsInstance.donut) dashboardChartsInstance.donut.destroy();
    
    const coLabels = Object.keys(coSales);
    const coData = Object.values(coSales);
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    dashboardChartsInstance.donut = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: coLabels,
        datasets: [{
          data: coData,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });

    // Bar Chart
    partyOutstandings.sort((a,b) => b.out - a.out);
    const topParties = partyOutstandings.slice(0, 5);
    
    const ctxBar = document.getElementById('outstandingBarChart');
    if (!ctxBar) return;
    if (dashboardChartsInstance.bar) dashboardChartsInstance.bar.destroy();

    dashboardChartsInstance.bar = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: topParties.map(p => p.name.length > 10 ? p.name.substring(0,10) + '...' : p.name),
        datasets: [{
          label: 'Outstanding (₹)',
          data: topParties.map(p => p.out),
          backgroundColor: '#ef4444',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, display: false }
        }
      }
    });
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
      let totalReceived = 0;
      let totalOutstanding = 0;

      bks.forEach(b => {
        const seed = state.seeds.find(s => s.seedId === b.seedId) || { name: b.seedName || "Unknown" };
        const gross = getGrossBill(b);
        const net = getNetPayable(b);
        
        netTotal += net;
        totalReceived += Number(b.totalReceived) || 0;
        
        seedLines += `
          <div style="font-size:0.9rem; margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${escapeHTML(seed.name)} (${b.bagsFinal} bags @ ₹${b.rateAtBooking || b.rate || 0})</span>
              <span>${formatCurrency(net)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--text-dim); font-size:0.8rem;">
               <span>Gross: ${formatCurrency(gross)}</span>
               ${net !== gross ? `<span>Discounted Net: ${formatCurrency(net)}</span>` : ''}
            </div>
          </div>
        `;
      });

      totalReceived = getTotalReceived(party.name, co.id || co.coId);
      totalOutstanding = getOutstandingBalance(party.name, co.id || co.coId);

      // WA Link
      let textBill = `🌾 *${co.name}*\n-----------------------------------\n👤 *Party:* ${party.name}\n`;
      if (party.center) textBill += `📍 *Center:* ${party.center}\n`;
      textBill += `\n*DETAILS:*\n`;

      bks.forEach((b, i) => {
         const seed = state.seeds.find(s => s.seedId === b.seedId) || { name: b.seedName || "Unknown" };
         const gross = getGrossBill(b);
         const net = getNetPayable(b);
         textBill += `${i+1}) *${seed.name}* (${b.bagsFinal} bags @ ₹${b.rateAtBooking || b.rate || 0})\n   Gross: ${formatCurrency(gross)}\n`;
         if (net !== gross) textBill += `   Net: ${formatCurrency(net)}\n`;
      });
      textBill += `-----------------------------------\n`;
      textBill += `💰 *TOTAL PAYABLE:* ${formatCurrency(netTotal)}\n`;
      textBill += `🏦 *RECEIVED:* ${formatCurrency(totalReceived)}\n`;
      textBill += `✅ *OUTSTANDING:* ${formatCurrency(totalOutstanding)}\n`;
      if (co.bank) {
         textBill += `\n*BANK DETAILS:*\n${co.bank}\nA/C: ${co.accountNo}\nIFSC: ${co.ifsc}\n`;
      }
      textBill += `\n— *Rathi Seeds* 🌱`;
      
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

  function openAddCompanyModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add Company</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitCompany(event)">
        <div class="form-group">
           <label class="form-label">Company ID (Short Code)</label>
           <input type="text" id="coId" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Company Name</label>
           <input type="text" id="coName" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Bank Name</label>
           <input type="text" id="coBank" class="form-input">
        </div>
        <div class="form-group">
           <label class="form-label">Account No</label>
           <input type="text" id="coAcc" class="form-input">
        </div>
        <div class="form-group">
           <label class="form-label">IFSC Code</label>
           <input type="text" id="coIfsc" class="form-input">
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save Company</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitCompany(e) {
    e.preventDefault();
    state.companies.push({
      id: "C" + Date.now(),
      coId: document.getElementById('coId').value,
      name: document.getElementById('coName').value,
      bank: document.getElementById('coBank').value,
      accountNo: document.getElementById('coAcc').value,
      ifsc: document.getElementById('coIfsc').value
    });
    if (typeof renderSetupCompanies === 'function') renderSetupCompanies();
    App.closeModals();
    showToast("Company Added!");
  }

  function openAddSeedModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add Seed</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitSeed(event)">
        <div class="form-group">
           <label class="form-label">Company</label>
           <select id="seedCo" class="form-select" required>
              ${state.companies.map(c => `<option value="${c.coId}">${c.name}</option>`).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Seed Name</label>
           <input type="text" id="seedName" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Seed ID</label>
           <input type="text" id="seedId" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Bag Weight (Kg)</label>
           <input type="number" step="0.1" id="seedWt" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Current Rate / Bag (₹)</label>
           <input type="number" id="seedRate" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Allotment %</label>
           <input type="number" step="0.01" id="seedAllot" class="form-input" value="1" required>
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save Seed</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitSeed(e) {
    e.preventDefault();
    state.seeds.push({
      id: "S" + Date.now(),
      companyId: document.getElementById('seedCo').value,
      seedId: document.getElementById('seedId').value,
      name: document.getElementById('seedName').value,
      weight: Number(document.getElementById('seedWt').value),
      currentRate: Number(document.getElementById('seedRate').value),
      allotment: Number(document.getElementById('seedAllot').value)
    });
    if (typeof renderSetupSeeds === 'function') renderSetupSeeds();
    App.closeModals();
    showToast("Seed Added!");
  }

  function openAddPartyModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add Party</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitParty(event)">
        <div class="form-group">
           <label class="form-label">Party Name</label>
           <input type="text" id="pName" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Center (City/Village)</label>
           <input type="text" id="pCenter" class="form-input">
        </div>
        <div class="form-group">
           <label class="form-label">District</label>
           <input type="text" id="pDist" class="form-input">
        </div>
        <div class="form-group">
           <label class="form-label">Phone</label>
           <input type="text" id="pPhone" class="form-input">
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save Party</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitParty(e) {
    e.preventDefault();
    state.parties.push({
      id: "P" + Date.now(),
      name: document.getElementById('pName').value,
      center: document.getElementById('pCenter').value,
      district: document.getElementById('pDist').value,
      phone: document.getElementById('pPhone').value,
      isActive: true
    });
    if (typeof renderPartiesList === 'function') renderPartiesList();
    App.closeModals();
    showToast("Party Added!");
  }

  function openPartyDetailModal(partyName) {
    const pBookings = state.bookings.filter(b => b.partyName === partyName);
    
    let detailsHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
        <h2 style="margin:0">${escapeHTML(partyName)}</h2>
        <button class="btn btn--outline btn--sm close-modal-btn" onclick="App.closeModals(event)">✕</button>
      </div>
      <div style="max-height: 70vh; overflow-y: auto; padding-right:8px;">
    `;

    if (pBookings.length === 0) {
      detailsHTML += `<p class="text-dim">No transactions found.</p></div>`;
    } else {
      // Group by company
      const coMap = {};
      pBookings.forEach(b => {
        const coName = state.companies.find(c => c.id === b.companyId || c.coId === b.companyId)?.name || b.companyId;
        if (!coMap[coName]) coMap[coName] = [];
        coMap[coName].push(b);
      });

      for (const [coName, bks] of Object.entries(coMap)) {
        let netTotal = 0;
        let totalReceived = 0;
        let totalOutstanding = 0;
        let seedLines = '';
        bks.forEach(b => {
          const gross = getGrossBill(b);
          const net = getNetPayable(b);
          
          netTotal += net;
          seedLines += `
            <div style="font-size: 0.9rem; margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-weight:600;">
                <span>${escapeHTML(b.seedName)} (${b.bagsFinal} bags @ ₹${b.rateAtBooking || b.rate || 0})</span>
                <span>Net: ${formatCurrency(net)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:var(--text-dim); font-size:0.8rem;">
                <span>Gross: ${formatCurrency(gross)}</span>
              </div>
            </div>
          `;
        });
        
        totalReceived = getTotalReceived(partyName, bks[0].companyId);
        totalOutstanding = getOutstandingBalance(partyName, bks[0].companyId);

        detailsHTML += `
          <div class="card" style="margin-bottom: 12px; padding: 12px; background:var(--bg-page);">
            <h4 style="margin:0 0 8px 0; color: var(--text-primary);">${escapeHTML(coName)}</h4>
            <div style="padding-bottom:8px; border-bottom: 1px solid var(--border-clr); margin-bottom:8px;">
              ${seedLines}
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:4px;">
              <span>Total Payable:</span>
              <span>${formatCurrency(netTotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--clr-success); margin-bottom:4px;">
              <span>Received:</span>
              <span>${formatCurrency(totalReceived)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--clr-danger);">
              <span>Outstanding:</span>
              <span>${formatCurrency(totalOutstanding)}</span>
            </div>
          </div>
        `;
      }
      detailsHTML += `</div>`;
    }

    const sheet = document.getElementById('addModalSheet');
    if (sheet) {
      sheet.innerHTML = detailsHTML;
      document.getElementById('addModalOverlay').classList.add('open');
    }
  }

  /* ============ PHASE 1: PARTIES ============ */
  function renderPartiesList() {
    const container = document.getElementById('partiesListContainer');
    if (!container) return;
    
    const searchInput = document.getElementById('partySearch');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const filteredParties = state.parties.filter(p => 
      p.name.toLowerCase().includes(query) || (p.center || '').toLowerCase().includes(query)
    );

    if (filteredParties.length === 0) {
      container.innerHTML = `<div class="card"><p class="text-dim">No parties found.</p></div>`;
      return;
    }

    container.innerHTML = filteredParties.map(p => {
       const pBookings = state.bookings.filter(b => b.partyName === p.name);
       const uniqueCos = [...new Set(pBookings.map(b => {
          const co = state.companies.find(c => c.id === b.companyId || c.coId === b.companyId);
          return co ? co.name : b.companyId;
       }))];
       
       const pillsHtml = uniqueCos.map(c => `<span style="display:inline-block; background:var(--clr-secondary); color:var(--text-primary); padding:2px 8px; border-radius:12px; font-size:0.7rem; margin-right:4px;">${escapeHTML(c)}</span>`).join('');

       // Calc totals
       let totalNet = 0;
       pBookings.forEach(b => totalNet += getNetPayable(b));
       
       let totalReceived = 0;
       const uniqueCoIds = [...new Set(pBookings.map(b => b.companyId))];
       uniqueCoIds.forEach(cid => {
         totalReceived += getTotalReceived(p.name, cid);
       });

       const totalOutstanding = totalNet - totalReceived;
       const statusBadge = getPartyStatus(totalOutstanding, totalReceived);
       const statusHtml = statusBadge === "Cleared" 
          ? `<span style="color:var(--clr-success); font-weight:bold; font-size:0.8rem;">● Cleared</span>`
          : (statusBadge === "Partial" ? `<span style="color:orange; font-weight:bold; font-size:0.8rem;">● Partial</span>` : `<span style="color:var(--clr-danger); font-weight:bold; font-size:0.8rem;">● Pending</span>`);

       return `
         <div class="card" style="display:flex; flex-direction:column; gap:8px;">
           <div style="display:flex; justify-content:space-between; align-items:flex-start;">
             <div>
               <h3 style="margin:0; cursor:pointer; color:var(--clr-primary);" onclick="App.openPartyDetailModal('${escapeHTML(p.name).replace(/'/g, "\\'")}')">${escapeHTML(p.name)} 🔗</h3>
               <div class="text-dim text-sm" style="margin-top:4px;">📍 ${escapeHTML(p.center || 'No Center')} | 📞 ${escapeHTML(p.phone || 'N/A')}</div>
             </div>
             <div>${statusHtml}</div>
           </div>
           ${pillsHtml ? `<div style="margin-top:4px;">${pillsHtml}</div>` : ''}
           <div style="margin-top:8px; border-top:1px dashed var(--border-clr); padding-top:8px; display:flex; justify-content:space-between; font-size:0.85rem;">
             <span>Total Bill: <strong>${formatCurrency(totalNet)}</strong></span>
             <span style="color:${totalOutstanding > 0 ? 'var(--clr-danger)' : 'var(--text-dim)'}">Due: <strong>${formatCurrency(totalOutstanding)}</strong></span>
           </div>
         </div>
       `;
    }).join('');
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


  /* ============ PHASE 3 FORMS ============ */
  function openAddPaymentModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add Payment</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitPayment(event)">
        <div class="form-group">
           <label class="form-label">Party</label>
           <select id="payParty" class="form-select" required>
              <option value="">-- Select Party --</option>
              ${state.parties.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Company</label>
           <select id="payCompany" class="form-select" required>
              <option value="">-- Select Company --</option>
              ${state.companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Amount (₹)</label>
           <input type="number" id="payAmount" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Payment Type</label>
           <select id="payType" class="form-select" required>
              <option value="Advance Booking">Advance Booking</option>
              <option value="1st CD Payment">1st CD Payment</option>
              <option value="2nd CD Payment">2nd CD Payment</option>
              <option value="Final Balance">Final Balance</option>
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Date</label>
           <input type="date" id="payDate" class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
        <div class="form-group">
           <label class="form-label">Reference / UTR</label>
           <input type="text" id="payRef" class="form-input">
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save Payment</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitPayment(e) {
    e.preventDefault();
    const payload = {
      id: "PM" + Date.now(),
      partyId: document.getElementById('payParty').value,
      coId: document.getElementById('payCompany').value,
      amount: Number(document.getElementById('payAmount').value),
      type: document.getElementById('payType').value,
      date: document.getElementById('payDate').value,
      ref: document.getElementById('payRef').value,
      cleared: true
    };
    
    state.payments.push(payload);
    
    if (typeof renderPaymentsView === 'function') renderPaymentsView();
    if (typeof renderDashboard === 'function') renderDashboard();
    App.closeModals();
    showToast("Payment Added Successfully!");
  }

  function openAddBookingModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add Booking</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitBooking(event)">
        <div class="form-group">
           <label class="form-label">Party</label>
           <select id="bkParty" class="form-select" required>
              <option value="">-- Select Party --</option>
              ${state.parties.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Seed</label>
           <select id="bkSeed" class="form-select" required>
              <option value="">-- Select Seed --</option>
              ${state.seeds.map(s => {
                 const co = state.companies.find(c => c.coId === s.companyId) || {name: s.companyId};
                 return `<option value="${s.seedId}" data-coid="${s.companyId}">${co.name} - ${s.name}</option>`;
              }).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Bags Allotted</label>
           <input type="number" id="bkBags" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Rate Stamped at Booking (₹)</label>
           <input type="number" id="bkRate" class="form-input" required>
        </div>
        <div class="form-group">
           <label class="form-label">Flat Booking Discount (₹)</label>
           <input type="number" id="bkDis" class="form-input" value="0">
        </div>
        <div class="form-group">
           <label class="form-label">CD Eligibility Round</label>
           <select id="bkCD" class="form-select">
              <option value="">-- None --</option>
              ${state.cdRates.map(c => `<option value="${c.id}">${c.round} (${(c.rate * 100).toFixed(1)}%)</option>`).join('')}
           </select>
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save Booking</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitBooking(e) {
    e.preventDefault();
    const seedSel = document.getElementById('bkSeed');
    const seedOpt = seedSel.options[seedSel.selectedIndex];
    const seedNameObj = state.seeds.find(s => s.seedId === seedSel.value);
    
    const payload = {
      id: "BK" + Date.now(),
      partyName: document.getElementById('bkParty').value,
      seedId: seedSel.value,
      seedName: seedNameObj ? seedNameObj.name : 'Unknown',
      companyId: seedOpt.getAttribute('data-coid'),
      bagsFinal: Number(document.getElementById('bkBags').value),
      rateAtBooking: Number(document.getElementById('bkRate').value),
      bookingDis: Number(document.getElementById('bkDis').value),
      cdRound: document.getElementById('bkCD').value
    };
    
    state.bookings.push(payload);
    
    if (typeof renderBookingsView === 'function') renderBookingsView();
    if (typeof renderDashboard === 'function') renderDashboard();
    App.closeModals();
    showToast("Booking Added Successfully!");
  }

  function openAddCDRateModal() {
    const sheet = document.getElementById('addModalSheet');
    sheet.innerHTML = `
      <div class="modal-header">
        <h2>Add CD Rate</h2>
        <button class="close-modal-btn" onclick="App.closeModals()">✕</button>
      </div>
      <form onsubmit="App.submitCDRate(event)">
        <div class="form-group">
           <label class="form-label">Company</label>
           <select id="cdCompany" class="form-select" required>
              <option value="">-- Select Company --</option>
              ${state.companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
           </select>
        </div>
        <div class="form-group">
           <label class="form-label">Round Name</label>
           <input type="text" id="cdRound" class="form-input" placeholder="e.g. 1st CD, Deepawali Scheme" required>
        </div>
        <div class="form-group">
           <label class="form-label">Discount Rate (%)</label>
           <input type="number" step="0.1" id="cdRate" class="form-input" placeholder="e.g. 8" required>
        </div>
        <div class="form-group">
           <label class="form-label">Deadline</label>
           <input type="date" id="cdDate" class="form-input">
        </div>
        <button type="submit" class="btn btn--primary btn--block mt-16">Save CD Rate</button>
      </form>
    `;
    document.getElementById('addModalOverlay').classList.add('open');
  }

  function submitCDRate(e) {
    e.preventDefault();
    const payload = {
      id: "CD" + Date.now(),
      coId: document.getElementById('cdCompany').value,
      round: document.getElementById('cdRound').value,
      rate: Number(document.getElementById('cdRate').value) / 100,
      deadline: document.getElementById('cdDate').value
    };
    
    state.cdRates.push(payload);
    
    if (typeof renderSetupCDRates === 'function') renderSetupCDRates();
    App.closeModals();
    showToast("CD Rate Added Successfully!");
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
    renderCompanyView,
    renderPartiesList,
    generateBulkBillPreview,
    openAddCompanyModal,
    submitCompany,
    openAddSeedModal,
    submitSeed,
    openAddPartyModal,
    submitParty,
    openAddPaymentModal,
    submitPayment,
    openAddBookingModal,
    submitBooking,
    openAddCDRateModal,
    submitCDRate,
    openPartyDetailModal,
    closeModals,
    onBillingCompanyChange,
    importDatabase
  };

})();
