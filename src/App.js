import React, { Component } from 'react';
import Login from './components/Login';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="App">
        <div className="App-header">
          <div className="container">
            <div className="row">
              <div className="col-xs-2">
                <div className="logo header-logo"></div>
              </div>
              <div className="col-xs-10">
                <div className="header-icons">
                  <a href="#">
                    <div className="twitter"></div>
                  </a>
                  <a href="#">
                    <div className="facebook"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="container">
          <Login />
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
