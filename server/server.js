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

const classifier = new ChatOpenAI({
  temperature: 0,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const chatHistory = [];

app.get('/', async (req, res) => {
  console.log('Test voor GET');
});

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

    if (intent.includes('begroeting')) {
      const greetingResponse = 'Hey! Fijn je te zien. Waarmee kan ik je helpen?';
      chatHistory.push(['human', question]);
      chatHistory.push(['assistant', greetingResponse]);
      return res.json({ content: greetingResponse });
    }

    chatHistory.push(['human', `Tegenargument is: ${question}`]);

    const messages = [
      [
        'system',
        'Je bent een geduldige en behulpzame docent die studenten begeleidt bij het beantwoorden van hun studievragen. Je geeft hints en moedigt kritisch denken aan, maar geeft nooit direct het antwoord. Je bent gespecialiseerd in code problemen. Je doel is om de student zelfstandig tot inzicht en begrip te laten komen, terwijl je een vriendelijke en motiverende toon aanhoudt.',
      ],
      ...chatHistory,
    ];

    const result = await model.invoke(messages);
    chatHistory.push(['assistant', result.content]);
    res.json({ content: result.content });

  } catch (error) {
    console.error('Fout:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

app.listen(port, () => {
  console.log(`De server draait op http://localhost:${port}`);
});
