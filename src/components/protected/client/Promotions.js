import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import RaisedButton from 'material-ui/RaisedButton';
import Promotion from './../Promotion';
import { firabaseDB, constants } from './../../../config/constants'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

/**
 * Promotions component for client Role.
 */
class Promotions extends ClientRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            promotions : [], 
            promotionVisible: false,
            loading: true,
        }
        this.promotionsDB = firabaseDB.child('promotions');
    }

    /**
     * Component life cycle
     */
    componentWillMount() {
        this.promotionsDB.on('child_added', snap => {
            this.setState({
                promotions: this.state.promotions.concat(snap.val()),
                loading: false
            })
        })
    }

    /**
     * Component life cycle
     */
    componentWillUnmount() {
        this.promotionsDB.off();
    }

    /**
     * Callback when promotion is success saved.
     */
    promotionSavedCallback = () => {
        this.setState({promotionVisible: false})
    }

    /**
     * Build the Publish, Delete, Award buttons
     */
    promotionActionsFormatter = (cell, row, enumObject, index) =>{
        return (
            <div className="text-left">
                <span>
                    <RaisedButton 
                        disabled={row.status === constants.promotionsStatus.publish} 
                        className="btn-smotion secondary"
                        label={row.status === constants.promotionsStatus.publish ? 'Published' : 'Publish'} secondary />
                </span>
                &nbsp;&nbsp;
                <span>
                    <RaisedButton 
                        disabled={row.status === constants.promotionsStatus.deleted} 
                        className="btn-smotion" 
                        label={row.status === constants.promotionsStatus.deleted ? 'Deleted' : 'Delete'} />
                </span>
                &nbsp;&nbsp;
                <span>
                    <RaisedButton 
                        disabled={row.status === constants.promotionsStatus.awarded} 
                        className="btn-smotion primary" 
                        label={row.status === constants.promotionsStatus.awarded ? 'Awarded' : 'Award'} primary />
                </span>
            </div>
        )
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>  
                {!this.state.promotionVisible &&   
                    <div className="text-right">
                        <div>
                            <RaisedButton className="btn-smotion primary" onClick={() => this.setState({promotionVisible : true}) } 
                                type="submit" 
                                label="Create New" />
                        </div>
                    </div>
                }

                {this.state.promotionVisible &&
                    <div>
                        <div className="text-right">
                            <span>
                                <RaisedButton className="btn-smotion" onClick={() => this.setState({promotionVisible : false}) } 
                                    label="Cancel" />
                            </span>
                            &nbsp;&nbsp;
                            <span>
                                <RaisedButton 
                                    className="btn-smotion secondary"
                                    onClick={() => this.refs.promotion.savePromotion() }
                                    label="Save Promotion" secondary />
                            </span>
                        </div>
                        
                        <div>
                            <br/><br/>
                            <Promotion editable={true} ref="promotion" onSuccess={this.promotionSavedCallback} value={{}} user={this.props.user} />
                        </div>
                    </div>
                }
                <div className="smotion-table">
                    <BootstrapTable data={ this.state.promotions } options={{hideSizePerPage: true}} bordered={ false }>
                        <TableHeaderColumn width="100" dataField='name' isKey dataSort>Name</TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField='name' dataSort>Game</TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField='startDate' dataSort>Starts</TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField='endDate' dataSort>Ends</TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField='status' dataSort>Status</TableHeaderColumn>
                        <TableHeaderColumn dataAlign="left" dataFormat={ this.promotionActionsFormatter } ></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Promotions;