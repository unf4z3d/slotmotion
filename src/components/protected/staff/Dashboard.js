import React from 'react';
import StaffRoleAwareComponent from './StaffRoleAwareComponent';

/**
 * Dashboard component for staff Role.
 */
class Dashboard extends StaffRoleAwareComponent {

    /**
     * Component constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
    }


    /**
     * Render method
     */
    render = () =>
        (
            <div className="row">
                Private staff
            </div>
        );
}

// export the component
export default Dashboard;