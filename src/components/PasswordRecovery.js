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
                <div className="col-md-4 col-md-offset-4">
                    <div className="login-title">
                    <h2>Password recovery</h2>
                        <hr/>
                        <br/><br/>  

                        { this.state.successMessage != null
                        ?
                            <Message value={this.state.successMessage} />
                        :
                            <div>
                                { this.state.errorMessage != null
                                ?                                    
                                    <Message error value={this.state.errorMessage} />
                                :
                                    <div>
                                        <form onSubmit={this.handleSubmit}>
                                            <TextField defaultValue="user@yopmail.com" ref="username" hintText="Username"/>
                                            <br/><br/>
                                            <RaisedButton className="btn-smotion primary" type="submit" fullWidth={true} label="Revover" primary={true} />
                                        </form>
                                    </div>
                                }
                            </div>
                        }
                        <br/><br/>
                        <Link to="/">Back to login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
// export the component
export default PasswordRecovery;