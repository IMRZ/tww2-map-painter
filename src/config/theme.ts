import { createMuiTheme } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey[300],
    },
  },
});

export default theme;
