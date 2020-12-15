/*--------------------------------------------------------------------------------*/
/*                                  starter                                    */
/*--------------------------------------------------------------------------------*/
import FirstDashboard from '../views/starter/home.jsx';
/*--------------------------------------------------------------------------------*/
/*                           Ui-components Dropdown                               */
/*--------------------------------------------------------------------------------*/
import Alerts from '../views/ui-components/alert.jsx';
import Badges from '../views/ui-components/badge.jsx';
import Buttons from '../views/ui-components/button.jsx';
import LayoutComponent from '../views/ui-components/layout.jsx';
import PaginationComponent from '../views/ui-components/pagination.jsx';
import PopoverComponent from '../views/ui-components/popover.jsx';
import TooltipComponent from '../views/ui-components/tooltip.jsx';


import Starter from '../views/starter/starter.jsx';
import Write from '../views/ui-components/write.jsx';
import Cards from '../views/ui-components/review.jsx';
import ReviewWrite from '../views/ui-components/reviewWrite.jsx';
import Level from '../views/ui-components/level.jsx';
import Review from '../views/ui-components/review.jsx';
import Detail from '../views/ui-components/detail.jsx';
import Alert from '../views/ui-components/write.jsx';
import Queried from '../views/ui-components/queried.jsx';
import { useTranslation } from 'react-i18next'
import firebase from 'firebase';
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

var name = null;
var icon = null;
firebase.auth().onAuthStateChanged(user => {
  if(user){
      name = 'Logout';
      icon = 'mdi mdi-logout';
  }else{
      name = 'LogIn';
      icon = 'mdi mdi-login';
  }
});
if(firebase.auth().currentUser){
  name = 'Logout';
  icon = 'mdi mdi-logout';
}else{
  name = 'LogIn';
  icon = 'mdi mdi-login';
}

var ThemeRoutes = [
  {
    path: '/starter/starter',
    name: 'Home',
    icon: 'mdi mdi-home',
    component: Starter
  },{
    path: '/ui-components/level',
    name: 'Check My Level',
    icon: 'mdi mdi-help',
    component: Level
  },{
    path: '/ui-components/write',
    name: 'Write',
    icon: 'mdi mdi-pencil',
    component: Write
  }/*,{
    path: '/ui-components/session',
    name: name,
    icon: icon,
    component: Session
  },*/,
  {path: '/reviewRead/:key/:my', component: Cards},
  {path: '/reviewWrite/:key/:my', component: ReviewWrite},
  {path: '/detail/:key/:my', component: Detail},
  {path: '/write/:key', component: Alert},
  {path: '/queried/:key',exact:true,component: Queried},
  {
    path: '/querier/:key',
    pathTo: '/queried/:key',
    name: 'Query',
    redirect: true
  },
  {
    path: '/',
    pathTo: '/starter/starter',
    name: 'Dashboard',
    redirect: true
  }
];
export default ThemeRoutes;
