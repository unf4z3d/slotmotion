import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './../menu/MainMenu'
import Campaign from './Campaign'
import DocsAndFiles from './DocsAndFiles'
import Profile from './Profile'
import Promotions from './Promotions'
import { firabaseDB } from './../../../config/constants'

/**
 * Dashboard component for client Role.
 */
class Dashboard extends ClientRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {user : this.props.user, signups: []};
        this.profileDB = firabaseDB.child(`users/${this.props.user.uid}/profile`);
    }

    componentWillMount() {
        this.profileDB.on('value', snap => {
            const {user} = this.state;
            user.profile = snap.val();
            this.setState({ user })
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
                <MainMenu user={this.props.user} />
                <div className="container">
                    <Switch>
                        <Route exact path="/" render={(props) => ( <Campaign user={this.state.user} /> )} />
                        <Route path="/docs-and-files" render={(props) => ( <DocsAndFiles user={this.state.user}/> )} />
                        <Route exact path="/promotions" render={(props) => ( <Promotions user={this.state.user}/> )} />
                        <Route exact path="/profile" render={(props) => ( <Profile user={this.state.user}/> )} />
                    </Switch>
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Dashboard;