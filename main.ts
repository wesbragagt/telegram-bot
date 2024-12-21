async function getChatId(token: string) {
  const url = `https://api.telegram.org/bot${token}/getUpdates`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get chat id: ${response.statusText}`);
  }

  const data = await response.json();

  if(!data.result[0].message.chat.id) {
    console.log(JSON.stringify(data));
    throw new Error('Failed to get chat id');
  }

  return data.result[0].message.chat.id;
}

async function sendMessage(chatId: string, token: string, message: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const data = { chat_id: chatId, text: message };
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  try {
    if (!process.argv[2]) {
      throw new Error('No message provided');
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('No token provided');
    }

    const chatId = await getChatId(token);

    sendMessage(chatId, token, process.argv[2]);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main()
