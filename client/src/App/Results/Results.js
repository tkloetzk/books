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
  const { classes, movies } = props;
  return (
    <Grid item lg>
      <List component="nav">
        {movies.map(movie => (
          <div key={movie.title} className={`row rounded ${classes.root}`}>
            <Divider />
          </div>
        ))}
      </List>
    </Grid>
  );
};

const mapStateToProps = state => ({
  movies: state.movies,
});

Results.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape),
  classes: PropTypes.shape.isRequired,
};

Results.defaultProps = {
  movies: [],
};

export default connect(mapStateToProps)(withStyles(styles)(Results));
