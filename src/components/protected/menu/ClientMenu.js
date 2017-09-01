import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import { Link } from 'react-router-dom';
import { logout } from './../../../helpers/auth';
import { Redirect } from 'react-router-dom';

/**
 * ClientMenu component for client Role.
 */
class ClientMenu extends CommonRoleAwareComponent  {
    
    handleLogout(){
        logout().catch(error => console.log(`Error ${error.code}: ${error.message}`))
        window.location.reload();
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
                            <Link to="/">Dashboard</Link>
                            <hr />
                        </div>
                        <div className="col-xs-2">
                            <Link to="/docs-and-files">Documents & Files</Link>
                            <hr />
                        </div>
                        <div className="col-xs-8 text-right" style={{marginTop:7}}>
                            <div className="header-user-name">
                                <span className="micro-icons user" />
                                &nbsp;&nbsp;
                                { this.props.user.profile.name }
                            </div>
                        </div>
                        <div className="col-xs-1 text-left">                            
                            <IconMenu iconButtonElement={<IconButton style={{padding:0, height:35}} ><MoreVertIcon /></IconButton>}>
                                <MenuItem containerElement={<Link to="/profile"></Link>} primaryText="Profile" />
                                <MenuItem onClick={this.handleLogout} primaryText="Sign out" />
                            </IconMenu>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <hr/>
                </div>
                <br/>
            </div>
        );

        return jsx;
    }
}
 
// export the component
export default ClientMenu;