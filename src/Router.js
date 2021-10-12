import App from './App';
import React from 'react';
import Admin from './views/Admin.js';
import Results from './views/Results.js';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DesignAssistantSurvey from './views/DesignAssistantSurvey.js';
import ViewSubmissions from './views/ViewSubmissions';
// import { ThemeProvider } from '@material-ui/core/styles';

export default function Router() {
  return (
    <div className="App">
      {/* <ThemeProvider theme={{ fontFamily: "Exo 2', sans-serif" }}> */}
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/DesignAssistantSurvey"
            component={DesignAssistantSurvey}
          />
          <Route path="/Results" component={Results} />
          <PrivateRoute path="/Admin" component={Admin} />
          <PrivateRoute path="/ViewSubmissions" component={ViewSubmissions} />
        </Switch>
      </BrowserRouter>
      {/* </ThemeProvider> */}
    </div>
  );
}
