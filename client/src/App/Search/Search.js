import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    marginTop: '15px',
    marginBottom: '8px',
    marginLeft: '15px',
    alignSelf: 'center',
  },
});

class Search extends Component {
  state = {
    multiline: '',
  };

  handleChange = name => event => {
    this.setState({
      multiline: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="outlined-full-width"
          multiline
          style={{ width: '700px' }}
          value={this.state.multiline}
          onChange={this.handleChange()}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <Button variant="outlined" color="primary" className={classes.button}>
          Search
        </Button>
      </form>
    );
  }
}
Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
