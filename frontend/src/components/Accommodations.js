import React from 'react';
import { Tab } from 'semantic-ui-react';
import MyAccommodations from './MyAccommodations';
import SearchAccommodations from './SearchAccommodations';

const Accommodations = () => {
  // Tab panes configuration
  const panes = [
    {
      menuItem: 'My Accommodations',
      render: () => (
        <Tab.Pane><MyAccommodations /></Tab.Pane>
      ),
    },
    {
      menuItem: 'Search Accommodations',
      render: () => (
        <Tab.Pane>
          <SearchAccommodations />
        </Tab.Pane>
      ),
    },
  ];


  return (
    <Tab panes={panes} />
  );
};

export default Accommodations;
