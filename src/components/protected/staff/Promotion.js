import React  from 'react';
import { Paper, Chip, Dialog, RaisedButton, FlatButton, DatePicker }  from 'material-ui';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { firabaseDB, constants, firebaseStorage } from './../../../config/constants';
import dateFormat from 'dateformat';
import { imageUrl, isEmpty } from './../../../helpers/index';

/**
 * Promotion component for staff Role.
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
        };
    }

    /**
     * Set and Preview the Active image in the selected level.
     */
    chooseActiveLevelImage = e => {
        const { selectedLevel } = this.state;
        const reader = new FileReader();
        selectedLevel.activeImage = e.target.files[0];
        selectedLevel.activeImageName = selectedLevel.activeImage.name;
        this.setState({selectedLevel});

        reader.onload = e => {
            selectedLevel.previewImage = e.target.result;
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
        let image = undefined;

        image = this.state.promotion.levels[index].previewImage !== undefined
            ? this.state.promotion.levels[index].previewImage :
            ''

        if(image === ''){
            image = undefined;
        }

        return image;
    }

    /**
     * Set the promotion value on each attr.
     */
    handleChangeInput = e => {
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
    setStartDate = (e, startDate) => {
        const { promotion } = this.state;
        promotion.startDate = dateFormat(startDate, constants.formatDate);
        promotion.startDateTime = startDate.getTime();
        this.setState({promotion, startDate});
    }

    /**
     * Set the promotion ends date
     */
    setEndDate = (e, endDate) => {
        const { promotion } = this.state;
        promotion.endDate = dateFormat(endDate, constants.formatDate);
        promotion.endDateTime = endDate.getTime();
        this.setState({promotion, endDate});
    }

    /**
     * Set and Preview the Promotion logo picture
     */
    chooseLogoPicture = e => {
        const { promotion } = this.state;
        const reader = new FileReader();
        promotion.logoPicture = e.target.files[0];
        promotion.logoPictureName = promotion.logoPicture.name;
        this.setState({promotion});

        reader.onload = e => {
            promotion.logoPreviewImage = imageUrl(e.target.result);
            this.setState({promotion});
        }

        reader.readAsDataURL(promotion.logoPicture);
    }

    /**
     * Set the the CampaignPackage
     */
    chooseCampaignPackage = e => {
        const { promotion } = this.state;

        promotion.campaignPackage = e.target.files[0];
        promotion.campaignPackageName = promotion.campaignPackage.name;

        this.setState({promotion});
    }

    /**
     * Initi the promotion save proccess.
     */
    savePromotion = () => {
        const response = this.submitPromotionAllowed();
        if(response.success){
            const { promotion } = this.state;

            if(promotion.key === undefined){
                promotion.key = firabaseDB.child('promotions').push().key;
            }

            this.setState({promotion});

            this.initUploadFiles();
            return response;
        }else{
            return response;
        }
    }

    submitPromotionAllowed = () =>{
        const { promotion } = this.state;

        if(isEmpty(promotion.startDateTime)){
            return {success: false, message: "Please set the Start Date"}
        }
        if(isEmpty(promotion.endDateTime)){
            return {success: false, message: "Please set the End Date"}
        }
        if(isEmpty(promotion.logoPicture)){
            return {success: false, message: "Please set the Logo Picture"}
        }
        if(isEmpty(promotion.name)){
            return {success: false, message: "Please set the Campaign Name"}
        }
        if(isEmpty(promotion.description)){
            return {success: false, message: "Please set the Campaign Description"}
        }
        if(isEmpty(promotion.campaignPackage)){
            return {success: false, message: "Please set the Campaign Package"}
        }

        for(let i = 0; i < 5; i++){
            const currentLevel = i+1;
            if(isEmpty(promotion.levels[i].activeImage)){
                return {success: false, message: `Please set the Active Image in the Level ${currentLevel}`}
            }
            if(isEmpty(promotion.levels[i].inactiveImage)){
                return {success: false, message: `Please set the Inactive Image in the Level ${currentLevel}`}
            }
            if(isEmpty(promotion.levels[i].bestToReach)){
                return {success: false, message: `Please set the Best to Reach in the Level ${currentLevel}`}
            }
            if(isEmpty(promotion.levels[i].discount)){
                return {success: false, message: `Please set the Discount in the Level ${currentLevel}`}
            }
            if(isEmpty(promotion.levels[i].freearounds)){
                return {success: false, message: `Please set the Freerounds in the Level ${currentLevel}`}
            }
        }

        return {success: true};
    }

    /**
     * Init the upload files.
     */
    initUploadFiles = () => {
        this.uploadLogoPicture();
    }

    /**
     * Upload the logo picture and callback the campaign package process
     */
    uploadLogoPicture = () => {
        const { promotion } = this.state;
        firebaseStorage().ref().child("promotions").child(promotion.key).child("logoPicture")
            .put(promotion.logoPicture).then((snap) => {

            promotion.logoPreviewImage = snap.downloadURL;
            this.setState({promotion});
            this.uploadCampaignPackage();
        })
    }

    /**
     * Upload the promotion campaign package and callback the level images upload
     */
    uploadCampaignPackage = () => {
        const { promotion } = this.state;
        firebaseStorage().ref().child("promotions").child(promotion.key).child("campaignPackage")
            .put(promotion.campaignPackage).then((snap) => {

            promotion.campaignPackageURL = snap.downloadURL;
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
        this.uploadLevelImage(promotion, 0, 'inactiveImage', this.putPromotionData);
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
        firabaseDB.child('promotions').child(promotion.key).set(promotion).then((snap) => {
            if(this.props.onSuccess !== undefined){
                this.props.onSuccess();
            }else{
                this.showSuccessMessage('The promotion has been created');
            }
        })
    }

    getLogoImage = () => {

        return this.state.promotion.logoPreviewImage;
    }

    getPromotionBG = (promotion) => {
        let promotionBG = "";
        for (let i in promotion.levels){
            if(promotion.levels[i].reached){
                promotionBG = "promotion-bg-lvl-" + i;
            }
        }
        return "promotion-steps " + promotionBG;
    }

    /**
     * Render method
     */
    render() {
        const jsx = (
            <div className="promotion">
                    <div className="panel">
                        <div className="row">
                            <div className="col-4">
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
                                        </div>
                                        )
                                    :
                                        (
                                            <FlatButton
                                                labelPosition="after"
                                                className="btn-smotion link"
                                                containerElement='label'>
                                                    <Paper onClick={this.handleToggleShowDetail} className="promo-logo" style={{backgroundImage: this.getLogoImage()}} zDepth={1} />
                                                    <input onChange={this.chooseLogoPicture} style={{display:'none'}} type="file" />
                                            </FlatButton>
                                        )
                                }
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="panel-header-label">
                                    <div className="text-right primary-color">
                                        <a onClick={() => this.refs.startDate.refs.dialogWindow.show()}>
                                            Edit start date
                                            <DatePicker value={this.state.promotion.startDate} maxDate={this.state.endDate} onChange={this.setStartDate} ref="startDate" style={{display:'none'}} hintText="Start Date" />
                                        </a>
                                        &nbsp;&#8226;&nbsp;
                                        <a onClick={() => this.refs.endDate.refs.dialogWindow.show()}>
                                            Edit end date
                                            <DatePicker value={this.state.promotion.endDate} minDate={this.state.startDate} onChange={this.setEndDate} ref="endDate" style={{display:'none'}} hintText="End Date" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className={this.getPromotionBG(this.state.promotion)}>
                                    {
                                    [...Array(5)].map((x, i) =>
                                        <Paper className="promo-level app-tooltip" zDepth={1} circle={true}>
                                            <span onClick={ () => this.showDialog(i) } className="promo-edit-level">
                                                {
                                                    this.getImageLevel(i) === undefined
                                                    ?
                                                    `EDIT LEVEL ${i+1}`
                                                    :
                                                    (<img src={this.getImageLevel(i)} alt="" />)
                                                }
                                            </span>
                                            {
                                                this.state.promotion.levels[i].discount !== undefined
                                             && this.state.promotion.levels[i].freearounds !== undefined
                                             &&
                                                <span className="app-tooltip-content promotion-tooltip-container">
                                                    <div className="promotion-tooltip">
                                                        <label>For you:</label><br/>
                                                        <span>{this.state.promotion.levels[i].discount}% Discount</span>
                                                        <hr/>
                                                        <label>For your players:</label><br/>
                                                        <span>{this.state.promotion.levels[i].freearounds} Freerounds</span>
                                                    </div>
                                                </span>
                                            }
                                        </Paper>
                                    )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="promotion-detail" style={{display: this.state.showDetail }}>
                                <div className="col-8">
                                    <span className="promotion-name">
                                        <input onChange={this.handleChangeInput} className="transparent-input" type="text" placeholder="Edit Campaing Name" name="name" value={this.state.promotion.name} />
                                    </span>
                                    {(this.state.promotion.startDate || this.state.promotion.endDate) &&
                                        <div className="promotion-calendars">
                                            <div>
                                                {this.state.promotion.startDate}&nbsp;&#8226;&nbsp;{this.state.promotion.endDate}
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="col-4">
                                <div className="promotion-download-package">
                                    <FlatButton
                                        labelPosition="after"
                                        containerElement='label'>
                                        <Chip style={{margin: 4}}>
                                            Upload Campaign Package
                                        </Chip>
                                        <input onChange={this.chooseCampaignPackage} style={{display:'none'}} type="file" />
                                    </FlatButton>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="promotion-detail description" style={{display: this.state.showDetail }}>
                                <div className="col-12">
                                    <textarea onChange={this.handleChangeInput} name="description" className="transparent-input fullwidth" style={{height:110, resize:'none'}} placeholder="Edit description text" value={this.state.promotion.description} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Dialog
                        className="smotion-dialog"
                        modal
                        onRequestClose={() => this.setState({openLevelDialog : false})}
                        open={this.state.openLevelDialog}
                    >


                        <div className="row">
                                <div className="col-12">
                                    <div className="bg-gray">
                                        <div className="row header">
                                            <div className="col-10 offset-1">
                                                <h6>Level {this.state.selectedLevelIndex + 1}</h6>
                                            </div>
                                            <div className="col-1">
                                                <a className="close" onClick={() => {this.setState({openLevelDialog: false})}}>x</a>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-10 offset-1">
                                                <ValidatorForm
                                                    ref="form"
                                                    onSubmit={this.handleApplyLevelInfo}
                                                >
                                                    <div className="white-form">

                                                        <div className="row">
                                                            <div className="col-9">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Active Level Image" fullWidth
                                                                    name="activeImgName"
                                                                    disabled={true}
                                                                    value={this.state.selectedLevel.activeImageName}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-3 column-choose-file">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary file-min"
                                                                    containerElement='label'
                                                                    label='Choose File'>
                                                                        <input onChange={this.chooseActiveLevelImage} style={{display:'none'}} type="file" />
                                                                </RaisedButton>
                                                            </div>
                                                            <div className="col-9">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Inactive Level Image" fullWidth
                                                                    name="inactiveImgName"
                                                                    disabled={true}
                                                                    value={this.state.selectedLevel.inactiveImageName}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-3 column-choose-file">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary file-min"
                                                                    containerElement='label'
                                                                    label='Choose File'>
                                                                        <input onChange={this.chooseInactiveLevelImage} style={{display:'none'}} type="file" />
                                                                </RaisedButton>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Bets To Reach" fullWidth
                                                                    name="bestToReach"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.bestToReach}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Discount %" fullWidth
                                                                    name="discount"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.discount}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                            <div className="col-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Freerounds" fullWidth
                                                                    name="freearounds"
                                                                    onChange={this.handleChangeLevel}
                                                                    value={this.state.selectedLevel.freearounds}
                                                                    validators={['required']}
                                                                    errorMessages={['This field is required']}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-4 offset-4">
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
