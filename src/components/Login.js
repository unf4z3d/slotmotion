import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Message from './commons/Message'
import IconButton from 'material-ui/IconButton';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import NavigationCheck from 'material-ui/svg-icons/navigation/check'
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import { Link } from 'react-router-dom';
import { firabaseDB } from './../config/constants'
import { login } from './../helpers/auth';


/**
 * Login component. Authentication Form.
 */
class Login extends React.Component {

    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {errorMessage: null};
    }

    /**
     * Setter
     */
    setErrorMsg = (message) => ({ errorMessage: message })
    
    /**
     * Login submit
     */
    handleSubmit = (e) => {
        e.preventDefault()
        login(this.refs.username.input.value, this.refs.password.input.value)
            .then((user) => {
                firabaseDB.child(`users/${user.uid}/profile`).update(
                    { lastLogin: new Date().getTime() }
                )
            })
            .catch((error) => {
                console.log(`Error ${error.code}: ${error.message}`);
                this.setState(this.setErrorMsg('Invalid username/password.'));
            })
    }

    /**
     * Render method 
     */
    render = ()  => 
    (
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    <div className="login-form">
                        <div className="login-title"> 
                            <h2>Client area login</h2>
                            <hr/>
                        </div>
                        <Message error value={this.state.errorMessage} />  
                        <form onSubmit={this.handleSubmit}>
                            <TextField className="login-input" ref="username" hintText="Username"/>
                            <TextField className="login-input" ref="password" type="password" hintText="Password"/>
                            <Checkbox className="remember-me login-check" label="Remember me"           
                                      checkedIcon={<NavigationCheck />}
                                      uncheckedIcon={<NavigationCheck />}/>
                            <RaisedButton className="btn-smotion primary login-button" type="submit" fullWidth={true} label="Login" primary={true} />
                        </form>
                        <div className="forgot-pw-link">
                            <Link className="white-link" to="/forgot-password">
                            <span className="settings-ico" />
                            password recovery</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
// export the component
export default Login;