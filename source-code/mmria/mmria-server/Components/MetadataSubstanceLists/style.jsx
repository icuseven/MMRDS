import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  'substance-lists__sticky-controls': {
    top: 0,
    padding: '10px',
    background: 'grey',
    border: '1px solid grey',
    borderRadius: '5px',
    zIndex: 2,
  },
  'csv-active': {
    background: 'white',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '10px',
    margin: '5px',
  },
});

export default useStyles;
