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
import Session from '../views/ui-components/session.jsx';
import Review from '../views/ui-components/review.jsx';
import Detail from '../views/ui-components/detail.jsx';
import Alert from '../views/ui-components/write.jsx';
import Queried from '../views/ui-components/queried.jsx';

 
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
  },{
    path: '/ui-components/session',
    name: 'Login',
    icon: 'mdi mdi-login',
    component: Session
  },
  {path: '/reviewRead/:key/:my', component: Cards},
  {path: '/reviewWrite/:key/:my', component: ReviewWrite},
  {path: '/detail/:key', component: Detail},
  {path: '/write/:key', component: Alert},
  {path: '/queried/:key',exact:true,component: Queried},
  {
    path: '/',
    pathTo: '/starter/starter',
    name: 'Dashboard',
    redirect: true
  }
];
export default ThemeRoutes;
