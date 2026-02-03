// Admin Users page (real backend integration)
// Requires: admin/js/backend-api.js (global `api`)

let ALL_USERS = [];
let SELECTED_USER = null;

function checkAdminAuth() {
  const adminSession = localStorage.getItem('adminSession');
  const token = localStorage.getItem('authToken');
  if (!adminSession || !token) {
    window.location.href = 'admin-login.html';
    return false;
  }
  try {
    const admin = JSON.parse(adminSession);
    const emailEl = document.getElementById('adminEmail');
    if (emailEl) emailEl.textContent = admin.email || 'Admin';
  } catch {
    // ignore
  }
  return true;
}

function showInlineMessage(msg, type = 'info') {
  // If a global showAlert exists (from some pages), use it; else fallback
  if (typeof showAlert === 'function') return showAlert(msg, type);
  alert(msg);
}

function statusLabelFromUser(u) {
  // We treat is_active=false as suspended/banned; if you want separate "banned", add a field later.
  return u && u.is_active === false ? 'Suspended' : 'Active';
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!users.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="7" style="padding:16px;color:var(--text-secondary);">No users found.</td>`;
    tbody.appendChild(tr);
    return;
  }

  users.forEach(u => {
    const tr = document.createElement('tr');
    const status = statusLabelFromUser(u);
    const badgeClass = status.toLowerCase() === 'active' ? 'active' : 'suspended';
    tr.innerHTML = `
      <td>${u.email || '-'}</td>
      <td>${u.username || '-'}</td>
      <td>${u.first_name || ''} ${u.last_name || ''}</td>
      <td>-</td>
      <td>-</td>
      <td><span class="status-badge ${badgeClass}">${status}</span></td>
      <td>
        <div class="user-actions">
          <button class="btn btn-sm" data-action="view" data-user="${u.id}">View</button>
          ${status.toLowerCase() === 'active'
            ? `<button class="btn btn-sm btn-danger" data-action="suspend" data-user="${u.id}">Suspend</button>`
            : `<button class="btn btn-sm btn-primary" data-action="activate" data-user="${u.id}">Activate</button>`}
          <button class="btn btn-sm btn-danger" data-action="delete" data-user="${u.id}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function fetchUsers() {
  const q = (document.getElementById('searchUsers')?.value || '').trim();
  const status = (document.getElementById('statusFilter')?.value || '').trim(); // active/suspended
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status) params.set('status', status);

  // backend-api.js doesn't have a helper, so use request directly
  const res = await api.request(`/users/${params.toString() ? `?${params.toString()}` : ''}`);
  // DRF returns list for list endpoint
  return Array.isArray(res) ? res : (res.results || []);
}

async function refreshUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" style="padding:16px;color:var(--text-secondary);">Loading users...</td></tr>`;
  }
  try {
    ALL_USERS = await fetchUsers();
    renderUsersTable(ALL_USERS);
  } catch (e) {
    console.error(e);
    showInlineMessage('Failed to load users. Ensure you are logged in as an admin.', 'error');
    renderUsersTable([]);
  }
}

async function fetchUserDetails(userId) {
  return api.request(`/users/${userId}/`);
}

async function fetchUserWallet(userId) {
  try {
    const wallet = await api.request(`/wallet/by_user/?user_id=${userId}`);
    return wallet;
  } catch (e) {
    console.error('Failed to fetch wallet:', e);
    return null;
  }
}

async function openUserModalFromData(u) {
  SELECTED_USER = u;
  document.getElementById('modalEmail').textContent = u.email || '-';
  document.getElementById('modalName').textContent = `${u.first_name || ''} ${u.last_name || ''}`.trim() || (u.username || '-');
  document.getElementById('modalPhone').textContent = '-';
  document.getElementById('modalStatus').textContent = statusLabelFromUser(u);
  document.getElementById('modalBalance').textContent = 'Loading...';
  document.getElementById('userModal').style.display = 'block';
  
  // Fetch wallet balance
  const wallet = await fetchUserWallet(u.id);
  if (wallet && wallet.balance !== undefined) {
    document.getElementById('modalBalance').textContent = `₦${parseFloat(wallet.balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  } else {
    document.getElementById('modalBalance').textContent = 'N/A';
  }
}

// Wrapper functions for HTML onclick handlers
async function editUserBalance() {
  if (!SELECTED_USER) {
    showInlineMessage('Please select a user first', 'error');
    return;
  }
  const newBalance = prompt(`Enter new balance for ${SELECTED_USER.email} (₦):`);
  if (newBalance && !isNaN(newBalance) && parseFloat(newBalance) >= 0) {
    await adminAdjustWallet('set', parseFloat(newBalance));
    // Refresh wallet display
    const wallet = await fetchUserWallet(SELECTED_USER.id);
    if (wallet && wallet.balance !== undefined) {
      document.getElementById('modalBalance').textContent = `₦${parseFloat(wallet.balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
  }
}

async function addUserFunds() {
  if (!SELECTED_USER) {
    showInlineMessage('Please select a user first', 'error');
    return;
  }
  await adminAdjustWallet('add');
  // Refresh wallet display
  const wallet = await fetchUserWallet(SELECTED_USER.id);
  if (wallet && wallet.balance !== undefined) {
    document.getElementById('modalBalance').textContent = `₦${parseFloat(wallet.balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }
}

function closeUserModal() {
  const m = document.getElementById('userModal');
  if (m) m.style.display = 'none';
  SELECTED_USER = null;
}

async function suspendUser(userId) {
  if (!confirm('Suspend this user?')) return;
  await api.request(`/users/${userId}/suspend/`, { method: 'POST' });
  showInlineMessage('User suspended', 'success');
  await refreshUsers();
}

async function activateUser(userId) {
  if (!confirm('Activate this user?')) return;
  await api.request(`/users/${userId}/activate/`, { method: 'POST' });
  showInlineMessage('User activated', 'success');
  await refreshUsers();
}

async function deleteUser(userId) {
  if (!confirm('Delete this user? This cannot be undone.')) return;
  await api.request(`/users/${userId}/`, { method: 'DELETE' });
  showInlineMessage('User deleted', 'success');
  await refreshUsers();
}

async function adminAdjustWallet(mode, customAmount = null) {
  if (!SELECTED_USER) {
    showInlineMessage('Please select a user first', 'error');
    return;
  }
  
  let amount;
  if (customAmount !== null) {
    amount = customAmount;
  } else {
    amount = Number(document.getElementById('fundAmount')?.value || 0);
    if (!amount || amount <= 0) {
      showInlineMessage('Enter a valid amount', 'error');
      return;
    }
  }
  
  const payload = {
    user_id: SELECTED_USER.id,
    reason: 'Admin adjustment from admin panel'
  };
  if (mode === 'set') payload.absolute = amount;
  else payload.delta = amount;

  try {
    await api.request('/wallet/admin_adjust/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    showInlineMessage('Wallet updated successfully', 'success');
    if (document.getElementById('fundAmount')) {
      document.getElementById('fundAmount').value = '';
    }
  } catch (e) {
    console.error('Wallet adjustment error:', e);
    showInlineMessage(e.message || 'Failed to update wallet', 'error');
  }
}

function attachHandlers() {
  // Filter/search
  const search = document.getElementById('searchUsers');
  const status = document.getElementById('statusFilter');
  if (search) search.addEventListener('input', debounce(refreshUsers, 300));
  if (status) status.addEventListener('change', refreshUsers);

  // Table actions
  const tbody = document.getElementById('usersTableBody');
  if (tbody) {
    tbody.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const userId = btn.dataset.user;
      try {
        if (action === 'view') {
          const u = await fetchUserDetails(userId);
          openUserModalFromData(u);
          await fetchUserWallet(userId);
        } else if (action === 'suspend') {
          await suspendUser(userId);
        } else if (action === 'activate') {
          await activateUser(userId);
        } else if (action === 'delete') {
          await deleteUser(userId);
        }
      } catch (e) {
        console.error(e);
        showInlineMessage(e.message || 'Action failed', 'error');
      }
    });
  }

  // Modal close
  const closeBtn = document.querySelector('.modal-content .close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeUserModal);
  const modal = document.getElementById('userModal');
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeUserModal(); });

  // Wallet buttons (reuse existing UI)
  const addBtn = document.querySelector('button[onclick="addUserFunds()"]');
  const setBtn = document.querySelector('button[onclick="editUserBalance()"]');
  if (addBtn) addBtn.onclick = () => adminAdjustWallet('add');
  if (setBtn) setBtn.onclick = () => adminAdjustWallet('set');

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('authToken');
    window.location.href = 'admin-login.html';
  });
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAdminAuth()) return;
  attachHandlers();
  await refreshUsers();
});

