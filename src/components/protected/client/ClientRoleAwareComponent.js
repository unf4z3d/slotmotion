import { RoleAwareComponent } from 'react-router-role-authorization';

class ClientRoleAwareComponent extends RoleAwareComponent  {

  constructor(props) {
    super(props);
    this.allowedRoles = ['client'];
    this.userRoles = ['client'];
  }
}

export default ClientRoleAwareComponent;