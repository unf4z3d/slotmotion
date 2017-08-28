import {RoleAwareComponent} from 'react-router-role-authorization';

class StaffRoleAwareComponent extends RoleAwareComponent {

    constructor(props) {
        super(props);
        this.allowedRoles = ['staff'];
        this.userRoles = ['staff'];
    }
}

export default StaffRoleAwareComponent;