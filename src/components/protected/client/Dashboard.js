import React  from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import { Dialog }  from 'material-ui';
import ReactPlayer from 'react-player'
import Promotion from './../Promotion';
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
        this.state = {
            promotions: [], 
            userSignUp: [], 
            loading: true, 
            demoVisible: false,
            demoURL: null
        };
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
     * Show the demo dialog
     */
    showDemoDialog = demoURL => {
        this.setState({
            demoURL,
            demoVisible: true
        });
    }

    wasSignedUp = promotion => {
        return this.state.userSignUp[promotion.key] !== undefined;
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                {this.state.promotions.map((promotion, key) =>
                    <Promotion 
                        onWathDemo={this.showDemoDialog}
                        editable={false} 
                        key={key} 
                        value={promotion} 
                        user={this.props.user}
                        signedUp={this.wasSignedUp(promotion)}
                        signupCallback={this.reloadCampaigns}
                        signupAllowed={this.isSignUpAllowed(promotion)} />
                , this)}


                <Dialog
                        className="smotion-dialog"
                        modal
                        onRequestClose={() => this.setState({demoVisible : false})}
                        open={this.state.demoVisible}
                    >
                    <div className="row">
                            <div className="col-xs-12">
                                <div className="bg-gray">
                                    <div className="row header">
                                        <div className="col-xs-10 col-xs-offset-1">
                                            <h6>&nbsp;</h6>
                                        </div>
                                        <div className="col-xs-1">
                                            <a className="close" onClick={() => {this.setState({demoVisible: false})}}>X</a>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-12 demo-player">
                                            <ReactPlayer url={this.state.demoURL} playing={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </Dialog>


            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Dashboard;