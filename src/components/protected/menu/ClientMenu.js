import React from 'react';
import CommonMenu from './CommonMenu';
import { Link, Route } from 'react-router-dom';


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