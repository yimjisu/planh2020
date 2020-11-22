import React from 'react';
import ReactDOM from 'react-dom';
//import { createBrowserHistory } from 'history';
import indexRoutes from './routes/index.jsx';
import { Route, Switch } from 'react-router-dom';
import { HashRouter } from 'react-router-dom'
import firebase from 'firebase';

import './assets/scss/style.css';

//const hist = createBrowserHistory();
var firebaseConfig = {
    apiKey: "AIzaSyCrM4HePxX_a7PukmLZGb8TjsKUJR-Ut_s",
    authDomain: "planh-67172.firebaseapp.com",
    databaseURL: "https://planh-67172.firebaseio.com",
    projectId: "planh-67172",
    storageBucket: "planh-67172.appspot.com",
    messagingSenderId: "596466420883",
    appId: "1:596466420883:web:9dcc0ef3bb814ae7fc5166",
    measurementId: "G-VP2PL0V7Y8"
  };
  firebase.initializeApp(firebaseConfig);
  
ReactDOM.render(

    <HashRouter>
        <Switch>
            {indexRoutes.map((prop, key) => {
                return <Route path={prop.path} exact={prop.exact} key={key} component={prop.component} />;
            })}
        </Switch>
    </HashRouter>
    , document.getElementById('root')); 
