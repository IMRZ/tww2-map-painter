import { createMuiTheme } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[100],
    },
  },
});

export default theme;
