import React from 'react'
import ClientRoleAwareComponent from './client/ClientRoleAwareComponent'
import { Route, Switch } from 'react-router-dom'
import ClientMenu from './menu/ClientMenu'
import StaffMenu from './menu/StaffMenu'
import ClientDashboard from './client/Dashboard'
import StaffDashboard from './staff/Dashboard'
import DocsAndFiles from './client/DocsAndFiles'
import ClientProfile from './client/Profile'
import StaffProfile from './staff/Profile'
import Promotions from './staff/Promotions'
import { firabaseDB } from './../../config/constants'

/**
 * Protected App component.
 */
class App extends ClientRoleAwareComponent  {

    /**
     * Component constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {signups: [], loading: true};
        this.profileDB = firabaseDB.child(`users/${this.getUser().uid}/profile`);
    }

    componentWillMount() {
        this.profileDB.on('value', snap => {
            const user = this.user;
            user.profile = snap.val();
            user.getIdToken(true).then( idToken => {
                user.idToken = idToken
                this.setUser(user);
                this.setState({loading: false })
            }).catch(error => {
                alert(error);
                this.setState({loading : false});
            });
        });
    }

    componentWillUnmount() {
        this.profileDB.off();
    }

    /**
     * Render method
     */
    render() {
        const jsx = (
            <div>
                {
                    this.isAdmin()
                    ? <StaffMenu user={() => this.user} />
                    : <ClientMenu user={() => this.user} />
                }
                <div className="container app-content">
                    <Switch>
                        <Route exact path="/" render={(props) => (
                            this.isAdmin()
                            ?  <StaffDashboard user={() => this.user} />
                            :  <ClientDashboard user={() => this.user} /> )}
                        />
                        <Route path="/docs-and-files" render={(props) => ( <DocsAndFiles user={() => this.user}/> )} />
                        <Route exact path="/promotions" render={(props) => ( <Promotions user={() => this.user}/> )} />
                        <Route path="/profile" render={(props) => (
                            this.isAdmin()
                            ?  <StaffProfile user={() => this.user}/>
                            :  <ClientProfile user={() => this.user}/> )}
                        />
                    </Switch>
                </div>
            </div>
        );

        return !this.state.loading && this.renderIfAuth(jsx);
    }
}

// export the component
export default App;
