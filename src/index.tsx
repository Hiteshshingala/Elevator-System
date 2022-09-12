import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { ElevatorContainer } from './components/';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home/0" />} />
          <Route path="home" element={<App />}>
            <Route path=":floor" element={<ElevatorContainer />} />
          </Route>
          <Route path="*" element={<h1>Route Not Found</h1>} />
        </Routes>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
