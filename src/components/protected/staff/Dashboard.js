import React from 'react';
import { RaisedButton }  from 'material-ui';
import StaffRoleAwareComponent from './StaffRoleAwareComponent';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { firabaseDB, constants } from './../../../config/constants'

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
        this.state = {usersSignUp: [], activeUsersSignUp: [], cache:{users: [], promotions: []}, loading: true};
        this.signupsDB = firabaseDB.child('signups');
        this.usersDB = firabaseDB.child('users');
    }

    /**
     * Component Life Cycle
     */
    componentWillMount(){
        this.signupsDB.on('child_added', snap => this.signupsDBCallback(snap, true));
        this.signupsDB.on('child_changed', snap => this.signupsDBCallback(snap, false));
        this.setState({loading: false});
    }

    signupsDBCallback = (snap, concat) =>{
        let signup = snap.val();
        signup.key = snap.key;

        let {usersSignUp, activeUsersSignUp} = this.state;

        if (signup.status === constants.promotionsStatus.pending 
            || signup.status === constants.promotionsStatus.declined){
            if(concat){
                usersSignUp = usersSignUp.concat(signup);
            }else{
                for(let i in usersSignUp){
                    if(usersSignUp[i].key === snap.key){
                        usersSignUp[i] = snap.val();
                        break;
                    }
                }
            }
        }

        if (signup.status === constants.promotionsStatus.active){
            activeUsersSignUp = activeUsersSignUp.concat(signup);
        }
        
        if (signup.status === constants.promotionsStatus.forfeited){
            if(concat){
                activeUsersSignUp = activeUsersSignUp.concat(signup);
            }else{
                for(let i in activeUsersSignUp){
                    if(activeUsersSignUp[i].key === snap.key){
                        activeUsersSignUp[i] = snap.val();
                        break;
                    }
                }
            }
        }

        this.setState({usersSignUp, activeUsersSignUp});

        firabaseDB.child('users').child(signup.user).once('value').then((snap => {
            let {cache} = this.state;
            cache.users[signup.user] = snap.val();
            this.setState({cache});
        }))

        firabaseDB.child('promotions').child(signup.promotion).once('value').then((snap => {
            let {cache} = this.state;
            cache.promotions[signup.promotion] = snap.val();
            this.setState({cache});
        })) 
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
        if(this.state.cache.promotions[cell]){
            return this.state.cache.promotions[cell][attr];
        }
    }

    /**
     * Build the Decline and Accept buttons
     */
    signUpActionsFormatter = (cell, row, enumObject, index) =>{
        return (
            <div className="text-left">
                <span>
                    <RaisedButton 
                        disabled={row.status === constants.promotionsStatus.declined} 
                        onClick={() => this.handleChangeStatusSignUp(row, constants.promotionsStatus.declined, index)} 
                        className="btn-smotion btn-min" 
                        label={row.status === constants.promotionsStatus.declined ? 'Declained' : 'Decline'} />
                </span>
                &nbsp;&nbsp;
                <span>
                    <RaisedButton 
                        disabled={row.status === constants.promotionsStatus.declined} 
                        onClick={() => this.handleChangeStatusSignUp(row, constants.promotionsStatus.active,index)} 
                        className="btn-smotion primary btn-min" 
                        label="Accept" primary />
                </span>
            </div>
        )
    }

    /**
     * Build the Decline and Accept buttons
     */
    activeSignUpActionsFormatter = (cell, row, enumObject, index) =>{
        return (
            <div className="text-left">
                <span>
                    <RaisedButton 
                    disabled={row.status === constants.promotionsStatus.forfeited} 
                    onClick={() => this.handleChangeStatusSignUp(row, constants.promotionsStatus.forfeited, index)}
                    className="btn-smotion secondary btn-min" label={row.status === constants.promotionsStatus.forfeited ? 'Forfeited' : 'Forfeit'} secondary />
                </span>
            </div>
        )
    }

    /**
     * Accept the signsup
     */
    handleChangeStatusSignUp = (signup, status, index) => {
        signup.status = status;

        if(status === constants.promotionsStatus.active){
            const { usersSignUp } = this.state;
            delete usersSignUp[index];
            this.setState({usersSignUp});
        }

        firabaseDB.child('signups').child(signup.key).update(signup)
        .then(() => {
            this.usersDB.child(signup.user)
                        .child('signups')
                        .child(signup.promotion)
                        .update({status: signup.status}).then(() =>{
                this.showSuccessMessage("The Signup has been updated.");
            });
        })
        .catch((error) => {
            console.log(`Error ${error.code}: ${error.message}`);
            this.showErrorMessage();
        })
    }

    /**
     * Render method
     */
    render = () => {
        const jsx = (
            <div>
                <div className="row">
                    <div className="signups text-left">
                        <h4>Sign up requests</h4>
                        <div className="col-xs-9">
                            <div className="smotion-table signups-table">
                                <BootstrapTable data={ this.state.usersSignUp }  options={{hideSizePerPage: true}} bordered={ false }>
                                    <TableHeaderColumn dataAlign="center" width="120" dataField='user' isKey dataFormat={ this.userFormatter } >Client</TableHeaderColumn>
                                    <TableHeaderColumn dataAlign="center" width="80" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Game</TableHeaderColumn>
                                    <TableHeaderColumn dataAlign="center" width="80" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Campaign</TableHeaderColumn>
                                    <TableHeaderColumn dataAlign="center" width="80" dataField='createdAt'>Requested</TableHeaderColumn>
                                    <TableHeaderColumn dataAlign="center" width="180" dataFormat={ this.signUpActionsFormatter } ></TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="active-campigns">
                        <div className="campaigns text-left">
                            <h4>Active Campaigns</h4>
                            <div className="col-xs-11">
                                <div className="smotion-table campaigns-table">
                                    <BootstrapTable data={ this.state.activeUsersSignUp }  options={{hideSizePerPage: true}} bordered={ false }>
                                        <TableHeaderColumn width="80" dataField='user' isKey dataFormat={ this.userFormatter }>Client</TableHeaderColumn>
                                        <TableHeaderColumn width="60" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Game</TableHeaderColumn>
                                        <TableHeaderColumn width="60" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'name') } >Campaign</TableHeaderColumn>
                                        <TableHeaderColumn width="80" dataField='createdAt'>Signed Up</TableHeaderColumn>
                                        <TableHeaderColumn width="80" dataField='promotion' dataFormat={ (c,r) => this.promotionFormatter(c,r,'endDate') } >Ends</TableHeaderColumn>
                                        <TableHeaderColumn width="80" dataField='levels'>Levels Claimed</TableHeaderColumn>
                                        <TableHeaderColumn width="70" dataAlign="center" dataFormat={ this.activeSignUpActionsFormatter } ></TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                            </div>
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