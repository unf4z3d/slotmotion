import {RoleAwareComponent} from 'react-router-role-authorization';
import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';

class StaffRoleAwareComponent extends CommonRoleAwareComponent {

    constructor(props) {
        super(props);
        this.allowedRoles = ['staff'];
        //this.userRoles = [this.props.user.role];
        this.userRoles = ['staff'];
    }
}

export default StaffRoleAwareComponent;