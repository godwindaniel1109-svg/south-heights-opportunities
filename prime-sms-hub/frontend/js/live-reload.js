/**
 * Live Reload Script for Frontend
 * Include this in your HTML files to enable auto-refresh
 * 
 * Usage: <script src="js/live-reload.js"></script>
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        host: window.location.hostname,
        port: 35729, // livereload port
        protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
        watchedFiles: ['*.html', '*.css', 'js/*.js'],
    };

    // Create WebSocket connection for live reload
    // store socket handle so it can be closed when disabled
    let __lr_socket = null;

    function initLiveReload() {
        if (isLiveReloadDisabled()) {
            console.log('%c⛔ Live Reload disabled', 'color: orange;');
            return;
        }
        try {
            const protocol = config.protocol;
            const url = `${protocol}://${config.host}:${config.port}/livereload`;
            
            const socket = new WebSocket(url);
            __lr_socket = socket;

            socket.onopen = function() {
                console.log('%c✅ Live Reload Connected', 'color: green; font-weight: bold;');
                // mark that we are connected and disable polling fallback
                window.liveReloadConnected = true;
            };

            socket.onmessage = function(event) {
                const message = JSON.parse(event.data);
                
                if (message.command === 'reload') {
                    // If a modal is open, defer reload until modal is closed.
                    if (isModalOpen()) {
                        console.log('%c⏸️ Reload deferred because a modal is open', 'color: orange;');
                        deferReloadUntilModalClosed();
                    } else {
                        handleReload(message);
                    }
                }
                
                if (message.command === 'alert') {
                    console.log('%c📝 File changed:', 'color: blue;', message.message);
                }
                if (message.command === 'changed') {
                    // Generic change notification - allow pages to soft-handle it
                    handleReload(message);
                }
            };

            socket.onerror = function(error) {
                console.error('Live Reload error:', error);
            };

            socket.onclose = function() {
                console.log('%c⚠️ Live Reload disconnected', 'color: red;');
                // Retry connection after 3 seconds
                setTimeout(initLiveReload, 3000);
            };

        } catch (error) {
            console.error('Failed to init live reload:', error);
            setTimeout(initLiveReload, 3000);
        }
    }

    // Utility: check if a site modal is currently open
    function isModalOpen() {
        try {
            // check a generic modal pattern used in this project
            const modals = document.querySelectorAll('.modal');
            for (let i = 0; i < modals.length; i++) {
                const m = modals[i];
                if (m.getAttribute('aria-hidden') === 'false' || m.classList.contains('show')) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // Defer reload while a modal is open; try again when closed.
    let __lr_reloadPending = false;
    function deferReloadUntilModalClosed() {
        if (__lr_reloadPending) return;
        __lr_reloadPending = true;
        const checkInterval = setInterval(function() {
            if (!isModalOpen()) {
                clearInterval(checkInterval);
                __lr_reloadPending = false;
                console.log('%c🔁 Now reloading (modal closed)', 'color: green;');
                window.location.reload();
            }
        }, 1000);
        // Timeout after 30s - avoid forever deferral
        setTimeout(function() {
            if (__lr_reloadPending) {
                clearInterval(checkInterval);
                __lr_reloadPending = false;
                console.log('%c⏳ Forced reload after timeout (modal still open)', 'color: red;');
                window.location.reload();
            }
        }, 30000);
    }

    // Alternative: Manual polling for file changes (gentle, header-based)
    function initPolling() {
        if (isLiveReloadDisabled()) return;

        // Use HEAD requests and check ETag / Last-Modified when possible.
        let lastETag = null;
        let lastModified = null;
        let fallbackFingerprint = null; // used if server doesn't return ETag/Last-Modified

        const shortPoll = 5000; // 5s for active checks
        const slowPoll = 60000; // 60s for fallback full content checks

        async function checkOnce() {
            try {
                // Prefer HEAD to avoid fetching body where possible
                const headRes = await fetch('/index.html', { method: 'HEAD', cache: 'no-store' });
                if (!headRes.ok) return;

                const etag = headRes.headers.get('etag');
                const lm = headRes.headers.get('last-modified');

                if (etag && lastETag && etag !== lastETag) {
                    return 'changed';
                }
                if (lm && lastModified && lm !== lastModified) {
                    return 'changed';
                }

                // store headers first time
                if (etag && !lastETag) lastETag = etag;
                if (lm && !lastModified) lastModified = lm;

                // If server doesn't provide ETag/Last-Modified, do a slower full GET and fingerprint body
                if (!etag && !lm) {
                    const now = Date.now();
                    const res = await fetch('/index.html', { method: 'GET', cache: 'no-store' });
                    if (!res.ok) return;
                    const text = await res.text();
                    // Simple fingerprint: length + first/last 20 chars
                    const fingerprint = `${text.length}:${text.slice(0, 20)}:${text.slice(-20)}`;
                    if (fallbackFingerprint && fingerprint !== fallbackFingerprint) return 'changed';
                    fallbackFingerprint = fallbackFingerprint || fingerprint;
                }
                return 'ok';
            } catch (e) {
                // network errors should not flood the console
                return 'error';
            }
        }

        // Short-poll loop for header checks; occasionally run a slower full check if necessary
        setInterval(async function() {
            if (isLiveReloadDisabled()) return;
            const result = await checkOnce();
            if (result === 'changed') {
                const message = { command: 'changed', message: 'Polling detected change' };
                if (isModalOpen()) {
                    deferReloadUntilModalClosed();
                } else {
                    handleReload(message);
                }
            }
        }, shortPoll);

        // If server doesn't provide helpful headers, run an extra slower full-body check as backup
        setInterval(async function() {
            if (isLiveReloadDisabled()) return;
            if (lastETag || lastModified) return; // headers are present; no need for slow GETs
            const res = await checkOnce();
            if (res === 'changed') {
                const message = { command: 'changed', message: 'Slow polling detected change' };
                if (isModalOpen()) {
                    deferReloadUntilModalClosed();
                } else {
                    handleReload(message);
                }
            }
        }, slowPoll);
    }

    function handleReload(message) {
        // If page requests soft reload (via body[data-live-reload="soft"] or global flag), dispatch an event; otherwise full reload
        try {
            const soft = (document.body && document.body.getAttribute && document.body.getAttribute('data-live-reload') === 'soft') || window.LIVE_RELOAD_MODE === 'soft';
            if (soft) {
                console.log('%c🔔 Soft live-reload: dispatching event', 'color: teal;');
                const ev = new CustomEvent('live-reload:changed', { detail: message });
                window.dispatchEvent(ev);
                return;
            }
        } catch (e) {
            // ignore and fallback to hard reload
        }
        console.log('%c🔄 Reloading page...', 'color: orange; font-weight: bold;');
        window.location.reload();
    }

    // Initialize when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiveReload);
    } else {
        initLiveReload();
    }

    // Also try polling as fallback
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (!window.liveReloadConnected && !isLiveReloadDisabled()) {
                console.log('Using polling fallback for live reload');
                initPolling();
            }
        }, 2000);
    });
    
    // Live reload enable/disable UI
    function isLiveReloadDisabled() {
        return localStorage.getItem('liveReloadDisabled') === 'true';
    }

    function setLiveReloadDisabled(val) {
        localStorage.setItem('liveReloadDisabled', val ? 'true' : 'false');
        // Close active socket connection if any
        try {
            if (val === true && __lr_socket && __lr_socket.readyState === WebSocket.OPEN) {
                __lr_socket.close();
            }
        } catch (e) {
            // ignore
        }
    }

    function renderToggle() {
        try {
            const el = document.createElement('div');
            el.id = 'lr-toggle';
            el.style.position = 'fixed';
            el.style.bottom = '12px';
            el.style.right = '12px';
            el.style.zIndex = '99999';
            el.style.background = 'rgba(13, 18, 43, 0.8)';
            el.style.color = '#fff';
            el.style.border = '1px solid rgba(66, 197, 245, 0.2)';
            el.style.padding = '6px 10px';
            el.style.borderRadius = '8px';
            el.style.fontSize = '12px';
            el.style.cursor = 'pointer';
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

            function updateText() {
                el.textContent = isLiveReloadDisabled() ? 'LiveReload: OFF' : 'LiveReload: ON';
                el.style.opacity = isLiveReloadDisabled() ? '0.6' : '1';
            }

            el.addEventListener('click', function(e) {
                e.stopPropagation();
                const newState = !isLiveReloadDisabled();
                setLiveReloadDisabled(!newState);
                updateText();
                // If we just enabled live reload, initialize a connection
                if (!isLiveReloadDisabled()) {
                    // Try to reconnect the websocket
                    initLiveReload();
                } else {
                    // disable poller by clearing connected flag
                    window.liveReloadConnected = false;
                }
            });

            document.body.appendChild(el);
            updateText();
        } catch (e) {
            // ignore
        }
    }

    // Render the toggle immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        renderToggle();
    } else {
        document.addEventListener('DOMContentLoaded', renderToggle);
    }
})();
