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
        console.log(this.props.user);
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
                        <TableHeaderColumn dataField='name' isKey dataSort>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='name' dataSort>Game</TableHeaderColumn>
                        <TableHeaderColumn dataField='startDate' dataSort>Starts</TableHeaderColumn>
                        <TableHeaderColumn dataField='endDate' dataSort>Ends</TableHeaderColumn>
                        <TableHeaderColumn dataField='status' dataSort>Status</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Promotions;