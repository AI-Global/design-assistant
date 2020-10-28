import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Results from './views/Results.js'
import Admin from './views/Admin.js'
import App from './App'

export default function Router() {
    return (
        <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/Results" component={Results}/>
            <Route path="/Admin" component={Admin}/>
          </Switch>
        </BrowserRouter>
      </div>
    )
}