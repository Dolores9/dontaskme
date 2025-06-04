import { ChatOpenAI } from '@langchain/openai';
import cors from 'cors';
import express from 'express';

const model = new ChatOpenAI({
  temperature: 0.3,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
  maxRetries: 10,
});

const app = express();
const port = 3000;
const chatHistory = [];

app.use(cors());
app.use(express.json());

async function classifyIntent(userInput) {
  const messages = [
    ['system', 'Je bent een AI die gebruikersinvoer classificeert. Geef enkel één van de volgende labels terug: begroeting, vraag, afsluiting, opmerking, anders.'],
    ['user', `Classificeer deze zin: "${userInput}"`],
  ];
  const result = await classifier.invoke(messages);
  return result.content.toLowerCase().trim();
}

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    const intent = await classifyIntent(question);
    console.log('Herkende intentie:', intent);

  
    chatHistory.push({ sender: 'user', text: question });

    if (intent.includes('begroeting')) {
      const greetingResponse = 'Hey! Fijn je te zien. Waarmee kan ik je helpen?';
      chatHistory.push({ sender: 'bot', text: greetingResponse });
      return res.json({ content: greetingResponse, sender: 'bot' });
    }

    const messages = [
      [
        'system',
        'Je bent een geduldige en behulpzame docent die studenten begeleidt bij het beantwoorden van hun studievragen. Je geeft hints en moedigt kritisch denken aan, maar geeft nooit direct het antwoord. Je bent gespecialiseerd in code problemen.',
      ],
      ...chatHistory.map(m => [m.sender === 'user' ? 'human' : 'assistant', m.text]),
    ];

    const result = await model.invoke(messages);
    chatHistory.push({ sender: 'bot', text: result.content });

    res.json({ content: result.content, sender: 'bot' });

  } catch (error) {
    console.error('Fout:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

app.listen(port, () => {
  console.log(`De server draait op http://localhost:${port}`);
});
