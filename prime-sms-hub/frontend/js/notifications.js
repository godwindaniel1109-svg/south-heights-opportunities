// Notifications UI: bell, dropdown, polling
(function(){
    const POLL_INTERVAL = 30000; // 30s

    function createBellMarkup() {
        return `
        <div id="notifWrapper" style="position:relative;">
            <button id="notifBell" title="Notifications" style="background:none;border:none;color:var(--text-gray);cursor:pointer;font-size:18px;position:relative;">
                <i class="fas fa-bell"></i>
                <span id="notifBadge" style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:white;border-radius:999px;padding:2px 6px;font-size:11px;display:none;">0</span>
            </button>
            <div id="notifDropdown" style="display:none;position:absolute;right:0;top:28px;min-width:320px;background:var(--secondary-dark);border:1px solid rgba(66,197,245,0.15);border-radius:8px;padding:10px;z-index:2000;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="color:var(--accent-blue);">Notifications</strong>
                    <div>
                        <button id="markAllReadBtn" style="background:none;border:none;color:var(--text-gray);cursor:pointer;margin-right:8px;">Mark all read</button>
                        <button id="closeNotifBtn" style="background:none;border:none;color:var(--text-gray);cursor:pointer;">✕</button>
                    </div>
                </div>
                <div id="notifList" style="max-height:360px;overflow:auto;"></div>
                <div id="notifFooter" style="margin-top:8px;text-align:center;color:var(--text-gray);font-size:12px;"></div>
            </div>
        </div>`;
    }

    async function updateBadge() {
        try{
            const res = await api.getUnreadCount();
            const n = res.unread || 0;
            const badge = document.getElementById('notifBadge');
            if (!badge) return;
            if (n > 0) {
                badge.style.display = 'inline-block';
                badge.textContent = n;
            } else {
                badge.style.display = 'none';
            }
        }catch(e){ console.error('Unread count error', e); }
    }

    function renderNotificationItem(n) {
        const time = new Date(n.created_at).toLocaleString();
        const cls = n.is_read ? '' : 'status-pending';
        const link = n.link ? `data-link="${n.link}"` : '';
        const avatar = (n.user && n.user.avatar) || n.user_avatar || null;
        const avatarHtml = avatar ? `<img src="${avatar}" style="height:40px;width:40px;border-radius:50%;object-fit:cover;margin-right:8px;" />` : `<div style="height:40px;width:40px;border-radius:50%;background:#2b6cb0;color:white;display:flex;align-items:center;justify-content:center;margin-right:8px;font-weight:600;">${(n.user && n.user.username ? n.user.username.charAt(0).toUpperCase() : (n.user_display ? n.user_display.charAt(0) : 'A'))}</div>`;
        return `
            <div class="notif-item" data-id="${n.id}" ${link} style="padding:8px;border-bottom:1px solid rgba(66,197,245,0.04);cursor:pointer;display:flex;align-items:flex-start;">
                ${avatarHtml}
                <div style="flex:1;">
                    <div style="font-weight:600;color:var(--text-light);">${n.title}</div>
                    <div style="color:var(--text-gray);font-size:0.9rem;margin-top:4px;">${n.message}</div>
                    <div style="text-align:right;font-size:0.8rem;color:var(--text-gray);margin-top:6px;">${time} <span class="status-badge ${cls}" style="padding:4px 8px;margin-left:6px;">${n.type.toUpperCase()}</span></div>
                </div>
            </div>
        `;
    }

    function showToast(n) {
        try {
            const toast = document.createElement('div');
            toast.className = 'notif-toast';
            toast.style.position = 'fixed';
            toast.style.right = '18px';
            toast.style.top = '18px';
            toast.style.background = 'linear-gradient(90deg,#2563eb,#06b6d4)';
            toast.style.color = 'white';
            toast.style.padding = '12px 16px';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = '0 8px 24px rgba(2,6,23,0.2)';
            toast.style.zIndex = 3000;
            toast.style.opacity =  '0';
            toast.style.transition = 'opacity 200ms ease, transform 300ms ease';

            const title = document.createElement('div');
            title.style.fontWeight = '700';
            title.style.marginBottom = '4px';
            title.textContent = n.title;
            const msg = document.createElement('div');
            msg.style.opacity = '0.95';
            msg.style.fontSize = '13px';
            msg.textContent = n.message;
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.border = 'none';
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '14px';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '6px';
            closeBtn.style.right = '8px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.padding = '2px 6px';

            toast.appendChild(title);
            toast.appendChild(msg);
            toast.appendChild(closeBtn);
            document.body.appendChild(toast);

            // animate in
            requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });

            // play a short beep using WebAudio API (no external asset needed)
            try {
                const ac = new (window.AudioContext || window.webkitAudioContext)();
                const o = ac.createOscillator();
                const g = ac.createGain();
                o.type = 'sine';
                o.frequency.value = 880;
                o.connect(g);
                g.connect(ac.destination);
                g.gain.value = 0.05;
                o.start();
                setTimeout(() => { o.stop(); ac.close(); }, 120);
            } catch (e) { /* ignore audio errors */ }

            const removeToast = () => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); };

            let autoDismiss = setTimeout(removeToast, 5000);

            closeBtn.addEventListener('click', () => { clearTimeout(autoDismiss); removeToast(); });

            // clicking the toast navigates to link if provided
            toast.addEventListener('click', (evt) => {
                if (evt.target === closeBtn) return; // handled above
                if (n.link) window.location.href = n.link;
            });
        } catch (e) { console.error('Toast error', e); }
    }

    async function loadNotifications() {
        try{
            const res = await api.getNotifications({page_size:20});
            const list = Array.isArray(res) ? res : (res.results || res);
            const container = document.getElementById('notifList');
            const footer = document.getElementById('notifFooter');
            if (!container) return;
            if (!list || list.length === 0) {
                container.innerHTML = '<div style="padding:12px;color:var(--text-gray);">No notifications</div>';
                footer.textContent = '';
                return;
            }
            container.innerHTML = list.map(renderNotificationItem).join('');
            footer.textContent = `Showing ${list.length} notifications`;

            // attach click handlers
            container.querySelectorAll('.notif-item').forEach(el => {
                el.addEventListener('click', async (e) => {
                    const id = el.dataset.id;
                    try{
                        await api.markNotificationRead(id);
                        updateBadge();
                        // navigate to link if present
                        const link = el.getAttribute('data-link');
                        if (link) window.location.href = link;
                        else {
                            // re-render to show read state
                            el.style.opacity = 0.6;
                        }
                    }catch(err){ console.error('Mark read failed', err); }
                });
            });
        }catch(e){ console.error('Load notifications failed', e); }
    }

    function setupBell() {
        // find user-info containers across pages and append bell
        const userInfos = document.querySelectorAll('.user-info');
        userInfos.forEach(ui => {
            if (ui.querySelector('#notifWrapper')) return; // already added
            const wrapper = document.createElement('div');
            wrapper.innerHTML = createBellMarkup();
            wrapper.style.marginLeft = '12px';
            ui.appendChild(wrapper);

            const bell = wrapper.querySelector('#notifBell');
            const dropdown = wrapper.querySelector('#notifDropdown');
            const closeBtn = wrapper.querySelector('#closeNotifBtn');
            const markAllBtn = wrapper.querySelector('#markAllReadBtn');

            bell.addEventListener('click', async () => {
                const shown = dropdown.style.display === 'block';
                if (!shown) {
                    dropdown.style.display = 'block';
                    await loadNotifications();
                    document.addEventListener('click', outsideClick);
                } else {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', outsideClick);
                }
            });

            closeBtn.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });

            markAllBtn.addEventListener('click', async () => {
                try{
                    await api.markAllNotificationsRead();
                    await updateBadge();
                    await loadNotifications();
                }catch(e){ console.error('Mark all failed', e); }
            });

            function outsideClick(e) {
                if (!wrapper.contains(e.target)) {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', outsideClick);
                }
            }
        });
    }

    // Start polling and setup
    document.addEventListener('DOMContentLoaded', () => {
        setupBell();
        updateBadge();
        setInterval(updateBadge, POLL_INTERVAL);
        // Try to open WebSocket for instant notifications
        try {
            const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
            const ws = new WebSocket(`${protocol}://${location.host}/ws/notifications/`);
            ws.addEventListener('message', (evt) => {
                try {
                    const data = JSON.parse(evt.data);
                    if (data && data.type === 'notification' && data.notification) {
                        // increment badge
                        const badge = document.getElementById('notifBadge');
                        const current = Number(badge.textContent || 0);
                        badge.style.display = 'inline-block';
                        badge.textContent = current + 1;
                        // show toast
                        showToast(data.notification);
                        // prepend to list if open
                        const list = document.getElementById('notifList');
                        if (list) {
                            const itemHtml = renderNotificationItem(data.notification);
                            list.innerHTML = itemHtml + list.innerHTML;
                        }
                        // attempt to play sound only if user allows
                        (async function(){
                            try {
                                // if we have cached user preference, use it; otherwise fetch current user
                                if (typeof window.__notifySoundEnabled === 'undefined') {
                                    try {
                                        const user = await api.getCurrentUser();
                                        window.__notifySoundEnabled = (user.profile && user.profile.notify_sound) !== false;
                                    } catch (err) {
                                        window.__notifySoundEnabled = true;
                                    }
                                }
                                if (window.__notifySoundEnabled) {
                                    // WebAudio beep handled inside showToast; if we want to centralize, we could call a playSound() here
                                }
                            } catch (e) { /* ignore */ }
                        })();
                    }
                } catch (e) { console.error('WS parse error', e); }
            });
        } catch (e) { console.warn('WebSocket not available', e); }
    });
})();