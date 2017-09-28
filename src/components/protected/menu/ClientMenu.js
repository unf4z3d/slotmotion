import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import CommonMenu from './CommonMenu';
import { Link, withRouter, Route } from 'react-router-dom';


/**
 * ClientMenu component for client Role.
 */
class ClientMenu extends CommonMenu  {
    
    /**
     * Overwrited
     */
    getSelectedItem = (i) =>{
        if(i === 1 && window.location.pathname === '/'){
            return true;
        }
        if(i === 2 && window.location.pathname === '/docs-and-files'){
            return true;
        }
        if(i === 3 && window.location.pathname === '/promotions'){
            return true;
        }
        return false;
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
                menuStyle={{backgroundColor: '#eaeeef', width: 130}}
                onRequestChange={this.handleOnRequestUserMenuChange} className="user-icon" iconButtonElement={<IconButton><NavigationArrowDropDown /></IconButton>}>
                <MenuItem className="user-menu-item" primaryText="Profile" onClick={() => { history.push('/profile') }} />
                <MenuItem className="user-menu-item" onClick={this.handleLogout} primaryText="Sign out" />
            </IconMenu>
        </div>


    /**
     * Render method 
     */
    render() {
        const jsx = (
            <Route render={({ history}) => (
                <div className="main-menu">
                    <div className="container">
                        <div className="items">
                            <div className={this.getSelectedItem(1) ? "col-xs-2 menu-item dashboard selected" : "col-xs-2 menu-item dashboard"}>
                                <Link onClick={() => this.handleChangeMenuItem(1)} to="/">Dashboard</Link>
                                <hr />
                            </div>
                            <div className={this.getSelectedItem(2) ? "col-xs-3 menu-item docs-files selected" : "col-xs-3 menu-item docs-files"}>
                                <Link onClick={() => this.handleChangeMenuItem(2)}  to="/docs-and-files">Documents & Files</Link>
                                <hr />
                            </div>
                            {this.renderUserMenu(history)}
                        </div>
                    </div>
                    <div className="container-fluid">
                        <hr/>
                    </div>
                    <br/>
                </div>
            )} />
            
        );

        return jsx;
    }
}
 
// export the component
export default ClientMenu;