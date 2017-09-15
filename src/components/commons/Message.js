import React from 'react';


export default class Message extends React.Component {
    render = () => (
        <div>
            <p className={this.props.error ? 'app-message-error' : 'app-message-success'}>{this.props.value}</p>
        </div>
    );
}