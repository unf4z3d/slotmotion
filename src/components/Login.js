import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Message from './commons/Message'
import { Link } from 'react-router-dom';
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
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    <div className="login-title">
                        <h2>Client Area Login</h2>
                        <hr/>
                        <Message error value={this.state.errorMessage} />
                        <br/><br/>  
                        <form onSubmit={this.handleSubmit}>
                            <TextField defaultValue="user@yopmail.com" ref="username" hintText="Username"/>
                            <br/><br/>
                            <TextField defaultValue="123456" ref="password" type="password" hintText="Password"/>
                            <br/><br/>
                            <Checkbox label="Remember me"/>
                            <br/>
                            <RaisedButton type="submit" fullWidth={true} label="Login" primary={true} />
                        </form>
                        <br/><br/>
                        <Link to="/forgot-password">Password recovery</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
// export the component
export default Login;