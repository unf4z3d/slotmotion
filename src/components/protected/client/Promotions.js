import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import RaisedButton from 'material-ui/RaisedButton';
import Promotion from './../Promotion';
import { firabaseDB } from './../../../config/constants'
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
            savingPromotion: false,
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
        this.showSuccessMessage('The promotion has been created');
    }

    handlePublishPromotion = (row) => {
        this.changePromotionsActivationTo(row, true);
    }

    handleDeletePromotion = (row) => {
        this.changePromotionsActivationTo(row, false);
    }

    changePromotionsActivationTo = (row, active) => {
        this.promotionsDB.child(row.key).update( { active }).then(() => {
            row.active = active;
            
            for(let i in this.state.promotions){
                if(this.state.promotions[i].key === row.key){
                    this.state.promotions[i] = row;
                    const { promotions } = this.state;
                    this.setState({promotions});
                    break;
                }
            }

            this.showSuccessMessage('The Promotion has been updated');
        });
    }

    /**
     * Build the Publish, Delete, Award buttons
     */
    promotionActionsFormatter = (cell, row, enumObject, index) =>{
        return (
            <div className="text-left">
                <span>
                    {
                        (row.active === undefined || row.active) &&
                        <RaisedButton 
                            disabled={row.active !== undefined} 
                            onClick={() => {this.handlePublishPromotion(row)}}
                            className="btn-smotion secondary"
                            label={row.active !== undefined ? 'Published' : 'Publish'} secondary />
                    }
                </span>
                &nbsp;&nbsp;
                <span>
                    <RaisedButton 
                        disabled={ row.active === false } 
                        onClick={() => {this.handleDeletePromotion(row)}}
                        className="btn-smotion" 
                        label={row.active === false ? 'Deleted' : 'Delete'} />
                </span>
            </div>
        )
    }

    handleSavePromotion = () => {
        const success = this.refs.promotion.savePromotion();
        this.setState({savingPromotion: success})
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
                                <RaisedButton 
                                    className="btn-smotion" 
                                    disabled={this.state.savingPromotion}
                                    onClick={() => this.setState({promotionVisible : false}) } 
                                    label="Cancel" />
                            </span>
                            &nbsp;&nbsp;
                            <span>
                                <RaisedButton 
                                    className="btn-smotion secondary"
                                    disabled={this.state.savingPromotion}
                                    onClick={this.handleSavePromotion}
                                    label={this.state.savingPromotion ? 'Saving Data' : 'Save Promotion' } secondary />
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