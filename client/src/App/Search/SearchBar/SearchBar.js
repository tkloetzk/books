import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, TextField, Typography } from '@material-ui/core';
import { getAmazonSingleBook } from '../../../store/amazon/amazonActions';
import {
  getGoodreadsBooks,
  getGoodreadsBook,
} from '../../../store/goodreads/goodreadsActions';
import { saveCombinedBooks } from '../../../store/bookshelf/bookshelfActions';
import { getGoogleBook } from '../../../store/google/googleActions';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LOADING_STATUSES } from '../../../util/constants';
import forEach from 'lodash/forEach';
import InitialIcon from '@material-ui/icons/RadioButtonUnchecked';
import DoneIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import remove from 'lodash/remove';

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
  buttonProgress: {
    color: 'green',
    position: 'relative',
    marginTop: 30,
    marginLeft: -59,
  },
  tooltipDiv: {
    zIndex: '1',
    position: 'absolute',
    width: 180,
    marginTop: -36,
  },
});

function TooltipProgress(props) {
  const { progress } = props;
  const green = { color: 'green' };
  if (progress === LOADING_STATUSES.initial)
    return <InitialIcon style={green} fontSize="small" />;

  if (progress === LOADING_STATUSES.loading) {
    return (
      <CircularProgress
        size={18}
        style={{ color: 'yellow', marginTop: '1px' }}
        thickness={4}
      />
    );
  }
  if (progress === LOADING_STATUSES.success) return <DoneIcon style={green} />;
  if (progress === LOADING_STATUSES.errored)
    return <ErrorIcon style={{ color: 'red' }} />;
}
function TooltipContent(props) {
  if (!props.content) {
    return null;
  }
  return (
    <div style={{ width: 100 }}>
      {props.content.map(tooltip => (
        <span
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          key={tooltip.label}
        >
          <Typography style={{ color: 'white' }}>{tooltip.label}</Typography>
          <TooltipProgress progress={tooltip.loading} />
        </span>
      ))}
    </div>
  );
}
function compareDifferences(oldBook, newBook, difference) {
  Object.keys(oldBook).forEach(key => {
    if (typeof oldBook[key] !== 'object') {
      if (
        oldBook[key] != newBook[key] &&
        key !== '_id' &&
        key !== '__v' &&
        key !== 'adjustedRating'
      )
        difference.push({
          key,
          currentValue: oldBook[key],
          newValue: newBook[key],
        });
    } else {
      compareDifferences(oldBook[key], newBook[key], difference);
    }
  }, difference);

  return difference;
}
class SearchBar extends Component {
  state = {
    searchIsbns: [],
    duplicatedISBNs: [],
    multiline: '',
    loading: false,
    success: null,
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps) {
    const {
      amazonBooks,
      goodreadsBooks,
      googleBooks,
      booklist,
      bookshelf,
    } = this.props;

    if (
      amazonBooks !== prevProps.amazonBooks &&
      amazonBooks.length &&
      googleBooks.length &&
      goodreadsBooks.length &&
      amazonBooks.length === googleBooks.length
    ) {
      const combinedBooks = [amazonBooks, googleBooks, goodreadsBooks].reduce(
        (a, b) => a.map((c, i) => Object.assign({}, c, b[i]))
      );

      const duplicates = combinedBooks.filter(duplicatedBook => {
        return bookshelf.some(existingBook => {
          if (existingBook.isbn === duplicatedBook.isbn) {
            remove(combinedBooks, duplicatedBook);
            duplicatedBook.differences = compareDifferences(
              existingBook,
              duplicatedBook,
              []
            );

            // TODO: If duplicate but no differences exist, don't add but show notification
            if (duplicatedBook.differences.length) {
              return duplicatedBook;
            } else {
              this.setState({
                duplicatedISBNs: [
                  ...this.state.duplicatedISBNs,
                  duplicatedBook.isbn,
                ],
              });
            }
          }
        });
      });
      console.log('combinedBooks', combinedBooks);
      console.log('duplicates', duplicates);

      this.props.saveCombinedBooks(combinedBooks);
      //this.props.saveDuplicatedBooks(duplicates)
    }
    if (booklist !== prevProps.booklist) {
      this.setState({ success: true, loading: false });
    }
  }
  handleChange = name => event => {
    this.setState({
      multiline: event.target.value,
    });
  };

  search = () => {
    const isbns = this.state.multiline.split(/[\n, ]/);
    if (!this.state.loading) {
      this.setState({ success: false, loading: true, searchIsbns: isbns });
    }

    Promise.all(
      forEach(isbns, isbn => {
        const formattedIsbn = isbn.replace(/[- ]/g, '');
        return [
          this.props.getAmazonSingleBook(formattedIsbn),
          this.props.getGoogleBook(formattedIsbn),
          this.props.getGoodreadsBook(formattedIsbn),
        ];
      })
    );
  };

  onSave = () => {
    console.log('save');
  };
  render() {
    const {
      classes,
      amazonBookLoading,
      goodreadsBookLoading,
      googleBookLoading,
    } = this.props;
    const { loading } = this.state;
    const tooltipObj = [
      { label: 'Amazon', loading: amazonBookLoading },
      { label: 'Goodreads', loading: goodreadsBookLoading },
      { label: 'Google', loading: googleBookLoading },
    ];
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
        <span
          data-tip
          data-for="searchButtonWrapper"
          style={{ display: 'flex' }}
        >
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={this.search}
            disabled={loading}
          >
            Search
          </Button>
        </span>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        <ReactTooltip
          id="searchButtonWrapper"
          place="right"
          effect="solid"
          getContent={() => <TooltipContent content={tooltipObj} />}
        />
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
    amazonBookLoading: state.amazon.isLoading,
    googleBooks: state.google.books,
    goodreadsBookLoading: state.goodreads.isLoading,
    goodreadsBooks: state.goodreads.books,
    googleBookLoading: state.google.isLoading,
    booklist: state.bookshelf.booklist,
    bookshelf: state.bookshelf.bookshelf,
  };
};
const mapDispatchToProps = {
  getAmazonSingleBook,
  getGoodreadsBooks,
  getGoodreadsBook,
  getGoogleBook,
  saveCombinedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));
