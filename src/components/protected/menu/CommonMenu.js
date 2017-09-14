import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import { Link } from 'react-router-dom';
import { logout } from './../../../helpers/auth';

/**
 * StaffMenu component for staff Role.
 */
class StaffMenu extends CommonRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = { selectedItem : 1 };
    }

    handleLogout(){
        logout().catch(error => console.log(`Error ${error.code}: ${error.message}`))
    }

    handleChangeMenuItem = (i) => {
        this.setState({
            selectedItem: i,
        })
    }

    getSelectedItem = (i) =>{
        return i === this.state.selectedItem;
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div className="main-menu">
                <div className="container">
                    <div className="items">
                        <div className={this.getSelectedItem(1) ? "col-xs-1 seleted" : "col-xs-1"}>
                            <Link onClick={() => this.handleChangeMenuItem(1)} to="/">Dashboard</Link>
                            <hr />
                        </div>
                        <div className={this.getSelectedItem(2) ? "col-xs-2 seleted" : "col-xs-2"}>
                            <Link onClick={() => this.handleChangeMenuItem(2)}  to="/docs-and-files">Documents & Files</Link>
                            <hr />
                        </div>
                        <div className={this.getSelectedItem(3) ? "col-xs-1 seleted" : "col-xs-1"}>
                            <Link onClick={() => this.handleChangeMenuItem(3)} to="/promotions">Promotions</Link>
                            <hr />
                        </div>
                        <div className="col-xs-7 text-right" style={{marginTop:7}}>
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
export default StaffMenu;