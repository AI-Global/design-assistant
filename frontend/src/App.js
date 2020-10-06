import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from './views/Home.js'
import Results from './views/Results.js'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/Results" component={Results}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;