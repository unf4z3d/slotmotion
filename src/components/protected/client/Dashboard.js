import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Chip from 'material-ui/Chip';

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
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div className="main-menu">
                <div className="container">
                    <div className="items">
                        <div className="col-xs-1 seleted">
                            <a href="#">
                                Dashboard
                            </a>
                            <hr />
                        </div>
                        <div className="col-xs-2">
                            <a href="#">
                                Documents & Files
                            </a>
                            <hr />
                        </div>
                        <div className="col-xs-1">
                            <a href="#">
                                Promotions
                            </a>
                            <hr />
                        </div>
                        <div className="col-xs-offset-7 col-xs-1">
                        <IconMenu
                            iconButtonElement={<IconButton style={{padding:0, height:35}} ><MoreVertIcon /></IconButton>}>
                            <MenuItem primaryText="Profile" />
                            <MenuItem primaryText="Sign out" />
                        </IconMenu>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <hr/>
                </div>
                <br/>
                <div className="container">
                    <div>
                        <div className="promotion">
                            <div className="panel">
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className="panel-header-image">
                                        <Paper style={{height: 65,width: 250,textAlign: 'center',display: 'inline-block',}} zDepth={1} />
                                        </div>
                                    </div> 
                                    <div className="col-xs-8">
                                        <div className="panel-header-label">
                                            Label
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
                        </div>
                    </div>
                </div>
            </div>
        );

        return this.rolesMatched() ? jsx : null;
    }
}
 
// export the component
export default Dashboard;