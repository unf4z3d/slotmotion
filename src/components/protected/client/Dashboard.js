import React  from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import Promotion from './../Promotion';
import Countdown from 'react-countdown-now';
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
        this.state = {promotions: [], userSignUp: [], loading: true};
        this.promotionsDB = firabaseDB.child('promotions');
        this.signupsDB = firabaseDB.child(`users/${this.props.user.uid}/signups`);
    }

    /**
     * Component Life Cycle
     */
    componentWillMount(){
        let {userSignUp} = this.state
        this.promotionsDB.on('child_added', snap => {
            this.setState({
                promotions: this.state.promotions.concat(snap.val()),
                loading: false,
            })
        })
        this.signupsDB.on('child_added', snap => {            
            userSignUp[snap.key] = snap.val()
            this.setState({
                userSignUp
            })
        })
    }

    /**
     * Component Life Cycle
     */
    componentWillUnmount() {
        this.promotionsDB.off();
        this.signupsDB.off();
    }

    /**
     * Is allowed to signup the campaign.
     */
    isSignUpAllowed = (campaing) => {
        return this.state.userSignUp[campaing.key] === undefined;
    }

    /**
     * Callback after signup (Campaign signup)
     */
    reloadCampaigns = () => {
        this.forceUpdate()
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                {this.state.promotions.map((promotion, key) =>
                    <Promotion 
                        editable={false} 
                        key={key} 
                        value={promotion} 
                        user={this.props.user}
                        signupCallback={this.reloadCampaigns}
                        signupAllowed={this.isSignUpAllowed(promotion)} />
                , this)}

                <Countdown date={Date.now() + 950400000} />
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Dashboard;