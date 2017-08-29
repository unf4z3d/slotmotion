import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './../menu/MainMenu'
import Campaign from './Campaign'
import DocsAndFiles from './DocsAndFiles'
import Profile from './Profile'
import Promotions from './Promotions'

/**
 * Dashboard component for client Role.
 */
class Dashboard extends ClientRoleAwareComponent  {
    
    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                <MainMenu user={this.props.user} />
                <div className="container">
                    <Switch>
                        <Route exact path="/" render={(props) => ( <Promotions user={this.props.user} /> )} />
                        <Route path="/docs-and-files" render={(props) => ( <DocsAndFiles user={this.props.user}/> )} />
                        <Route exact path="/promotions" render={(props) => ( <Promotions user={this.props.user}/> )} />
                        <Route exact path="/profile" render={(props) => ( <Profile user={this.props.user}/> )} />
                    </Switch>
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Dashboard;