import React from 'react';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import { Redirect } from 'react-router-dom';

class ClientRoleAwareComponent extends CommonRoleAwareComponent  {

  constructor(props) {
    super(props);
    this.allowedRoles = ['client'];
    this.userRoles = ['client'];
  }
  
}

export default ClientRoleAwareComponent;