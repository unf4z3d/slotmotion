import React from 'react';
import { RaisedButton }  from 'material-ui';
import StaffRoleAwareComponent from './StaffRoleAwareComponent';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { firabaseDB } from './../../../config/constants'

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

/**
 * Dashboard component for staff Role.
 */
class Dashboard extends StaffRoleAwareComponent {

    /**
     * Component constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {usersSignUp: [], cache:{users: [], promotions: []}, loading: true};
        this.signupsDB = firabaseDB.child('signups');
    }

    /**
     * Component Life Cycle
     */
    componentWillMount(){

        this.signupsDB.on('child_added', snap => {
            const signup = snap.val();
            this.setState({
                usersSignUp: this.state.usersSignUp.concat(signup)
            })

            firabaseDB.child('users').child(signup.user).once('value').then((snap => {
                let {cache} = this.state;
                cache.users[signup.user] = snap.val();
                this.setState({cache});
            }))

            firabaseDB.child('promotions').child(signup.promotion).once('value').then((snap => {
                let {cache} = this.state;
                cache.promotions[signup.promotion] = snap.val();
                this.setState({cache, loading: false});
            }))

        })
    }

    /**
     * Component Life Cycle
     */
    componentWillUnmount() {
        this.signupsDB.off();
    }

    /**
     * Get the user data.
     */
    userFormatter = (cell, row) =>{
        if(this.state.cache.users[cell] !== undefined){
            return this.state.cache.users[cell].profile.name;
        }
    }


    /**
     * Get the promotion data.
     */
    promotionFormatter = (cell, row, attr) =>{
        if(this.state.cache.promotions[cell] !== undefined){
            return this.state.cache.promotions[cell][attr];
        }
    }

    /**
     * Build the Decline and Accept buttons
     */
    signUpActionsFormatter = (cell, row) =>{
        return (
            <div className="text-right">
                <span>
                    <RaisedButton className="btn-smotion" label="Decline" />
                </span>
                &nbsp;&nbsp;
                <span>
                    <RaisedButton className="btn-smotion primary" label="Accept" primary />
                </span>
            </div>
        )
    }


    /**
     * Render method
     */
    render = () => {
        const jsx = (
            <div>
                <div className="row text-left">
                    <h4>Sign Up Requests</h4>
                    <div className="col-xs-12">
                        <div className="smotion-table">
                            <BootstrapTable data={ this.state.usersSignUp }  options={{hideSizePerPage: true}} bordered={ false }>
                                <TableHeaderColumn dataAlign="center" dataField='user' isKey dataFormat={ this.userFormatter } >Client</TableHeaderColumn>
                                <TableHeaderColumn dataAlign="center" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Game</TableHeaderColumn>
                                <TableHeaderColumn dataAlign="center" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Campaign</TableHeaderColumn>
                                <TableHeaderColumn dataAlign="center" width={100} dataField='createdAt'>Requested</TableHeaderColumn>
                                <TableHeaderColumn dataAlign="center" dataFormat={ this.signUpActionsFormatter } ></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
                <br/><br/>
                <div className="row text-left">
                    <h4>Active Campaigns</h4>
                    <div className="col-xs-10">
                        <div className="smotion-table">
                            <BootstrapTable data={ this.state.usersSignUp }  options={{hideSizePerPage: true}} bordered={ false }>
                                <TableHeaderColumn dataField='user' isKey dataFormat={ this.userFormatter }>Client</TableHeaderColumn>
                                <TableHeaderColumn dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Game</TableHeaderColumn>
                                <TableHeaderColumn dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Campaign</TableHeaderColumn>
                                <TableHeaderColumn dataField='createdAt'>Signed Up</TableHeaderColumn>
                                <TableHeaderColumn dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'endDate') } >Ends</TableHeaderColumn>
                                <TableHeaderColumn dataField='levels'>Levels Claimed</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
            </div>
        );
        
        return this.renderIfAuth(jsx);
    }
}

// export the component
export default Dashboard;