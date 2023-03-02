import React, { useState } from 'react';
import './App.css';

const Table = ({ diaryEntries, handleReflectionChange }) => {
  const tableBoxRef = React.useRef(null);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const generateQuestions = (prompt) => {
    let newPrompt = "Generate a list of 3 questions based on the input text:\n" + prompt
    return fetch("/ask", {
      method: "POST",
      body: JSON.stringify({ 
        prompt: newPrompt }),
        headers: {
          "content-type": "application/json"
        }
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Failed to generate questions');
    })
  }

  const handleGenerateQuestions = async (entry, index) => {
    try {
      const response = await generateQuestions(entry);
      const questions = response.message.trim().split('\n');
      setGeneratedQuestions(prevState => {
        const newState = [...prevState];
        newState[index] = questions;
        return newState;
      });
    } catch (error) {
      console.error(error);
    }
  }

  const hyperlinkUrls = (text) => {
    return text.replace(
      /(https?:\/\/[^\s]+)/g,
      (match) => `<a href="${match}" target="_blank">${match}</a>`
    );
  };

  return (
    <div className="table-box">
      <h3>Diary entries</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Entry</th>
            <th>Generated Questions</th>
            <th>Reflection</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {diaryEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td dangerouslySetInnerHTML={{ __html: hyperlinkUrls(entry.entry) }}></td>
              <td>
                {generatedQuestions[index] ? (
                  <ul>
                    {generatedQuestions[index].map((question, i) => (
                      <li key={i}>{question}</li>
                    ))}
                  </ul>
                ) : (
                  <button onClick={() => handleGenerateQuestions(entry.entry, index)}>Generate Questions</button>
                )}
              </td>
              <td>
                <textarea value={entry.reflection} onChange={(event) => handleReflectionChange(event, index)} />
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
