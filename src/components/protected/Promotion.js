import React  from 'react';
import { Paper, Chip, Dialog, RaisedButton, FlatButton, DatePicker, Popover }  from 'material-ui';
import { PopoverAnimationVertical }  from 'material-ui/Popover/';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import CommonRoleAwareComponent from './../commons/CommonRoleAwareComponent';
import Countdown from 'react-countdown-now';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { firabaseDB, constants, firebaseStorage } from './../../config/constants';
import dateFormat from 'dateformat';
import { imageUrl, isEmpty, timeSince } from './../../helpers/index';
import { callGetUserGameplay } from './../../helpers/api';

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
            editable : props.editable ? true : false,
            loadingLevels: false,
            showTooltip: [],
            showDetail: props.editable ? 'block' : 'none',
        };
        this.signupsDB = firabaseDB.child(`users/${this.props.user.uid}/signups`);
        this.promotionsStatusDB = firabaseDB.child('promotion_status');
    }

    /**
     * Component Life Cycle
     */
    componentWillMount(){
        const {promotion} = this.state;
        if(promotion.key !== undefined){
            this.signupsDB.child(promotion.key).on('value', snap => {
                const signedUp = snap.val();
                if(signedUp !== null){
                    promotion.createdAt = signedUp.createdAt;
                    promotion.createdAtTime = signedUp.createdAtTime;
                    this.promotionsStatusDB.child(signedUp.status).once('value', snap => {
                        promotion.status = snap.val();
                        promotion.status.id = signedUp.status;
                        this.setState({ promotion });
                        if(this.props.user.profile.apiId !== undefined){
                            this.updateLevelStatus();
                        }
                    })
                }  
            });
        }
    }

    updateLevelStatus = () => {
        const { status } = this.state.promotion;
        if(status !== undefined && (status.id === 2 || status.id === 3)){    
            let { promotion } = this.state;
            //const signupDate = dateFormat(promotion.createdAtTime, "isoUtcDateTime", true)
            const signupDate = "2015-12-05T09:17:18.937Z";
            callGetUserGameplay(this.props.user, signupDate).then((response) => {
                const totalBet = response.data.totalBet;
                
                for(let i in promotion.levels){
                    let level = promotion.levels[i];
                    if(totalBet >= level.bestToReach){
                        promotion.levels[i].reached = true;
                    }
                }

                this.setState({ promotion })
            }).catch( (error) => {            
                this.setState({loading : false});
            });                
        }
    }

    /**
     * Component Life Cycle
     */
    componentWillUnmount() {
        this.promotionsStatusDB.off();        
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
        const reader = new FileReader();
        selectedLevel.activeImage = e.target.files[0];
        selectedLevel.activeImageName = selectedLevel.activeImage.name;
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
        let image = '';
        const { editable } = this.props;
        if(editable){
            image = this.state.promotion.levels[index].previewImage !== undefined 
            ? this.state.promotion.levels[index].previewImage : 
            '' 
        }else{
            const reached = this.state.promotion.levels[index].reached;
            if(reached !== undefined && reached){
                image = this.state.promotion.levels[index].activeImage.previewImage;
            }else{
                image = this.state.promotion.levels[index].inactiveImage.previewImage;
            }
        }
        return image;
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
     * Initi the promotion save proccess.
     */
    savePromotion = () => {
        if(this.submitPromotionAllowed()){
            const { promotion } = this.state;

            if(promotion.key === undefined){
                promotion.key = firabaseDB.child('promotions').push().key;
            }
            
            this.setState({promotion});

            this.initUploadFiles();
            return true;
        }else{
            return false;
        }
    }

    submitPromotionAllowed = () =>{
        const { promotion } = this.state;
        if(isEmpty(promotion.startDateTime, "Please set the Start Date")){
            return false;
        }
        if(isEmpty(promotion.endDateTime, "Please set the End Date")){
            return false;
        }
        if(isEmpty(promotion.logoPicture, "Please set the Logo Picture")){
            return false;
        }
        if(isEmpty(promotion.name, "Please set the Campaign Name")){
            return false;
        }
        if(isEmpty(promotion.description, "Please set the Campaign Description")){
            return false;
        }

        for(let i = 0; i < 5; i++){
            const currentLevel = i+1;
            if(isEmpty(promotion.levels[i].activeImage, `Please set the Active Image in the Level ${currentLevel}`)){
                return false;
            }
            if(isEmpty(promotion.levels[i].inactiveImage, `Please set the Inactive Image in the Level ${currentLevel}`)){
                return false;
            }
            if(isEmpty(promotion.levels[i].bestToReach, `Please set the Best to Reach in the Level ${currentLevel}`)){
                return false;
            }
            if(isEmpty(promotion.levels[i].discount, `Please set the Discount in the Level ${currentLevel}`)){
                return false;
            }
            if(isEmpty(promotion.levels[i].freearounds, `Please set the Freerounds in the Level ${currentLevel}`)){
                return false;
            }
        }
        
        return true;
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
            userSignup.promotion = promotion.key;
            userSignup.user = this.props.user.uid;
            this.saveCampaignSignup(userSignup);
        })
    }

    /**
     * Save the user-campaign relation.
     */
    saveCampaignSignup = userSignup => {
        firabaseDB.child('signups').push(userSignup).then((snap) => {
            this.showSuccessMessage('Signup Successful');
            if(this.props.signupCallback !== undefined){
                this.props.signupCallback();
            }
        })
    }

    /**
     * Show the clock in the promotion
     */
    started = () => {
        return this.isEditable() === false && this.state.promotion.startDateTime > Date.now();
    }

    renderClock = ({ days,hours, minutes, seconds, completed }) => {
        const times = [
            days < 10 ? '0'+days : days,
            hours < 10 ? '0'+hours : hours,
            minutes < 10 ? '0'+minutes : minutes,
            seconds < 10 ? '0'+seconds : seconds,
            'Watch Demo',
        ]

        return (  
            <div>
                {       
                [...Array(5)].map((x, i) =>
                    <Paper key={i} onClick={i === 4 && (() => {this.handleWathDemo('https://youtu.be/M7lc1UVf-VE')})} className={i === 4 ? 'promo-level watch-demo': 'promo-level clock'} zDepth={1} circle={true}>
                        <span className="promo-edit-level">{times[i]}</span>
                    </Paper>
                )
                }
            </div>
        )
    }

    /**
     * Render the video player
     */
    handleWathDemo = url => {
        this.props.onWathDemo(url);
    }

    renderLevelStatus = i => {
        const status = 'undefined';
        return <Chip key={i} className={'st-lvl st-lvl-' + i}>{status}</Chip>
    }

    renderPromotionStatus = () => {
        let status = null
        if(this.state.promotion.status){
            status = this.state.promotion.status.description;
        }

        return <Chip className={status !== null ? 'st-lvl st-lvl-4 visible ' + status  : 'st-lvl st-lvl-4'}>{status}</Chip>
    }

    getLogoImage = () => {
        let image = undefined
        if(this.props.editable){
            image = this.state.promotion.logoPreviewImage;
        }else{
            image = imageUrl(this.state.promotion.logoPreviewImage);
        }
        return image;
    }

    handleShowTooltip = (event, i) => {
        // This prevents ghost click.
        event.preventDefault();
        if(!this.isEditable()){
            let { showTooltip } = this.state;
            //showTooltip[i] = promotion.levels[i].reached;
            showTooltip[i] = true;
            
            this.setState({
                anchorEl: event.currentTarget,
                showTooltip,
            });
        }
    };

    
    handleRequestClose = (i) => {
        let { showTooltip } = this.state;
        showTooltip[i] = false;

        this.setState({ showTooltip });
    };

    getPromotionBG = (promotion) => {
        let promotionBG = "";
        for (let i in promotion.levels){
            if(promotion.levels[i].reached){
                promotionBG = "promotion-bg-lvl-" + i;
            }
        }
        return "promotion-steps " + promotionBG;
    }

    handleToggleShowDetail = () => {
        if (! this.isEditable()){
            this.setState({
                showDetail: this.state.showDetail === 'block' ? 'none' : 'block'
            })
        }
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
                                        </div>
                                        )
                                    :
                                        (
                                            <Paper onClick={this.handleToggleShowDetail} className="promo-logo" style={{backgroundImage: this.getLogoImage()}} zDepth={1} />
                                        )
                                        
                                }
                                </div>
                            </div> 
                            <div className="col-xs-8">
                                <div className="panel-header-label">
                                    {
                                        this.isEditable() 
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
                                                {
                                                this.started()
                                                ?
                                                <div>
                                                    Releasing in:
                                                </div>
                                                :
                                                <div>
                                                    Started: {timeSince(this.state.promotion.startDateTime)} ago | Ends {this.state.promotion.endDate}
                                                </div>
                                                }
                                            </div>
                                    }
                                   
                                </div>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                {
                                this.started()
                                ?   
                                    <div className="promotion-steps clock">
                                        <Countdown date={this.state.promotion.startDateTime} onComplete={() => window.location.reload()} renderer={this.renderClock} />
                                    </div>
                                :
                                    <div className={this.getPromotionBG(this.state.promotion)}>
                                        {
                                        [...Array(5)].map((x, i) =>
                                            this.isSingupAllowed() && i === 4 
                                            ?
                                                <Paper key={i} className="promo-level signup" zDepth={1} circle={true}>
                                                    <span onClick={ () => this.signUpCampaign() } className="promo-edit-level">SIGNUP</span>
                                                </Paper>
                                            :
                                                <Paper onMouseEnter={(e) => this.handleShowTooltip(e, i)} key={i} className="promo-level" zDepth={1} circle={true}>
                                                    <span onClick={ () => this.isEditable() ? this.showDialog(i) : false } className="promo-edit-level">{this.props.editable ? `EDIT LEVEL ${i+1}`: ''}
                                                        <img src={this.getImageLevel(i)} />
                                                    </span>
                                                </Paper>
                                        )
                                        }
                                    </div>
                                }
                                {
                                    [...Array(5)].map((x, i) =>
                                    (
                                        <Popover
                                                key={i}
                                                open={this.state.showTooltip[i]}
                                                animated={true}
                                                className="promotion-tooltip-container"
                                                anchorEl={this.state.anchorEl}
                                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                                onRequestClose={() => this.handleRequestClose(i)}
                                                animation={PopoverAnimationVertical}
                                            >
                                            <div className="promotion-tooltip">
                                                <label>For you:</label><br/>
                                                <span>{this.state.promotion.levels[i].discount}% Discount</span>
                                                <hr/>
                                                <label>For your players:</label><br/>
                                                <span>{this.state.promotion.levels[i].freearounds} Freerounds</span>
                                                
                                            </div>
                                        </Popover>
                                    ))
                                }
                            </div>  
                        </div>
                        <div className="row">
                            <div className="promotion-detail" style={{display: this.state.showDetail }}>
                                <div className="col-xs-8">
                                    <span className="promotion-name">
                                        {
                                        this.isEditable()
                                        ?
                                            <input onChange={this.handleChange} className="transparent-input" type="text" placeholder="Edit Campaing Name" name="name" value={this.state.promotion.name} /> 
                                        :
                                            <input readOnly disabled onChange={this.handleChange} className="transparent-input" type="text" placeholder="Edit Campaing Name" name="name" value={this.state.promotion.name} /> 
                                        }
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
                            <div className="promotion-detail description" style={{display: this.state.showDetail }}>
                                <div className="col-xs-12">
                                    {   
                                        this.isEditable()
                                        ?
                                        <textarea onChange={this.handleChange} name="description" className="transparent-input fullwidth" style={{height:110, resize:'none'}} placeholder="Edit description text" value={this.state.promotion.description} />
                                        :
                                        <textarea readOnly disabled onChange={this.handleChange} name="description" className="transparent-input fullwidth" style={{height:110, resize:'none'}} placeholder="Edit description text" value={this.state.promotion.description} />
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <br/>
                        { this.started() === false &&
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="promotion-status">                                
                                        {[...Array(4)].map((x, i) => this.renderLevelStatus(i) )}
                                        { this.renderPromotionStatus() } 
                                    </div>
                                </div>  
                            </div>
                        }
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
                                                <a className="close" onClick={() => {this.setState({openLevelDialog: false})}}>x</a>
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
                                                            <div className="col-xs-3 column-choose-file">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary file-min"
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
                                                            <div className="col-xs-3 column-choose-file">
                                                                <RaisedButton
                                                                    className="btn-smotion secondary file-min"
                                                                    containerElement='label'
                                                                    label='Choose File'>
                                                                        <input onChange={this.chooseInactiveLevelImage} style={{display:'none'}} type="file" />
                                                                </RaisedButton>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-4">
                                                                <TextValidator floatingLabelFixed floatingLabelText="Bets To Reach" fullWidth 
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