import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';

class ClientRoleAwareComponent extends CommonRoleAwareComponent  {

  constructor(props) {
    super(props);
    this.allowedRoles = ['CLIENT'];
    if(this.getUser() !== null){
      this.userRoles = ['CLIENT'];
    }
  }
  
}

export default ClientRoleAwareComponent;