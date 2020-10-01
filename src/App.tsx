import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import BarContent from './components/BarContent';
import MainContent from './components/MainContent';
import DrawerContent from './components/DrawerContent';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <AppLayout
      drawerOpen={drawerOpen}
      toggleDrawer={toggleDrawer}
      barContent={<BarContent toggleDrawer={toggleDrawer} />}
      mainContent={<MainContent />}
      drawerContent={<DrawerContent toggleDrawer={toggleDrawer} />}
    />
  );
};

export default App;
