import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MdEmail from 'react-icons/lib/md/email';
import { login, resetPassword } from '../helpers/auth';


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
    setErrorMsg = (error) => { errorMessage: error }
    
    /**
     * Login submit
     */
    handleSubmit = (e) => {
        e.preventDefault()
        login(this.refs.username.input.value, this.refs.password.input.value)
        .catch((error) => {
            this.setState(this.setErrorMsg('Invalid username/password.'))
        })
    }

    /**
     * Render method 
     */
    render = ()  => 
    (
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <div className="login-title">
                    <h2>Client Area Login</h2>
                    <hr/>
                    <br/><br/>  
                    <form onSubmit={this.handleSubmit}>
                        <TextField defaultValue="oyepez003@gmail.com" ref="username" hintText="Username"/>
                        <br/><br/>
                        <TextField defaultValue="123456" ref="password" type="password" hintText="Password"/>
                        <br/><br/>
                        <Checkbox label="Remember me"/>
                        <br/>
                        <RaisedButton type="submit" fullWidth={true} label="Login" primary={true} />
                    </form>
                    <br/><br/>
                    <a href="#">
                    <MdEmail size={20} /> Password recovery
                    </a>
                </div>
            </div>
        </div>
    );
}
 
// export the component
export default Login;