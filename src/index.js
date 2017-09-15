import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'react-pace/vendor/pace/themes/blue/pace-theme-minimal.css';

let Pace = require('react-pace/vendor/pace/pace');

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
