import App from './App';
import React from 'react';
import Admin from './views/Admin.js';
import Results from './views/Results.js';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SystemAssessment from './views/SystemAssessment.js';
import ViewSubmissions from './views/ViewSubmissions';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Exo 2', sans-serif",
  },
});

export default function Router() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={App} />
            <Route
              exact
              path="/SystemAssessment"
              component={SystemAssessment}
            />
            <Route path="/Results" component={Results} />
            <PrivateRoute path="/Admin" component={Admin} />
            <PrivateRoute path="/ViewSubmissions" component={ViewSubmissions} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}
