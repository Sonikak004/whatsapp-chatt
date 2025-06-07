const venom = require('venom-bot');

venom
  .create({
    session: 'dumwala-session',
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--headless=new' // THIS is the key part
    ]
  })
  .then((client) => start(client))
  .catch((error) => {
    console.error(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body.toLowerCase() === 'hi' && message.isGroupMsg === false) {
      await client.sendText(message.from, 'Heyyy! This is your Dumwala bot 🌶️🍗\nType "menu" to get started!');
    } else if (message.body.toLowerCase() === 'menu') {
      await client.sendText(message.from, '🥘 Dumwala Menu:\n1. Biryani\n2. Kebab\n3. Drinks\n\nReply with the number to order.');
    } else {
      await client.sendText(message.from, 'Got it! Our human agent will get back to you soon ❤️');
    }
  });
}
