import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { usePreloader } from './preloader';

type PreloaderProps = {
  children: React.ReactElement,
  assets: string[],
};

const Preloader = (props: PreloaderProps) => {
  const { loaded, progress } = usePreloader(props.assets);

  if (!loaded) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress variant="static" value={progress} />
      </Box>
    );
  }

  return <>{props.children}</>;
};

export default Preloader;
