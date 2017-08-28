import React  from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import { ref } from './../../../config/constants'

/**
 * Campaign component for client Role.
 */
class Campaign extends ClientRoleAwareComponent  {

    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {promotions: [], userPromotions: []};
    }


    componentDidMount(){
        let userRef = ref.child('promotions');
        userRef.on('child_added', snap => {
            this.setState({
                promotions: this.state.promotions.concat(snap.val())
            })
        })
        let usersPromoRef = ref.child('user').child('68ff71ae-7283-41f0-9a22-741b483e6930').child('promotions');
        usersPromoRef.on('child_added', snap => {
            this.setState({
                userPromotions: this.state.userPromotions.concat(snap.val())
            })
        })
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                <div className="promotion">
                    {this.state.promotions.map((promotion, key) =>
                        <div key={key} className="panel">
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="panel-header-image">
                                    <Paper style={{height: 65,width: 250,textAlign: 'center',display: 'inline-block',}} zDepth={1} />
                                    </div>
                                </div> 
                                <div className="col-xs-8">
                                    <div className="panel-header-label">
                                        {promotion.game}
                                    </div>
                                </div> 
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="promotion-steps">
                                        <Paper style={{height: 70,width: 70,margin: '0 40px 0 0',textAlign: 'center',display: 'inline-block'}} zDepth={1} circle={true} />
                                        <Paper style={{height: 70,width: 70,margin: '0 50px 0 40px',textAlign: 'center',display: 'inline-block'}} zDepth={2} circle={true} />
                                        <Paper style={{height: 70,width: 70,margin: '0 50px 0 40px',textAlign: 'center',display: 'inline-block'}} zDepth={3} circle={true} />
                                        <Paper style={{height: 70,width: 70,margin: '0 50px 0 40px',textAlign: 'center',display: 'inline-block'}} zDepth={4} circle={true} />
                                        <Paper style={{height: 70,width: 70,margin: '0 0 0 130px',textAlign: 'center',display: 'inline-block'}} zDepth={5} circle={true} />
                                    </div>
                                </div>  
                            </div>
                            <div className="row">
                                <div className="promotion-detail">
                                    <div className="col-xs-8">
                                        <span className="promotion-name">WonderWish Launch Campaign.</span>
                                        <div className="promotion-calendars">Starter 2 days Ago | Ends 05-12-2016</div>
                                    </div>
                                    <div className="col-xs-4">
                                    <div className="promotion-download-package">
                                        <Chip onClick={() => {alert('handleDownload')}} style={{margin: 4}}>
                                            Download Campaign Package
                                        </Chip>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="promotion-detail">
                                    <div className="col-xs-6">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                                    </div>
                                    <div className="col-xs-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                                    </div> 
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="promotion-status">
                                        <Chip style={{backgroundColor:'red', margin: '0 40px 0 0'}}>Pending</Chip>
                                        <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 150px'}}>Pending</Chip>
                                        <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 310px'}}>Pending</Chip>
                                        <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 470px'}}>Pending</Chip>
                                        <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 0 0 720px'}}>Pending</Chip>
                                    </div>
                                </div>  
                            </div>
                        </div>
                , this)}
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Campaign;