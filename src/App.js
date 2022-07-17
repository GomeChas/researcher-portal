import './App.css';
import logo from './logo.svg';
// import React, { useState } from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ResearchersPage from "./pages/ResearchersPage";
// import ChimerasPage from "./pages/ChimerasPage";
// import GenesPage from "./pages/GenesPage";
// import VectorsPage from "./pages/VectorsPage";
// import AntiBacterialsPage from "./pages/AntiBacterialsPage"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to MyT Codon</h1>
      <p>DESCRIPTION</p>
      </header>
    <div className="App-body">
      <h3>Just a test</h3>
      {/* <Router> 
        <Route path="/" exact>
          <HomePage/>
        </Route>
        <Route path="/researchers">
          <ResearchersPage />
        </Route>
        <Route path="/chimeras">
          <ChimerasPage/>
        </Route>
        <Route path="/genes">
          <GenesPage/>
        </Route>
        <Route path="/vectors">
          <VectorsPage/>
        </Route>
        <Route path="/antibacterials">
          <AntiBacterialsPage/>
        </Route>
      </Router>*/}
    </div>
    <footer className="App-footer">
    <p>Powered by:</p>
    <img src={logo} alt="react logo" className="App-logo"></img>
    <p>© 2022 | Chase Gomez</p>
    </footer>
    </div>
  );
}

export default App;