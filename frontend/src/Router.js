import App from './App';
import React from "react";
import Admin from './views/Admin.js';
import Results from './views/Results.js';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DesignAssistantSurvey from './views/DesignAssistantSurvey.js';
import ViewSubmissions from './views/ViewSubmissions';


export default function Router() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/DesignAssistantSurvey" component={DesignAssistantSurvey} />
          <Route path="/Results" component={Results} />
          <PrivateRoute path="/Admin" component={Admin} />
          <PrivateRoute path="/ViewSubmissions" component={ViewSubmissions} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

//<Route path="/submissions/:id" component={ViewSubmissions} />