import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "write me a detailed table of contents with the given title. title: ";

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

  const secondPrompt = `
    Take the table of contents and write a blog post in the style of an economy newspaper, make it feel like a story , don't just list the points. go deep into each one.
    title: ${req.body.userInput}

    table of contents: ${firstOutPut}

    Blog post: 
  `;

  const result = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    temperature: 0.8,
    max_tokens: 1200,
  });

  res.status(200).json({ output: result.data.choices.pop() });
};

export default generateAction;
