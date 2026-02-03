// Small helper to toggle notification sound setting
(function(){
    async function toggleSound(enabled) {
        try {
            const form = new FormData();
            form.append('notify_sound', enabled ? 'true' : 'false');
            const resp = await fetch('/api/users/profile/', {
                method: 'PATCH',
                body: form,
                headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
            });
            if (!resp.ok) throw new Error('Failed');
            const data = await resp.json();
            window.__notifySoundEnabled = data.profile.notify_sound;
            return data.profile.notify_sound;
        } catch (e) { console.error('Toggle sound failed', e); throw e; }
    }

    window.toggleNotifySound = toggleSound;
})();
