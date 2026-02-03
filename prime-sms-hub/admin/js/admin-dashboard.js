// Fetch and display admin dashboard statistics
async function fetchAdminStats() {
    try {
        const adminSession = localStorage.getItem('adminSession');
        const headers = new Headers();
        // For local/dev access we send a simple secret header; in production this should be replaced with proper auth
        headers.append('X-Admin-Secret', 'dev-secret');
        const res = await fetch('/api/admin/stats/', { headers });
        if (!res.ok) {
            console.warn('Failed to fetch admin stats', res.status);
            return;
        }
        const data = await res.json();
        // Populate metrics
        document.getElementById('totalRevenue').textContent = (data.total_revenue || 0).toLocaleString();
        document.getElementById('activeUsers').textContent = data.active_users_30d || 0;
        document.getElementById('numbersPurchased').textContent = data.numbers_purchased || 0;
        document.getElementById('pendingApprovals').textContent = data.pending_deposits || 0;

        // Render monthly chart bars
        const chartBars = document.querySelectorAll('.simple-chart .chart-bar');
        if (chartBars && data.monthly_data) {
            data.monthly_data.forEach((amt, idx) => {
                const el = chartBars[idx];
                if (!el) return;
                // Normalize height (max to 100)
                const max = Math.max(...data.monthly_data, 1);
                const pct = Math.round((amt / max) * 100);
                el.style.height = (20 + pct) + '%';
            });
        }

        // Populate pending payments list
        const pendingSection = document.querySelector('.pending-section');
        if (pendingSection) {
            const listContainer = document.createElement('div');
            listContainer.id = 'pendingPaymentsList';
            if (data.pending_payments && data.pending_payments.length) {
                data.pending_payments.forEach(p => {
                    const item = document.createElement('div');
                    item.className = 'pending-item';
                    item.innerHTML = `
                        <div class="pending-info">
                            <p>User: ${p.user_email || 'Unknown'}</p>
                            <p>${p.description} - Ref: ${p.reference}</p>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div class="pending-amount">₦${Number(p.amount).toLocaleString()}</div>
                            <button class="btn btn-sm btn-primary" onclick="approvePending('${p.reference}')">Approve</button>
                        </div>
                    `;
                    listContainer.appendChild(item);
                });
            } else {
                listContainer.innerHTML = '<p style="color:var(--text-secondary);">No pending payments</p>';
            }
            // Replace existing static pending items
            const existing = pendingSection.querySelectorAll('.pending-item');
            existing.forEach(n => n.remove());
            pendingSection.appendChild(listContainer);
        }

    } catch (err) {
        console.error('Error fetching admin stats', err);
    }
}

async function approvePending(reference) {
    if (!reference) {
        showAlert('Invalid reference', 'error');
        return;
    }
    
    // Show loading state
    const btn = event?.target || document.querySelector(`button[onclick*="${reference}"]`);
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Approving...';
    }
    
    try {
        const adminSession = localStorage.getItem('adminSession');
        const headers = new Headers({
            'Content-Type': 'application/json',
            'X-Admin-Secret': 'dev-secret' // In production, use proper auth token
        });
        
        if (adminSession) {
            try {
                const admin = JSON.parse(adminSession);
                const token = localStorage.getItem('authToken');
                if (token) {
                    headers.append('Authorization', `Token ${token}`);
                }
            } catch (e) {
                console.warn('Could not parse admin session', e);
            }
        }
        
        const res = await fetch('/api/wallet/approve_deposit/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ reference: reference })
        });
        
        if (!res.ok) {
            const error = await res.json().catch(() => ({ error: 'Failed to approve deposit' }));
            throw new Error(error.error || 'Failed to approve deposit');
        }
        
        const data = await res.json();
        showAlert(data.message || 'Deposit approved successfully', 'success');
        
        // Refresh the admin stats to update pending payments list
        setTimeout(() => {
            fetchAdminStats();
        }, 1000);
        
    } catch (err) {
        console.error('Error approving deposit:', err);
        showAlert(err.message || 'Failed to approve deposit. Please try again.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Approve';
        }
    }
}

// Alias for backward compatibility with HTML onclick handlers
function approvePendingPayment() {
    // This function is called from static HTML buttons that don't have reference
    // We need to find the reference from the button's context
    const btn = event?.target;
    if (btn) {
        const item = btn.closest('.pending-item');
        if (item) {
            const refElement = item.querySelector('.pending-info p:last-child');
            if (refElement) {
                const text = refElement.textContent;
                const match = text.match(/Ref:\s*([^\s]+)/);
                if (match && match[1]) {
                    approvePending(match[1]);
                    return;
                }
            }
        }
    }
    showAlert('Could not find transaction reference', 'error');
}

// Fetch system status
async function fetchSystemStatus() {
    try {
        const adminSession = localStorage.getItem('adminSession');
        const headers = new Headers();
        headers.append('X-Admin-Secret', 'dev-secret');
        
        if (adminSession) {
            try {
                const admin = JSON.parse(adminSession);
                const token = localStorage.getItem('authToken');
                if (token) {
                    headers.append('Authorization', `Token ${token}`);
                }
            } catch (e) {
                console.warn('Could not parse admin session', e);
            }
        }
        
        const res = await fetch('/api/admin/system-status/', { headers });
        if (!res.ok) {
            console.warn('Failed to fetch system status', res.status);
            return;
        }
        
        const data = await res.json();
        
        // Update API Status
        const apiStatusEl = document.querySelector('[data-status="api"]');
        if (apiStatusEl && data.api) {
            const status = data.api.status === 'operational' ? 'operational' : 'error';
            apiStatusEl.innerHTML = `<span style="color: var(--${status === 'operational' ? 'success' : 'danger'}-color); font-weight: 600;">${status === 'operational' ? '🟢' : '🔴'} ${data.api.status}</span>`;
        }
        
        // Update Database Status
        const dbStatusEl = document.querySelector('[data-status="database"]');
        if (dbStatusEl && data.database) {
            const status = data.database.status === 'healthy' ? 'healthy' : 'error';
            dbStatusEl.innerHTML = `<span style="color: var(--${status === 'healthy' ? 'success' : 'danger'}-color); font-weight: 600;">${status === 'healthy' ? '🟢' : '🔴'} ${data.database.status}</span>`;
        }
        
        // Update 5SIM Status
        const fivesimStatusEl = document.querySelector('[data-status="fivesim"]');
        if (fivesimStatusEl && data.fivesim) {
            const status = data.fivesim.status === 'connected' ? 'connected' : 'error';
            fivesimStatusEl.innerHTML = `<span style="color: var(--${status === 'connected' ? 'success' : 'danger'}-color); font-weight: 600;">${status === 'connected' ? '🟢' : '🔴'} ${data.fivesim.status}</span>`;
        }
        
        // Update Paystack Status
        const paystackStatusEl = document.querySelector('[data-status="paystack"]');
        if (paystackStatusEl && data.paystack) {
            const status = data.paystack.status === 'configured' ? 'configured' : 'error';
            paystackStatusEl.innerHTML = `<span style="color: var(--${status === 'configured' ? 'success' : 'danger'}-color); font-weight: 600;">${status === 'configured' ? '🟢' : '🔴'} ${data.paystack.status}</span>`;
        }
        
    } catch (err) {
        console.error('Error fetching system status', err);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchAdminStats();
    fetchSystemStatus();
    // Refresh system status every 30 seconds
    setInterval(fetchSystemStatus, 30000);
});