const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');

// Express server for UptimeRobot ping
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/ping', (req, res) => res.send('Ping success 💖'));
app.listen(PORT, () => console.log(`🚀 Ping server running on port ${PORT}`));

// WhatsApp bot
async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) qrcode.generate(qr, { small: true });

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) startSock();
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.remoteJid;

    console.log(`📩 Message from ${sender}: ${text}`);

    if (text.toLowerCase() === 'hi') {
      await sock.sendMessage(sender, { text: 'Hey, How can I help you today?' });
    } else if (text.toLowerCase().includes('love')) {
      await sock.sendMessage(sender, { text: 'Aww 🥺 I love you too 💌' });
    }
  });
}

startSock();
