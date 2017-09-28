import CommonRoleAwareComponent from './../../commons/CommonRoleAwareComponent';
import { logout } from './../../../helpers/auth';

/**
 * StaffMenu component for staff Role.
 */
class StaffMenu extends CommonRoleAwareComponent  {
    
    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = { selectedItem : 1, openUserMenu : false};
    }

    handleLogout(){
        logout().catch(error => console.log(`Error ${error.code}: ${error.message}`))
    }

    handleChangeMenuItem = (i) => {
        this.setState({
            selectedItem: i,
        })
    }

    getSelectedItem = (i) =>{
        return i === this.state.selectedItem;
    }

    handleUserMenu = () => {
        this.setState({
            openUserMenu: true,
        });
    }

    handleOnRequestUserMenuChange = (value) => {
        this.setState({
            openUserMenu: false,
        });
    }
}
 
// export the component
export default StaffMenu;