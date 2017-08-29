import React  from 'react';
import ClientRoleAwareComponent from './ClientRoleAwareComponent';
import Promotion from './../Promotion';
import { firabaseDB } from './../../../config/constants'

/**
 * Campaign component for client Role.
 */
class Campaign extends ClientRoleAwareComponent  {

    /**
     * Component constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {promotions: [], userPromotions: []};
    }


    componentDidMount(){
        let userRef = firabaseDB.child('promotions');
        userRef.on('child_added', snap => {
            this.setState({
                promotions: this.state.promotions.concat(snap.val())
            })
        })
        let usersPromoRef = firabaseDB.child('user').child('68ff71ae-7283-41f0-9a22-741b483e6930').child('promtions');
        usersPromoRef.on('child_added', snap => {
            this.setState({
                userPromotions: this.state.userPromotions.concat(snap.val())
            })
        })
    }

    /**
     * Render method 
     */
    render() {
        const jsx = (
            <div>
                {this.state.promotions.map((promotion, key) =>
                    <Promotion value={promotion} user={this.props.user} />
                , this)}
            </div>
        );

        return this.renderIfAuth(jsx);
    }
}
 
// export the component
export default Campaign;