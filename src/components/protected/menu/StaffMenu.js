import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import CommonMenu from './CommonMenu';
import { Link } from 'react-router-dom';

/**
 * StaffMenu component for staff Role.
 */
class StaffMenu extends CommonMenu  {


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

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div className="main-menu">
                <div className="container">
                    <div className="items">
                        <div className={this.getSelectedItem(1) ? "col-xs-2 dashboard selected" : "col-xs-2 dashboard"}>
                            <Link onClick={() => this.handleChangeMenuItem(1)} to="/">Dashboard</Link>
                            <hr />
                        </div>
                        <div className={this.getSelectedItem(2) ? "col-xs-3 docs-files selected" : "col-xs-3 docs-files"}>
                            <Link onClick={() => this.handleChangeMenuItem(2)}  to="/docs-and-files">Documents & Files</Link>
                            <hr />
                        </div>
                        <div className={this.getSelectedItem(3) ? "col-xs-2 promotions selected" : "col-xs-2 promotions"}>
                            <Link onClick={() => this.handleChangeMenuItem(3)} to="/promotions">Promotions</Link>
                            <hr />
                        </div>
                        <div className="col-xs-5 text-right user-menu-staff" style={{height: 33}}>
                            <div className="header-user-name">
                                <span className="micro-icons user" />
                                &nbsp;&nbsp;
                                { this.props.user.profile.name }
                            </div>                        
                            <IconMenu className="user-icon" iconButtonElement={<IconButton style={{padding:0, height:35}} ><NavigationArrowDropDown /></IconButton>}>
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