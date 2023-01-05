import Head from "next/head";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Home = () => {
  const [titleList, settitleList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/titlegen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;

    console.log("OpenAI replied...", output.text);

    settitleList(JSON.parse(output.text).titulos);
    setIsGenerating(false);
  };

  const generateBlog = async () => {
    settitleList([]);
    setSelectedTitle("");
    console.log(selectedTitle);
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generateesp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: selectedTitle }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const selectTitle = (title) => {
    setSelectedTitle(title);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>EZ BLOG</h1>
          </div>

          <div className="header-subtitle">
            <h2>Easilly create blog and text content for your sites</h2>
          </div>

          <div className="prompt-container">
            <textarea
              placeholder="start typing here"
              className="prompt-box"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          <div className="prompt-buttons m2">
            <a className="generate-button" onClick={callGenerateEndpoint}>
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Artículo generado</h3>
                </div>
              </div>
              <ReactMarkdown children={apiOutput}></ReactMarkdown>
            </div>
          )}
          {titleList.map((title) => (
            <>
              <p
                style={{ color: selectedTitle === title && "red" }}
                onClick={() => selectTitle(title)}
              >
                {title}
              </p>
            </>
          ))}
          {selectedTitle.length > 0 && (
            <a className="generate-button" onClick={generateBlog}>
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
