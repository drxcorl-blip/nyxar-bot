require('dotenv').config();

const express = require('express');
const app = express();

const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');

const PORT = process.env.PORT || 3000;

/* 🌐 PORTA PER RENDER (OBBLIGATORIA PER WEB SERVICE) */
app.get('/', (req, res) => {
  res.send('Nyxar Bot è online 🤖');
});

app.listen(PORT, () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});

/* 🤖 DISCORD BOT */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 sicurezza per Render H24
client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.once('ready', () => {
  console.log('Nyxar Bot è online!');
});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith('!ai ')) return;

  const domanda = message.content.slice(4);

  try {

    const risposta = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sei Nyxar Bot, un assistente amichevole della community Discord del team Nyxar.'
        },
        {
          role: 'user',
          content: domanda
        }
      ],
      model: 'llama-3.3-70b-versatile'
    });

    message.reply(risposta.choices[0].message.content);

  } catch (err) {
    console.error(err);
    message.reply('⚠️ Errore IA.');
  }

});

/* ⚠️ FIX IMPORTANTE */
client.login(process.env.TOKEN);