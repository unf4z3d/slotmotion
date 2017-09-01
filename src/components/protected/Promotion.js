import React  from 'react';
import {Paper, Chip, Dialog, RaisedButton, FlatButton, DatePicker}  from 'material-ui';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import CommonRoleAwareComponent from './../commons/CommonRoleAwareComponent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { firabaseDB, constants, firebaseStorage } from './../../config/constants';
import dateFormat from 'dateformat'

/**
 * Promotion component for client Role.
 */
class Promotion extends CommonRoleAwareComponent  {

    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        if(props.value.levels === undefined){
            props.value.levels = [{},{},{},{},{}];
        }

        this.state = {
            promotion: props.value, 
            openLevelDialog: false, 
            selectedLevelIndex:null, 
            selectedLevel:{},
            editable : this.props.ediatble ? true : false,
        };
    }

    /**
     * If the promotion is editable
     */
    isEditable = () =>{
        return this.state.editable && this.isAdmin();
    }

    /**
     * Set and Preview the Active image in the selected level.
     */
    chooseActiveLevelImage = e => {
        const { selectedLevel } = this.state;
        selectedLevel.activeImage = e.target.files[0];
        selectedLevel.activeImageName = selectedLevel.activeImage.name;
        const reader = new FileReader();
        this.setState({selectedLevel});

        reader.onload = e => {            
            selectedLevel.previewImage = `url(${e.target.result})`;
            this.setState({selectedLevel : this.state.selectedLevel});
        }

        reader.readAsDataURL(selectedLevel.activeImage);
    }

    /**
     * Set the Inactive image in the selected level.
     */
    chooseInactiveLevelImage = e => {
        const { selectedLevel } = this.state;
        selectedLevel.inactiveImage = e.target.files[0];
        selectedLevel.inactiveImageName = selectedLevel.inactiveImage.name;
        this.setState({selectedLevel});
    }

    /**
     * Get the level image by the index.
     */
    getImageLevel = index => {
        return this.state.promotion.levels[index].previewImage !== undefined 
               ? this.state.promotion.levels[index].previewImage : 
               '' 
    }

    /**
     * Set the promotion value on each attr.
     */
    handleChange = e => {
        const { promotion } = this.state;
        promotion[e.target.name] = e.target.value;
        this.setState({ promotion });
    }

    /**
     * Set the value level on each attr.
     */
    handleChangeLevel = e => {
        const { selectedLevel } = this.state;
        selectedLevel[e.target.name] = e.target.value;
        this.setState({ selectedLevel });
    }

    /**
     * Set Level info
     */
    handleApplyLevelInfo = e => {
        e.preventDefault()
        const { promotion } = this.state;
        promotion.levels[this.state.selectedLevelIndex] = this.state.selectedLevel;
        this.setState({promotion, openLevelDialog: false});
    }

    /**
     * Show the Dialog for update the Promotion Info
     */
    showDialog = index => {
        const { promotion } = this.state;
        const selectedLevel = promotion.levels[index];
        this.setState({openLevelDialog : true, selectedLevelIndex: index, selectedLevel});
    } 

    /**
     * Set the promotion start date 
     */
    setStartDate = (e, date) => {
        const { promotion } = this.state;
        promotion.startDate = dateFormat(date, constants.formatDate);
        promotion.startDateTime = date.getTime();
        this.setState({promotion});
    }

    /**
     * Set the promotion ends date 
     */
    setEndDate = (e, date) => {
        const { promotion } = this.state;
        promotion.endDate = dateFormat(date, constants.formatDate);
        promotion.endDateTime = date.getTime();
        this.setState({promotion});
    }

    /**
     * Set and Preview the Promotion logo picture
     */
    chooseLogoPicture = e => {
        const { promotion } = this.state;
        promotion.logoPicture = e.target.files[0];
        promotion.logoPictureName = promotion.logoPicture.name;
        this.setState({promotion});

        const reader = new FileReader();

        reader.onload = e => {           
            promotion.logoPreviewImage = `url(${e.target.result})`;
            this.setState({promotion});
        }

        reader.readAsDataURL(promotion.logoPicture);
    }

    /**
     * Initi the promotion save proccess.
     */
    savePromotion = () => {
        const { promotion } = this.state;

        if(promotion.key === undefined){
            promotion.key = firabaseDB.child('promotions').push().key;
        }
        
        this.setState({promotion});

        //this.initUploadFiles();
        this.putPromotionData();
    }

    /**
     * Init the upload files.
     */
    initUploadFiles = () => {
        this.uploadLogoPicture();
    }

    /**
     * Upload the logo picture and callback the upload of level images
     */
    uploadLogoPicture = () => {
        const { promotion } = this.state;
        firebaseStorage().ref().child("promotions").child(promotion.key).child("logoPicture")
            .put(promotion.logoPicture).then((snap) => {
            
            promotion.logoPreviewImage = snap.downloadURL;
            this.setState({promotion});
            this.uploadLevelsActiveImages();
        })
    }

    /**
     * Init the upload of the each active images
     */
    uploadLevelsActiveImages = () => {
        const { promotion } = this.state;
        this.uploadLevelImage(promotion, 0, 'activeImage', this.uploadLevelsInactiveImages);
    }

    /**
     * Init the upload of the each inactive images
     */
    uploadLevelsInactiveImages = () => {
        const { promotion } = this.state;
        this.uploadLevelImage(promotion, 0, 'inactiveImage', this.putDataPromotion);
    }

    /**
     * Upload inactive or active images
     */
    uploadLevelImage = (promotion, i, type, callback) => {
        if(promotion.levels[i] !== undefined && promotion.levels[i][type] !== undefined){
            const level = promotion.levels[i];
            firebaseStorage().ref().child("promotions").child(promotion.key).child(`level${i + 1}_${type}`)
                .put(level[type]).then((snap) => {
                    promotion.levels[i][type].previewImage = snap.downloadURL;
                    this.setState({promotion})
                    this.uploadLevelImage(promotion, i + 1, type, callback);
            });
        }else{
            callback();
        }
    }

    /**
     * Push the promotion data to firebase.
     * Run onSuccess prop if was setted.
     */ 
    putPromotionData = () => {
        const { promotion } = this.state;
        console.log(promotion);

        firabaseDB.child('promotions').child(promotion.key).set(promotion).then((snap) => {
            if(this.props.onSuccess !== undefined){
                this.props.onSuccess();
            }else{
                alert('Success');
            }
        })
    }

    /**
     * Is allowed to signup this campaign o promotion.
     */
    isSingupAllowed = () =>{
        return this.props.signupAllowed !== undefined && this.props.signupAllowed;
    }

    /**
     * User signup in the campaign.
     */
    signUpCampaign = () =>{
        this.saveUserSignup();
    }

    /**
     * Save the campaign in the current user.
     */
    saveUserSignup(){
        const {promotion} = this.state;
        const now = new Date();
        const userSignup = {
            status : 0,
            createdAtTime : now.getTime(),
            createdAt : dateFormat(now, constants.formatDate),
        }

        firabaseDB.child('users').child(this.props.user.uid).child('signups')
                  .child(promotion.key).set(userSignup)
                  .then((snap) => 
        {
            alert('Success');
            if(this.props.signupCallback !== undefined){
                this.props.signupCallback();
            }
        })
    }

    /**
     * Save the user-campaign relation.
     */
    saveCampaignSignup(){
        /*firabaseDB.child('users').child(this.props.user.id).child().set().then((snap) => {
            if(this.props.signupCallback !== undefined){
                this.props.signupCallback();
            }
        })*/
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div className="promotion">
                    <div className="panel">
                        <div className="row">
                            <div className="col-xs-4">
                                <div className="panel-header-image">
                                {
                                    this.state.promotion.logoPreviewImage === undefined
                                    ?
                                        (<div className="text-left">
                                            <FlatButton
                                                labelPosition="after"
                                                icon={<FileCloudUpload />}
                                                className="btn-smotion link"
                                                containerElement='label'
                                                label='Upload Logo Picture'>
                                                    <input onChange={this.chooseLogoPicture} style={{display:'none'}} type="file" />
                                            </FlatButton>
                                        </div>)
                                    :
                                        (<Paper className="promo-logo" style={{backgroundImage: this.state.promotion.logoPreviewImage}} zDepth={1} />)
                                }
                                </div>
                            </div> 
                            <div className="col-xs-8">
                                <div className="panel-header-label">
                                    {
                                        this.state.promotion.startDate === undefined || this.state.promotion.endDate === undefined 
                                        ?
                                            (<div className="text-right primary-color">
                                                <a onClick={() => this.refs.startDate.refs.dialogWindow.show()}>
                                                    Edit start date
                                                    <DatePicker value={this.state.promotion.startDate} onChange={this.setStartDate} ref="startDate" style={{display:'none'}} hintText="Start Date" />
                                                </a>
                                                &nbsp;&#8226;&nbsp;
                                                <a onClick={() => this.refs.endDate.refs.dialogWindow.show()}>
                                                Edit start date
                                                    <DatePicker value={this.state.promotion.endDate} onChange={this.setEndDate} ref="endDate" style={{display:'none'}} hintText="End Date" />
                                                </a>
                                            </div>)
                                        :
                                            <div>
                                                {this.state.promotion.game}
                                            </div>
                                    }
                                   
                                </div>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="promotion-steps">
                                {[...Array(5)].map((x, i) =>
                                    this.isSingupAllowed() && i === 4
                                    ?
                                    <Paper key={i} className="promo-level signup" zDepth={1} circle={true}>
                                        <span onClick={ () => this.signUpCampaign() } className="promo-edit-level">SIGNUP</span>
                                    </Paper>
                                    :
                                    <Paper key={i} style={{backgroundImage: this.getImageLevel(i) }} className="promo-level" zDepth={1} circle={true}>
                                        <span onClick={ () => this.isEditable() ? this.showDialog(i) : false } className="promo-edit-level">{this.getImageLevel(i) ? '' : `EDIT LEVEL ${i+1}`}</span>
                                    </Paper>
                                )}
                                </div>
                            </div>  
                        </div>
                        <div className="row">
                            <div className="promotion-detail">
                                <div className="col-xs-8">
                                    <span className="promotion-name">
                                        <input readOnly={this.isEditable} disabled={this.isEditable} onChange={this.handleChange} className="transparent-input" type="text" placeholder="Edit Campaing Name" name="name" value={this.state.promotion.name} /> 
                                    </span>
                                    {(this.state.promotion.startDate || this.state.promotion.endDate) &&
                                        <div className="promotion-calendars">{this.state.promotion.startDate}&nbsp;&#8226;&nbsp;{this.state.promotion.endDate}</div>
                                    }
                                </div>
                                <div className="col-xs-4">
                                {/*<div className="promotion-download-package">
                                    <Chip onClick={() => {alert('handleDownload')}} style={{margin: 4}}>
                                        Download Campaign Package
                                    </Chip>
                                </div>*/}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="promotion-detail">
                                <div className="col-xs-12">
                                    <textarea readOnly={this.isEditable} disabled={this.isEditable} onChange={this.handleChange} name="description" className="transparent-input fullwidth" style={{height:100, resize:'none'}} placeholder="Edit description text" value={this.state.promotion.description} />
                                </div>
                            </div>
                        </div>
                        <br/>
                        {/*<div className="row">
                            <div className="col-xs-12">
                                <div className="promotion-status">
                                    <Chip style={{backgroundColor:'red', margin: '0 40px 0 0'}}>Pending</Chip>
                                    <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 150px'}}>Pending</Chip>
                                    <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 310px'}}>Pending</Chip>
                                    <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 50px 0 470px'}}>Pending</Chip>
                                    <Chip style={{position:'absolute', backgroundColor:'red', margin: '-32px 0 0 720px'}}>Pending</Chip>
                                </div>
                            </div>  
                        </div>*/}
                    </div>

                    <Dialog
                        className="smotion-dialog"
                        modal
                        onRequestClose={() => this.setState({openLevelDialog : false})}
                        open={this.state.openLevelDialog}
                    >
                        
                        
                        <div className="row">
                                <div className="col-xs-12">
                                    <div className="bg-gray">
                                        <div className="row header">
                                            <div className="col-xs-10 col-xs-offset-1">
                                                <h6>Level {this.state.selectedLevelIndex + 1}</h6>
                                            </div>
                                            <div className="col-xs-1">
                                                <a className="close" onClick={() => {this.setState({openLevelDialog: false})}}>X</a>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-xs-10 col-xs-offset-1">
                                                <ValidatorForm
                                                    ref="form"
                                                    onSubmit={this.handleApplyLevelInfo}
                                                >
                                                    <div className="white-form">
                    
                                                        <div className="row">
                                                            <div className="col-xs-9">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Active Level Image" fullWidth 
                                                                    name="activeImgName"
                                                                    disabled={true}
                                                                    value={this.state.selectedLevel.activeImageName}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-xs-3">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary"
                                                                    containerElement='label'
                                                                    label='Choose File'>
                                                                        <input onChange={this.chooseActiveLevelImage} style={{display:'none'}} type="file" />
                                                                </RaisedButton>
                                                            </div>
                                                            <div className="col-xs-9">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Inactive Level Image" fullWidth 
                                                                    name="inactiveImgName"
                                                                    disabled={true}
                                                                    value={this.state.selectedLevel.inactiveImageName}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-xs-3">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary"
                                                                    containerElement='label'
                                                                    label='Choose File'>
                                                                        <input onChange={this.chooseInactiveLevelImage} style={{display:'none'}} type="file" />
                                                                </RaisedButton>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Best To Reach" fullWidth 
                                                                    name="bestToReach"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.bestToReach}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-xs-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Discount %" fullWidth 
                                                                    name="discount"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.discount}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-xs-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Freearounds" fullWidth 
                                                                    name="freearounds"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.freearounds}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-4 col-xs-offset-4">
                                                                <RaisedButton className="btn-smotion primary btn-submit" type="submit" label="Apply" primary={true} />
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

        return jsx;
    }
}
 
// export the component
export default Promotion;