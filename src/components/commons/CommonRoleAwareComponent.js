import React from 'react';
import { RoleAwareComponent } from 'react-router-role-authorization';
import { Redirect } from 'react-router-dom';
import {Snackbar, CircularProgress} from 'material-ui';

class CommonRoleAwareComponent extends RoleAwareComponent  {

  /**
   * Get te current user data.
   */
  getUser = () =>{
    return this.props.user !== null ? this.props.user : this.props.user
  }

  /**
   * Return if user is authenticated.
   */
  isAuthenticated = () =>{
    return this.props.user !== null && this.rolesMatched();
  }

  /**
   * Render the template if user is authenticated.
   */
  renderIfAuth = (component) =>{
    if(this.isAuthenticated()){
      const {loading} = this.state;

      if(loading){
        return <div><CircularProgress /></div>
      }else{
        return <div>
                {component}
                <Snackbar
                  open={this.state.showSnackbarMessage !== undefined ? this.state.showSnackbarMessage : false}
                  message={this.state.snackbarMessage !== undefined ? this.state.snackbarMessage : false}
                  onRequestClose={() => {this.setState({showSnackbarMessage: false})}}
                  autoHideDuration={4000}
                />
               </div>;
      }

    }else{
      return <Redirect to={{pathname: '/'}} />;
    }
  }

  quitLoading = (timeout = 5000) => {
    setTimeout(() => {
        this.setState({loading: false})
    }, timeout)
  }

  /**
   * Check if the user role is match with the $role param.
   */
  hasRole = (role) => {
    return this.props.user !== undefined 
          && this.props.user.profile !== undefined 
          && this.props.user.profile.userType === role;
  }

  /**
   * Check if the current user is an admin user.
   */
  isAdmin = () => this.hasRole('STAFF')

  /**
   * Show a success message.
   */
  showSuccessMessage = (message) => {
    this.showMessage(message)
  }

  /**
   * Show a success message.
   */
  showErrorMessage = (message = "An error has been occurred.") => {
    this.showMessage(message)
  }

    /**
   * Show a success message.
   */
  showMessage = (message) => {
    this.setState({
      showSnackbarMessage: true,
      snackbarMessage : message
    })
  }
}

export default CommonRoleAwareComponent;