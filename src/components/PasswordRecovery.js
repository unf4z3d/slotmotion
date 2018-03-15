import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Message from './commons/Message'
import { Link } from 'react-router-dom';
import { resetPassword } from './../helpers/auth';

/**
 * PasswordRecovery component. Recovery Password Form.
 */
class PasswordRecovery extends React.Component {

    /**
     * Component constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {successMessage:null, errorMessage: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Setter
     */
    setErrorMsg = (message) => ({ errorMessage: message })
    setSuccessMsg = (message) => ({ successMessage: message })

    /**
     * Recovery Password submit
     */
    handleSubmit = (e) => {
        e.preventDefault()
        resetPassword(this.refs.username.input.value)
            .then(() => this.setState(this.setSuccessMsg('Your password has been recovered. Check your email.')))
            .catch((error) => {
                console.log(`Error ${error.code}: ${error.message}`);
                this.setState(this.setErrorMsg('Invalid username.'));
            })
    }

    /**
     * Render method
     */
    render = ()  =>
    (
        <div className="container">
            <div className="row">
                <div className="col-4 offset-4">
                <div className="login-form">
                        <div className="password-title">
                            <h2>Password recovery</h2>
                            <hr/>
                        </div>
                        <div className="recovery-pw-form">
                        { this.state.successMessage != null
                        ?
                            <div className="recovery-success-message">
                                <Message value={this.state.successMessage} />
                                <br/>
                                <br/>
                            </div>
                        :
                            <div>
                                <Message error value={this.state.errorMessage} />
                                <div>
                                    <form onSubmit={this.handleSubmit}>
                                        <TextField className="login-input" ref="username" hintText="Email"/>
                                        <RaisedButton className="btn-smotion primary forgot-button" type="submit" fullWidth={true} label="Revover" primary={true} />
                                    </form>
                                </div>
                            </div>
                        }
                        </div>
                        <div className="back-login-link">
                            <Link className="white-link" to="/">Back to login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// export the component
export default PasswordRecovery;
