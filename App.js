import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Table from './Table';
import GeneratedQuestionsTable from './QuestionHistory';
import QuestionHistory from './QuestionHistory';


function App() {
  const [diaryEntries, setDiaryEntries] = useState(() => {
    const storedEntries = localStorage.getItem('diaryEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  });

  const [currentEntry, setCurrentEntry] = useState('');

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  const handleEntryChange = (event) => {
    setCurrentEntry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date().toLocaleString();
    setDiaryEntries([{ entry: currentEntry, reflection: '', date: now }, ...diaryEntries]);
    setCurrentEntry('');
    setQuestionHistory([]);
  };
  

  const handleReflectionChange = (event, index) => {
    const newEntries = [...diaryEntries];
    newEntries[index].reflection = event.target.value;
    setDiaryEntries(newEntries);
  };

  const handleExportCSV = () => {
    const csv = diaryEntries.map((entry) => {
      return [entry.date, entry.entry, entry.reflection].join(',');
    }).join('\n');
    const csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.setAttribute('href', csvData);
    link.setAttribute('download', 'diary_entries.csv');
    link.click();
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(diaryEntries);
    const jsonData = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
    const link = document.createElement('a');
    link.setAttribute('href', jsonData);
    link.setAttribute('download', 'diary_entries.json');
    link.click();
  };

  const handleClearEntries = () => {
    setDiaryEntries([]);
  };

  const loadMore = () => {
    // implement the logic to load more data here
    console.log('loading more data...');
  };

  const observer = useRef();
  const lastRow = useRef();

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) {
        loadMore();
      }
    });
  }, []);

  useEffect(() => {
    if (lastRow.current) {
      observer.current.observe(lastRow.current);
    }
  }, [lastRow.current]);  



  return (
    <div className="App">
      <nav>
        <a href="#">Home</a>
        <a href="#">Diary</a>
        <a href="#">Profile</a>
      </nav>
      <h1>DearDaia</h1>
      <h2><i>AI powered self-knowledge diary</i></h2>
      <form onSubmit={handleSubmit} className="form">
        <textarea id="entry" placeholder="Share an epic story or a poetic thought, keep track of academic research, maybe talk about your deepest hopes fears, or build a machine learning data respository..." value={currentEntry} onChange={handleEntryChange} />
        <br />
        <button type="submit">Submit</button>
      </form>
  <Table diaryEntries={diaryEntries} handleReflectionChange={handleReflectionChange} />
  <QuestionHistory generatedQuestions={QuestionHistory} />
  <div className="signup-container">
  </div>
  <div className="footer">
    <div className="footer-container">
      <div className="csv-container">
        <button className="csv-button" onClick={handleExportCSV}>Export to CSV</button>
        <button className="json-button" onClick={handleExportJSON}>Export to JSON</button>
        <button className="clear-button" onClick={handleClearEntries}>Clear All Entries</button>
      </div>
      <div className="load-more-container">
        <div ref={lastRow}>Loading more entries...</div>
      </div>
    </div>
  </div>
</div>
  );
}

export default App;