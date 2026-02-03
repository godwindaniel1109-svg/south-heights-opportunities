// Support chat frontend logic
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('supportSendBtn');
    const input = document.getElementById('supportInput');
    const messagesEl = document.getElementById('supportMessages');
    let conversation = null;

    async function loadOrCreateConversation() {
        try {
            const convs = await api.request('/support/');
            if (Array.isArray(convs) && convs.length) {
                // pick an open conversation
                conversation = convs[0];
                await renderMessages();
                openSupportSocket(conversation.id);
                return;
            }
        } catch (e) {
            console.warn('No existing conversation or backend unavailable');
        }
    }

    async function renderMessages() {
        if (!conversation) return;
        try {
            const msgs = await api.getConversationMessages(conversation.id);
            messagesEl.innerHTML = '';
            msgs.forEach(m => appendMessage(m));
            messagesEl.scrollTop = messagesEl.scrollHeight;
        } catch (e) {
            console.error('Failed to load messages', e);
        }
    }

    // Append message object to DOM
    function appendMessage(m){
        const div = document.createElement('div');
        div.className = `chat-msg ${m.sender === 'admin' ? 'admin' : 'user'}`;
        div.style.marginBottom = '8px';
        div.innerHTML = `<div class="meta">${m.sender_display || m.sender} <span class="time">${new Date(m.created_at).toLocaleString()}</span></div><div class="content">${m.content}</div>`;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Websocket for live updates
    let supportSocket = null;
    function openSupportSocket(convId){
        if (supportSocket) supportSocket.close();
        const loc = window.location;
        const wsScheme = loc.protocol === 'https:' ? 'wss' : 'ws';
        const url = `${wsScheme}://${loc.host}/ws/support/${convId}/`;
        supportSocket = new WebSocket(url);
        supportSocket.onmessage = (e) => {
            try{
                const d = JSON.parse(e.data);
                if (d.type === 'support_message') appendMessage(d.message);
            }catch(err){console.error(err)}
        };
        supportSocket.onopen = () => console.log('Support socket connected');
        supportSocket.onclose = () => console.log('Support socket closed');
    }
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        // If no conversation, create one with the initial message
        if (!conversation) {
            try {
                conversation = await api.createConversation(text, 'support');
                input.value = '';
                await renderMessages();
                openSupportSocket(conversation.id);
                pollInterval = setInterval(renderMessages, 3000);
                return;
            } catch (e) {
                console.error('Failed to create conversation', e);
                showToast('Unable to connect to support. Please try again later.');
                return;
            }
        }

        try {
            await api.request(`/support/${conversation.id}/post_message/`, { method: 'POST', body: JSON.stringify({ content: text }) });
            input.value = '';
            await renderMessages();
        } catch (e) {
            console.error('Failed to send message', e);
            showToast('Failed to send message');
        }
    }

    function showToast(msg) {
        alert(msg);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    let pollInterval = null;
    loadOrCreateConversation().then(() => {
        if (!pollInterval) pollInterval = setInterval(renderMessages, 3000);
    });
});