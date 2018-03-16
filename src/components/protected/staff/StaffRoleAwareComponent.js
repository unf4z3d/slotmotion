import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';

class StaffRoleAwareComponent extends CommonRoleAwareComponent {
  constructor(props) {
    super(props);
    this.allowedRoles = ['STAFF'];
    this.userRoles = [this.getUser().profile.userType.toUpperCase()];
  }
}

export default StaffRoleAwareComponent;
