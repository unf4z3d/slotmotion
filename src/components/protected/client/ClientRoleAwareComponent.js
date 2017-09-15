import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';

class ClientRoleAwareComponent extends CommonRoleAwareComponent  {

  constructor(props) {
    super(props);
    this.allowedRoles = ['client'];
    this.userRoles = ['client'];
  }
  
}

export default ClientRoleAwareComponent;