import React  from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import { TextField, MenuItem, RaisedButton }   from 'material-ui';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import dateFormat from 'dateformat';
import { ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';
import { firabaseDB } from './../../../config/constants'
import { updatePassword } from './../../../helpers/auth';


/**
 * Profile component for client Role.
 */
class Profile extends ClientRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            countries: [], 
            profile : this.getUser().profile, 
            loading: true, 
            hidePassword:false, 
            passwordType:'password',
        };
        this.countriesDB = firabaseDB.child('countries');
        this.profileDB = firabaseDB.child(`users/${this.getUser().uid}/profile`);
    }

    componentWillMount() {
        this.countriesDB.once('value').then((snap => {
            this.setState({countries: snap.val()});
        }))

        this.profileDB.on('value', snap => {
            this.setState({
                profile: snap.val(),
                loading: false
            })
        });
    }

    componentWillUnmount() {
        this.profileDB.off();
        this.countriesDB.off();
    }

    handleChange = (e) => {
        const { profile } = this.state;
        profile[e.target.name] = e.target.value;
        this.setState({ profile });
    }

    /**
     * On change the Country.
     */
    handleSetCountry = (event, index, value) => {
        const { profile } = this.state;
        profile.country = value;
        this.setState({ profile });
    };

    handleSubmit = (e) => {
        e.preventDefault()
        const password = this.refs.password.input.value;
        if(password !== undefined && password !== null && password){
            updatePassword(this.getUser(), password)
                .then(() => {
                    this.refs.password.input.value = null
                })
                .catch((error) => {
                    console.log(`Error ${error.code}: ${error.message}`);
                    this.showErrorMessage('Error updating password. Please logout and try again.');
            })
        }

        delete this.state.profile.userType;
        delete this.state.profile.username;
        delete this.state.profile.apiId;
        delete this.state.profile.lastlogin;
        delete this.state.profile.email;
        delete this.state.profile.role;
        
        this.profileDB.update(this.state.profile)
            .then(() => this.showSuccessMessage('The Profile has been updated.'))
            .catch((error) => {
                console.log(`Error ${error.code}: ${error.message}`);
                this.showErrorMessage();
            })
    }

    toggleShowPassword = () => {
        const passwordType = this.state.hidePassword ? 'password' : 'text';
        this.setState({
            hidePassword: !this.state.hidePassword,
            passwordType
        });
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                <div className="profile-container">
                    <div className="row">
                        <div className="col-xs-4">
                            <div className="row">
                                <div className="col-xs-3">
                                    <div className="user-ico" />
                                </div>
                                <div className="col-xs-9 text-left no-padding">
                                    <label className="label text-uppercase">{this.getUser().email}</label><br/>
                                    <div className="profile-last-login">
                                        <label className="label gray text-uppercase">Last Login:</label>
                                        <label className="label">{dateFormat(this.getUser().profile.lastLogin, 'dS mmmm yyyy')}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="bg-gray profile-form">
                                        <div className="row">
                                            <div className="col-md-10 col-md-offset-1">
                                                <ValidatorForm
                                                    ref="form"
                                                    onSubmit={this.handleSubmit}
                                                >
                                                    <div className="white-form">
                    
                                                        <TextValidator floatingLabelFixed floatingLabelText="Name" fullWidth 
                                                            name="name" 
                                                            value={this.state.profile.name} 
                                                            onChange={this.handleChange}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                        <TextValidator floatingLabelFixed floatingLabelText="Company Name" fullWidth 
                                                            name="company"
                                                            onChange={this.handleChange}
                                                            value={this.state.profile.company} 
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                        <div className="input-icon">
                                                            <div className="col-xs-10 no-padding">
                                                                <TextField floatingLabelFixed floatingLabelText="Password" fullWidth
                                                                        name="password" ref ="password" type={this.state.passwordType} />
                                                            </div>
                                                            <div className="col-xs-2 no-padding">
                                                                <ImageRemoveRedEye onClick={this.toggleShowPassword} className={this.state.hidePassword ? 'ico-inline active': 'ico-inline'} />
                                                            </div>
                                                        </div>
                                                        

                                                        <SelectValidator floatingLabelFixed floatingLabelText="Country" fullWidth
                                                            className="select-form"
                                                            name="country" 
                                                            onChange={this.handleSetCountry}
                                                            value={this.state.profile.country}
                                                            maxHeight={200}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        >

                                                            {this.state.countries.map((country, i) =>
                                                                <MenuItem key={i} value={i} primaryText={country.name} />
                                                            , this)}
                                                        
                                                        </SelectValidator>

                                                        <TextValidator floatingLabelFixed floatingLabelText="E-mail" fullWidth 
                                                            name="disabled-email"
                                                            value={this.state.profile.email}
                                                            disabled={true}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                        <TextValidator floatingLabelFixed floatingLabelText="Role" fullWidth
                                                            name="disabled-role"
                                                            value={this.state.profile.role}
                                                            disabled={true}
                                                            validators={['required']}
                                                            errorMessages={['This field is required']}
                                                        />
                                                        <div>
                                                            <RaisedButton className="btn-smotion primary btn-submit" type="submit" fullWidth label="Save Changes" primary={true} />
                                                        </div>
                                                    </div>
                                                </ValidatorForm>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-8">
                        
                        </div>
                    </div>
                </div>
                <br/><br/><br/><br/>
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Profile;