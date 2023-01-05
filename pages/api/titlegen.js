import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "genera una lista de 5 posibles titulo para la siguiente tematica. Debes devolver los datos en formato json guardando en el campo titulos la lista de titulos. tematica:";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 300,
  });

  const firstOutPut = baseCompletion.data.choices.pop();

  res.status(200).json({ output: firstOutPut });
};

export default generateAction;
