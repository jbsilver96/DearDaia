import React, { useState, useEffect } from 'react';

const QuestionHistory = () => {
  const [questionHistory, setQuestionHistory] = useState([]);

  useEffect(() => {
    const questionHistoryJson = localStorage.getItem('questionHistory');
    if (questionHistoryJson) {
      setQuestionHistory(JSON.parse(questionHistoryJson));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('questionHistory', JSON.stringify(questionHistory));
  }, [questionHistory]);

  return (
    <div>
      <h3>Question History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Questions</th>
          </tr>
        </thead>
        <tbody>
          {questionHistory.map((questions, index) => (
            <tr key={index}>
              <td>{new Date().toLocaleDateString()}</td>
              <td>
                <ul>
                  {questions.map((question, i) => (
                    <li key={i}>{question}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionHistory;
