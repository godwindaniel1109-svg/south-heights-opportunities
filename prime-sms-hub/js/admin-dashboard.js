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

function approvePending(reference) {
    showAlert('Approved ' + reference, 'success');
    // For a real approval process, call backend endpoint to mark verification_status completed
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchAdminStats();
});