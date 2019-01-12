import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
  },
});

const Results = props => {
  const { classes, booklist } = props;
  console.log('booklist', booklist);
  return (
    <Grid item lg>
      <List component="nav">
        {booklist.map(book => (
          <div key={book.title} className={`row rounded ${classes.root}`}>
            {book.title}
            <Divider />
          </div>
        ))}
      </List>
    </Grid>
  );
};

const mapStateToProps = state => {
  console.log(state.goodreads);
  return {
    booklist: state.goodreads.booklist,
  };
};

Results.defaultProps = {
  booklist: [],
};

export default connect(mapStateToProps)(withStyles(styles)(Results));
