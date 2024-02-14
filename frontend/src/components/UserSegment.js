import React from 'react';
import { Segment, Tab } from 'semantic-ui-react';

const UserSegment = ({isLoggedIn}) => {

  const panes = [
    { menuItem: 'Profile', render: () => <Tab.Pane>Profile Content</Tab.Pane> },
    { menuItem: 'Projects', render: () => <Tab.Pane>Projects Content</Tab.Pane> },
  ];

  if (isLoggedIn) {
    return (
      <Segment>
        <Tab panes={panes} />
      </Segment>
    );
  } else {
    return (
      <Segment>
        <p>Please <a href="/login">Log In</a> or <a href="/register">Register</a></p>
        Projects Content
      </Segment>
    );
  }
};

export default UserSegment;
