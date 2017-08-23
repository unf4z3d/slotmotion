import React, { Component } from 'react';
import Login from './components/Login';
import ClientDashBoard from './components/protected/client/Dashboard';
import StaffDashBoard from './components/protected/staff/Dashboard';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { firebaseAuth } from './config/constants'

import './App.css';

class App extends Component {

  /**
    * Component constructor
    * @param {*} props 
    */
    constructor(props) {
      super(props);
      this.state = {authed: false, loading: true};
  }

  /**
   * Component did mount
   */
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  /**
   * Component will unmount
   */
  componentWillUnmount () {
    this.removeListener()
  }

  /**
   * Component render
   */
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
        
        
        {this.state.authed
        ? 
          <div>
            <ClientDashBoard />
            
          </div>
        : 
          <Login />
        }

        </div>
      
      </MuiThemeProvider>
    );
  }
}

export default App;
