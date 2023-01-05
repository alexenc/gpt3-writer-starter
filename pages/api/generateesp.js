import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "genera una tabla de contenidos detallada dado el siguiente titulo. titulo: ";

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const firstOutPut = baseCompletion.data.choices.pop();
  console.log(firstOutPut);

  const secondPrompt = `
    Toma la tabla de contenidos y escribe un articulo en el estilo de un periodico de economia,
    haz que parezca una historia no solo lista los puntos. entra a fondo en cada uno.
    El articulo debe estar en formato markdown.
    
    titulo: ${req.body.userInput}
    
    tabla de contenidos: ${firstOutPut}

    Articulo:    
  `;

  const result = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    temperature: 0.8,
    max_tokens: 1250,
  });

  res.status(200).json({ output: result.data.choices.pop() });
};

export default generateAction;
