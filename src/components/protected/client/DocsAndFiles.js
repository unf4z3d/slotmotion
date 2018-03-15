import React from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Dialog, RaisedButton, TextField, Checkbox, MenuItem, IconButton } from 'material-ui';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { firabaseDB, firebaseStorage, constants } from './../../../config/constants'
import { formatBytes } from './../../../helpers'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dateFormat from 'dateformat'

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
            file: {},
            docs : [],
            docsType: [],
            docsCategory: [],
            docsLanguage: [],
            docsDialogVisible : false,
            loading: true,
        }

        this.docsDB = firabaseDB.child('documents');
        this.docsTypeDB = firabaseDB.child('docs_types');
        this.docsCategoryDB = firabaseDB.child('docs_category');
        this.docsLanguageDB = firabaseDB.child('docs_language');
    }

    /**
     * Component life cycle
     */
    componentWillMount() {

        this.quitLoading();

        this.docsTypeDB.once('value').then((snap => {
            this.setState({docsType: snap.val()});
        }))

        this.docsCategoryDB.once('value').then((snap => {
            this.setState({docsCategory: snap.val()});
        }))

        this.docsLanguageDB.once('value').then((snap => {
            this.setState({docsLanguage: snap.val()});
        }))

        this.docsDB.on('child_added', snap => {
            this.setState({
                docs: this.state.docs.concat(snap.val()),
                loading: false,
            })
        })
    }

    /**
     * Component life cycle
     */
    componentWillUnmount() {
        this.docsDB.off();
        this.docsTypeDB.off();
        this.docsCategoryDB.off();
        this.docsLanguageDB.off();
    }

    /**
     * Set the File to upload.
     */
    chooseFile = e => {
        const { file } = this.state;

        file.value = e.target.files[0];
        file.originName = file.value.name;
        file.size = file.value.size;
        file.type = file.value.type;
        file.createdAt =
        this.setState({file});
    }

    /**
     * On change in docType.
     */
    handleSetDocType = (event, index, value) => {
        const { file } = this.state;
        file.docType = value;
        this.setState({ file });
    };

    /**
     * On change in docCategory.
     */
    handleSetDocCategory = (event, index, value) => {
        const { file } = this.state;
        file.docCategory = value;
        this.setState({ file });
    };

    /**
     * Set the file value on each input.
     */
    handleChangeInput = e => {
        const { file } = this.state;
        file[e.target.name] = e.target.value;
        this.setState({ file });
    }

    handleToggleLanguage =(value, isInputChecked) => {
        const { file } = this.state;

        if(file.language === undefined){
            file.language = [];
        }

        if(isInputChecked){
            file.language.push(value);
        }else{
            const index = file.language.indexOf(value);
            if (index >= 0) {
                file.language.splice( index, 1 );
            }
        }
    }


    /**
     * Upload new Docs & File
     */
    handleUploadNewFile = () => {
        const { file } = this.state;
        const now = new Date();

        if(file.key === undefined){
            file.key = firabaseDB.child('documents').push().key;
        }

        file.createdAtTime = now.getTime();
        file.createdAt = dateFormat(now, constants.formatDate)
        file.name = file.name.toLowerCase();

        this.uploadFile();
    }

    /**
     * Upload the file to firebase
     */
    uploadFile = () => {
        const { file } = this.state;

        var metadata = {
            contentType: file.type,
        };

        firebaseStorage().ref().child("documents").child(file.key).child(file.originName, )
            .put(file.value, metadata).then((snap) => {
                file.downloadURL = snap.downloadURL;
                this.putFileData();
        })
    }

    /**
     * Put the file data to firebase.
     */
    putFileData = () => {
        const { file } = this.state;
        console.log(file);

        firabaseDB.child('documents').child(file.key).set(file).then((snap) => {
            this.showSuccessMessage("The File has been uploaded");
            this.handleCloseDialog();
        })
    }

    /**
     * Close the dialog
     */
    handleCloseDialog = () => this.setState({docsDialogVisible : false, file: {}})

    /**
     * Formatter for the Name row
     * @param {*} cell
     * @param {*} row
     * @param {*} enumObject
     */
    docFormatter(cell, row){
        let className = "";
        switch (row.docType) {
            case 0:
                className = "icon-promo-pack";
                break;
            case 1:
                className = "icon-video";
                break;
            case 2:
                className = "icon-game-sheet";
                break;
            default:
                break;
        }
        return <div className={className} />
    }

    /**
     * Formatter for the Type and Category rows
     * @param {*} cell
     * @param {*} row
     * @param {*} enumObject
     */
    descriptionFormatter(cell, row, enumObject){
        if(enumObject[cell] !== undefined){
            return enumObject[cell].description;
        }

        return
    }

    /**
     * Formatter for the Language row
     * @param {*} cell
     * @param {*} row
     */
    languageFormatter = (cell, row) =>{
        if(cell !== undefined){
            let value = '';
            cell.map((val, i) => {
                value += val;
                if(i !== cell.length - 1){
                    value += ' - ';
                }
                return value;
            });
            return value;
        }
        return '';
    }

    /**
     * Formatter for the Size row
     * @param {*} cell
     * @param {*} row
     */
    sizeFormatter(cell, row){
        if(cell !== undefined){
            return formatBytes(cell);
        }

        return;
    }

    /**
     * Download document formatter
     * @param {*} cell
     * @param {*} row
     */
    downloadFormatter = (cell, row) => {
        return (
            <IconButton className="app-ico" target="_blank" href={row.downloadURL}>
                <div className="icon-download" />
            </IconButton>
        );
    }

    handleFilterByName = () => {
        this.docsDB.off();
        this.setState({
            docs: []
        })

        const value = this.refs.nameFilter.input.value.toLowerCase();

        this.docsDB.orderByChild('name').startAt(value).endAt(`${value}\uf8ff`).on('child_added', snap => {
            this.setState({
                docs: this.state.docs.concat(snap.val()),
                loading: false,
            })
        })
    }

    /**
     * Render method
     */
    render() {
        const jsx = (
            <div>
                <div className="row">
                    <div className="col-4">
                        <div className="text-left">
                            <div className="dark-input input-icon">
                                <ActionSearch viewBox="7 -7 6 40" onClick={this.handleFilterByName} />
                                <TextField ref="nameFilter" hintText="search by name" />
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="text-right">
                            <div>
                                { this.isAdmin() &&
                                    <RaisedButton className="btn-smotion primary btn-large" label="Upload New" onClick={() => {this.setState({docsDialogVisible: true})}} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <br/><br/>
                <div className="smotion-table selection docs-table">
                    <BootstrapTable data={ this.state.docs }  options={{hideSizePerPage: true}} pagination bordered={ false } selectRow={{mode: 'checkbox'}} >
                        <TableHeaderColumn width="30" dataField='name' dataFormat={ this.docFormatter } ></TableHeaderColumn>
                        <TableHeaderColumn width="180" dataField='name' isKey dataSort>Name</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField='docType' dataFormat={ this.descriptionFormatter } formatExtraData={ this.state.docsType } dataSort>Type</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField='docCategory' dataFormat={ this.descriptionFormatter } formatExtraData={ this.state.docsCategory }dataSort>Category</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField='language' dataFormat={ this.languageFormatter } dataSort>Language</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField='createdAt' dataSort>Modified</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField='size' dataFormat={ this.sizeFormatter } dataSort>Size</TableHeaderColumn>
                        <TableHeaderColumn width="50" dataFormat={ this.downloadFormatter }></TableHeaderColumn>
                    </BootstrapTable>
                </div>

                <Dialog className="smotion-dialog"
                        modal
                        onRequestClose={this.handleCloseDialog}
                        open={this.state.docsDialogVisible}>
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-gray">
                                <div className="row header">
                                    <div className="col-10 offset-1">
                                        <h6>&nbsp;</h6>
                                    </div>
                                    <div className="col-1">
                                        <a className="close" onClick={this.handleCloseDialog}>X</a>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-10 offset-1">
                                        <ValidatorForm ref="form" onSubmit={this.handleUploadNewFile}>
                                            <div className="white-form">

                                                <div className="row">
                                                    <div className="col-9">
                                                        <TextValidator floatingLabelFixed floatingLabelText="Browse File" fullWidth
                                                            name="activeImgName"
                                                            value={this.state.file.originName}
                                                            disabled={true}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                    </div>
                                                    <div className="col-3 column-choose-file">
                                                        <RaisedButton
                                                            className="btn-smotion secondary file-min"
                                                            containerElement='label'
                                                            label='Choose File'>
                                                                <input onChange={this.chooseFile} style={{display:'none'}} type="file" />
                                                        </RaisedButton>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <TextValidator floatingLabelFixed floatingLabelText="Name" fullWidth
                                                            name="name"
                                                            onChange={this.handleChangeInput}
                                                            value={this.state.file.name}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <SelectValidator floatingLabelFixed floatingLabelText="Type" fullWidth
                                                            className="select-form"
                                                            name="type"
                                                            onChange={this.handleSetDocType}
                                                            value={this.state.file.docType}
                                                            maxHeight={200}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        >

                                                            {this.state.docsType.map((docType, i) =>
                                                                <MenuItem key={i} value={i} primaryText={docType.description} />
                                                            , this)}

                                                        </SelectValidator>
                                                    </div>
                                                    <div className="col-6">
                                                        <SelectValidator floatingLabelFixed floatingLabelText="Category" fullWidth
                                                            className="select-form"
                                                            name="category"
                                                            onChange={this.handleSetDocCategory}
                                                            value={this.state.file.docCategory}
                                                            maxHeight={200}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        >

                                                            {this.state.docsCategory.map((docCategory, i) =>
                                                                <MenuItem key={i} value={i} primaryText={docCategory.description} />
                                                            , this)}

                                                        </SelectValidator>
                                                    </div>
                                                    <div className="col-6">
                                                        <label className="form-label">Category</label>
                                                        <div>
                                                            <div className="row form-switches-inline">
                                                            {this.state.docsLanguage.map((docLanguage, i) =>
                                                                <div key={i} className="col-3">
                                                                    <Checkbox onCheck={(o, checked) => this.handleToggleLanguage(docLanguage.short, checked)} valueLink={this.state.file.languages} label={docLanguage.short} />
                                                                </div>
                                                            , this)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-4 offset-4">
                                                        <RaisedButton className="btn-smotion primary btn-submit" type="submit" label="Upload File" primary={true} />
                                                    </div>
                                                </div>
                                            </div>
                                        </ValidatorForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>

            </div>
        );

        return this.renderIfAuth(jsx);
    }
}

// export the component
export default DocsAndFiles;
