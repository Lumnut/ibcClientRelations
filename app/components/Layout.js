import React from 'react';
import Menu from './Menu.js';
import ReactRouter from 'react-router-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import NoticeBoard from './NoticeBoard';
import Help from './Help';
import Calendar from './Calendar';
import Profile from './Profile';

class Layout extends React.Component {
  render() {
    return (
      <div>
        {/*This list defines all possible location that can be navigated to*/}
        <div>
            <Menu />
        </div>
          <div>
            <Route exact={true} path='/' component={NoticeBoard} />
            <Route exact={true} path='/index.php' component={NoticeBoard} />
            <Route path='/calendar' component={Calendar} />
            <Route path='/profile' component={Calendar} />
            <Route path='/profile' component={Profile} />
            <Route path='/member_information' component={Calendar} />
            <Route path='/upcoming_events' component={Calendar} />
            <Route path='/help' component={Help} />
          </div>
      </div>
    );
  }
};

export default Layout;
