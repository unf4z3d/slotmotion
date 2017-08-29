import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

/**
 * DocsAndFiles component for client Role.
 */
class DocsAndFiles extends ClientRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            products : [{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            },{
                id: 1,
                name: "Product1",
                price: 120
            }, {
                id: 2,
                name: "Product2",
                price: 80
            }]
        }
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>     
                <div className="text-left">
                    <div style={{position: 'relative', display: 'inline-block'}}>
                        <ActionSearch style={{position: 'absolute', right: 0, top: 15, width: 20, height: 20}}/>
                        <TextField hintText="Search by Name" />
                    </div>
                </div>

                <div className="smotion-table selection">
                    <BootstrapTable data={ this.state.products } options={{hideSizePerPage: true}} pagination bordered={ false } selectRow={{mode: 'checkbox'}}>
                        <TableHeaderColumn dataField='name' isKey dataSort>Product Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='price' dataSort>Product Price</TableHeaderColumn>
                        <TableHeaderColumn dataField='category' dataSort>Category</TableHeaderColumn>
                        <TableHeaderColumn dataField='language' dataSort>Language</TableHeaderColumn>
                        <TableHeaderColumn dataField='modified' dataSort>Modified</TableHeaderColumn>
                        <TableHeaderColumn dataField='size' dataSort>Size</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default DocsAndFiles;