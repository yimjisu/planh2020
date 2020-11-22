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
import Level from '../views/ui-components/level.jsx';
import Session from '../views/ui-components/session.jsx';
import Review from '../views/ui-components/review.jsx';
import Detail from '../views/ui-components/detail.jsx';

 
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
  },/*
  {
    path: '/ui-components/alert',
    name: 'Alerts',
    icon: 'mdi mdi-comment-processing-outline',
    component: Alerts
  },
  {
    path: '/ui-components/badge',
    name: 'Badges',
    icon: 'mdi mdi-arrange-send-backward',
    component: Badges
  },
  {
    path: '/ui-components/button',
    name: 'Buttons',
    icon: 'mdi mdi-toggle-switch',
    component: Buttons
  },
  {
    path: '/ui-components/card',
    name: 'Cards',
    icon: 'mdi mdi-credit-card-multiple',
    component: Cards
  },
  {
    path: '/ui-components/layout',
    name: 'Layout',
    icon: 'mdi mdi-apps',
    component: LayoutComponent
  },
  {
    path: '/ui-components/pagination',
    name: 'Pagination',

    icon: 'mdi mdi-priority-high',
    component: PaginationComponent
  },
  {
    path: '/ui-components/popover',
    name: 'Popover',

    icon: 'mdi mdi-pencil-circle',
    component: PopoverComponent
  },
  {
    path: '/ui-components/tooltip',
    name: 'Toltips',

    icon: 'mdi mdi-image-filter-vintage',
    component: TooltipComponent
  },*/{path: '/review/:key', component: Cards},
  {path: '/detail/:key', component: Detail},
  {
    path: '/',
    pathTo: '/starter/starter',
    name: 'Dashboard',
    redirect: true
  }
];
export default ThemeRoutes;
