import React from 'react';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import MenuItem from 'material-ui/MenuItem';
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
        this.state = { selectedItem : 1, openUserMenu : false};
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

    handleUserMenu = () => {
        this.setState({
            openUserMenu: true,
        });
    }

    handleOnRequestUserMenuChange = (value) => {
        this.setState({
            openUserMenu: false,
        });
    }

    renderUserMenu = (history) =>
        <div>
            <span className="header-user-name app-dropdown">
                <span className="micro-icons user" />
                { this.getUser().profile.name }
                <span className="caret"></span>
                <div className="app-dropdown-content user-dropdown-menu">
                    <MenuItem className="user-menu-item" primaryText="Profile" onClick={() => { history.push('/profile') }} />
                    <MenuItem className="user-menu-item" onClick={this.handleLogout} primaryText="Sign out" />
                </div>
            </span>
        </div>
}
 
// export the component
export default StaffMenu;