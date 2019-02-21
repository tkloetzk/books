import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Book from '../Book/Book';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
});

const Results = ({ booklist }) => {
  return (
    <Grid container>
      {booklist.map(book => {
        return <Book key={book.isbn} book={book} />;
      })}
    </Grid>
  );
};

Results.defaultProps = {
  booklist: [],
};

export default withStyles(styles)(Results);
