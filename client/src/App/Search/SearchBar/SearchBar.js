import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import {
  getAmazonBook,
  getAmazonSingleBook,
} from '../../../store/amazon/amazonActions';
import {
  getGoodreadsBooks,
  getGoodreadsBook,
} from '../../../store/goodreads/goodreadsActions';
import { connect } from 'react-redux';
import find from 'lodash/find';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: '18px',
  },
  button: {
    marginTop: '15px',
    marginBottom: '8px',
    marginLeft: '15px',
    alignSelf: 'center',
  },
});

class SearchBar extends Component {
  state = {
    searchIsbns: [],
    multiline: '',
  };

  componentDidUpdate(prevProps) {
    // Maybe combine them in the actions
    const { amazonBooks, booklist, goodreadsBooks } = this.props;
    if (
      amazonBooks !== prevProps.amazonBooks &&
      amazonBooks.length === this.state.searchIsbns.length
    ) {
      console.log('amazonBooks', amazonBooks);

      this.props.getGoodreadsBooks(amazonBooks);
    }
  }
  handleChange = name => event => {
    this.setState({
      multiline: event.target.value,
    });
  };

  search = () => {
    const { amazonBooks } = this.props;
    const isbns = this.state.multiline.split('\n');
    this.setState({ searchIsbns: isbns });

    // this.props.getAmazonBook(isbns);
    Promise.all(
      isbns.forEach(isbn => {
        if (!find(amazonBooks, { isbn })) {
          this.props.getAmazonSingleBook(isbn);
          // this.props.getGoodreadsBook(isbn);
        } else {
          // Show some warning explainig already exists
        }
      })
    );
  };

  onSave = () => {
    console.log('save');
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
SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  amazonBooks: PropTypes.array,
  booklist: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    amazonBooks: state.amazon.books,
    goodreadsBooks: state.goodreads.books,
    booklist: state.booklist,
  };
};
const mapDispatchToProps = {
  getAmazonBook,
  getAmazonSingleBook,
  getGoodreadsBooks,
  getGoodreadsBook,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));
