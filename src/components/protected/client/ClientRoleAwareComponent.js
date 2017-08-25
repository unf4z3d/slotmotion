import React from 'react';
import { RoleAwareComponent } from 'react-router-role-authorization';
import { Redirect } from 'react-router-dom';

class ClientRoleAwareComponent extends RoleAwareComponent  {

  constructor(props) {
    super(props);
    this.allowedRoles = ['client'];
    this.userRoles = ['client'];
  }

  getUser(){

    return this.props.user != null ? this.props.user : this.props.user
  }

  isAuthenticated(){
    return this.props.user != null && this.rolesMatched();
  }

  renderIfAuth(component){
    if(this.isAuthenticated()){
      return component;
    }else{
      return <Redirect to={{pathname: '/'}} />;
    }
  }
}

export default ClientRoleAwareComponent;