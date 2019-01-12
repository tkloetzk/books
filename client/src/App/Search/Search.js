import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { getAmazonBook } from '../../store/amazon/amazonActions';
import { getGoodreadsBooks } from '../../store/goodreads/goodreadsActions';
import { connect } from 'react-redux';

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

  search = () => {
    //this.props.getGoodreadsBook(this.state.multiline);
    this.props.getAmazonBook(this.state.multiline).then(books => {
      this.props.getGoodreadsBooks(books);
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
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.search}
        >
          Search
        </Button>
      </form>
    );
  }
}
Search.propTypes = {
  classes: PropTypes.object.isRequired,
  amazonBooks: PropTypes.array,
  booklist: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    amazonBooks: state.amazon.books,
    booklist: state.booklist,
  };
};
const mapDispatchToProps = {
  getAmazonBook,
  getGoodreadsBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Search));
