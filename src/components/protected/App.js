import React from 'react'
import ClientRoleAwareComponent from './client/ClientRoleAwareComponent'
import { Route, Switch } from 'react-router-dom'
import ClientMenu from './menu/ClientMenu'
import StaffMenu from './menu/StaffMenu'
import ClientDashboard from './client/Dashboard'
import StaffDashboard from './staff/Dashboard'
import DocsAndFiles from './client/DocsAndFiles'
import Profile from './client/Profile'
import Promotions from './client/Promotions'
import { firabaseDB } from './../../config/constants'
import { callGetCasinos } from './../../helpers/api'

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
        this.state = {user : this.props.user, signups: [], loading: true};
        this.profileDB = firabaseDB.child(`users/${this.props.user.uid}/profile`);
    }

    componentWillMount() {
        this.profileDB.on('value', snap => {
            const {user} = this.state;
            user.profile = snap.val();

            user.getIdToken(true).then( idToken => {
                user.idToken = idToken
                this.setState({ user })
                this.getCasinos();    
            }).catch(error => {
                this.setState({loading : false});
            });
        });
    }

    getCasinos = () => {
        const {user} = this.state;
        callGetCasinos(user)
        .then((response) => {
            let casinos = [];    
            for(let key in response.data){
                const userApi = response.data[key];
                if(userApi.id === user.profile.apiId){
                    casinos = userApi.casinos;
                }
            }
            user.casinos = casinos
            this.setState({
                loading : false,
                user
            });
        })
        .catch( (error) => {            
            this.setState({loading : false});
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
                    ? <StaffMenu user={this.state.user} />
                    : <ClientMenu user={this.state.user} />
                }
                <div className="container">
                    <Switch>
                        <Route exact path="/" render={(props) => ( 
                            this.isAdmin() 
                            ?  <StaffDashboard user={this.state.user} />
                            :  <ClientDashboard user={this.state.user} /> )} 
                        />
                        <Route path="/docs-and-files" render={(props) => ( <DocsAndFiles user={this.state.user}/> )} />
                        <Route exact path="/promotions" render={(props) => ( <Promotions user={this.state.user}/> )} />
                        <Route exact path="/profile" render={(props) => ( <Profile user={this.state.user}/> )} />
                    </Switch>
                </div>
            </div>
        );

        return !this.state.loading && this.renderIfAuth(jsx);
    }
}
 
// export the component
export default App;