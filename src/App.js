import React, {Component} from 'react';
import Login from './components/Login';
import PasswordRecovery from './components/PasswordRecovery';
import ProtectedApp from './components/protected/App';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {firebaseAuth} from './config/constants'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {CircularProgress} from 'material-ui';

import './App.css';

class App extends Component {

    /**
     * Component constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    /**
     * Component did mount
     */
    componentWillMount() {
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            this.user = user;
            this.setState({loading: false});
        })
    }

    renderDashboardOrLogin = () => {
        if(!this.state.loading){
            if (this.user != null) {
                return <ProtectedApp user={() => this.user}/>
            } else {
                return <Switch>
                            <Route exact path="/" component={Login}/>
                            <Route path="/forgot-password" component={PasswordRecovery}/>
                            <Route render={() => <Redirect to={{pathname: '/'}}/>}/>
                    </Switch>
            }
        }else{
           return <div><CircularProgress /></div>
        }
    }

    /**
     * Component render
     */
    render() {
        return (
            <Router>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <div className="App">
                        <div className="App-header">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-2">
                                        <div className="logo header-logo"></div>
                                    </div>
                                    <div className="col-xs-10 no-padding">
                                        <div className="header-icons">
                                            <a rel="noopener noreferrer" target="_blank"
                                               href="https://www.facebook.com">
                                                <div className="facebook"></div>
                                            </a>
                                        </div>
                                        <div className="header-icons">
                                            <a rel="noopener noreferrer" target="_blank" href="https://www.twitter.com">
                                                <div className="twitter"></div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.renderDashboardOrLogin()}
                    </div>
                </MuiThemeProvider>
            </Router>
        );
    }
}

export default App;
