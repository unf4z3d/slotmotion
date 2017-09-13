import React from 'react';
import { RoleAwareComponent } from 'react-router-role-authorization';
import { Redirect } from 'react-router-dom';

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
        return <div>Please Wait</div>
      }else{
        return component;
      }

    }else{
      return <Redirect to={{pathname: '/'}} />;
    }
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
}

export default CommonRoleAwareComponent;