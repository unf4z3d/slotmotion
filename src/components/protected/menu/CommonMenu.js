import React from 'react';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
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
        <div className="user-menu-client text-right" style={{height: 33}}>
            <div onClick={this.handleUserMenu} className="header-user-name">
                <span  className="micro-icons user" />
                &nbsp;&nbsp;
                { this.props.user.profile.name }
            </div>                        
            <IconMenu 
                onClick={this.handleUserMenu}
                open={this.state.openUserMenu}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                menuStyle={{backgroundColor: '#eaeeef', width: 130 }}
                onRequestChange={this.handleOnRequestUserMenuChange} className="user-menu user-icon" iconButtonElement={<IconButton><NavigationArrowDropDown /></IconButton>}>
                <MenuItem className="user-menu-item" primaryText="Profile" onClick={() => { history.push('/profile') }} />
                <MenuItem className="user-menu-item" onClick={this.handleLogout} primaryText="Sign out" />
            </IconMenu>
        </div>
}
 
// export the component
export default StaffMenu;