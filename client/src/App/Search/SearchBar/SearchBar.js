import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, TextField, Typography } from '@material-ui/core';
import { getAmazonSingleBook } from '../../../store/amazon/amazonActions';
import {
  getGoodreadsBooks,
  getGoodreadsBook,
} from '../../../store/goodreads/goodreadsActions';
import {
  saveCombinedBooks,
  saveModifiedBooks,
  addBookToBookshelf,
  updateBookOnBookshelf,
} from '../../../store/bookshelf/bookshelfActions';
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
import mergeByKey from 'array-merge-by-key';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import map from 'lodash/map';
import assign from 'lodash/assign';
import Notification from '../../Notification/Notification';

// TODO: This file is getting huge
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
  fab: {
    alignSelf: 'flex-end',
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
        key !== '__v' &&
        key !== '_id' &&
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
      saveModifiedBooks,
      saveCombinedBooks,
    } = this.props;

    if (
      amazonBooks !== prevProps.amazonBooks &&
      amazonBooks.length &&
      googleBooks.length &&
      goodreadsBooks.length &&
      amazonBooks.length === googleBooks.length
    ) {
      const combinedBooks = mergeByKey(
        'isbn',
        amazonBooks,
        googleBooks,
        goodreadsBooks
      );

      // TODO: This all probably could be better
      let duplicates = [];
      forEach(combinedBooks, duplicatedBook => {
        return forEach(bookshelf, existingBook => {
          if (duplicatedBook.isbn === existingBook.isbn) {
            duplicatedBook.differences = compareDifferences(
              existingBook,
              duplicatedBook,
              []
            );
            // TODO: If duplicate but no differences exist, don't add but show notification
            if (duplicatedBook.differences.length) {
              duplicatedBook._id = existingBook._id;
              duplicates.push(duplicatedBook);
            } else {
              this.state.duplicatedISBNs.push({ isbn: duplicatedBook.isbn });
            }
          }
        });
      });
      forEach([...duplicates, ...this.state.duplicatedISBNs], duplicate =>
        forEach([...combinedBooks], obj =>
          obj.isbn === duplicate.isbn ? remove(combinedBooks, obj) : null
        )
      );

      saveModifiedBooks(duplicates);
      saveCombinedBooks(combinedBooks);
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

  handleSave = () => {
    const {
      booklist,
      modifiedBooklist,
      addBookToBookshelf,
      updateBookOnBookshelf,
    } = this.props;
    if (modifiedBooklist.length) {
      Promise.all(
        forEach(modifiedBooklist, book => {
          const fields = map(book.differences, diff => {
            return { [diff.key]: diff.newValue };
          });
          return updateBookOnBookshelf(book._id, assign(...fields));
        })
      );
    }
    addBookToBookshelf(booklist).then(res => window.scrollTo(0, 0));
  };

  onClose = () => {
    this.setState({ duplicatedISBNs: [] });
  };
  render() {
    const {
      classes,
      amazonBookLoading,
      goodreadsBookLoading,
      googleBookLoading,
    } = this.props;
    const { loading, duplicatedISBNs } = this.state;
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
        <Fab color="primary" aria-label="Save" className={classes.fab}>
          <SaveIcon onClick={this.handleSave} />
        </Fab>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        <ReactTooltip
          id="searchButtonWrapper"
          place="right"
          effect="solid"
          getContent={() => <TooltipContent content={tooltipObj} />}
        />
        <Notification
          open={false}
          //open={duplicatedISBNs.length ? true : false}
          handleClose={this.onClose}
          autoHideDuration={3500}
          message={`${duplicatedISBNs.join(
            ', '
          )} already shelved with no differences`}
          type="info"
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
    modifiedBooklist: state.bookshelf.modifiedBooklist,
  };
};
const mapDispatchToProps = {
  getAmazonSingleBook,
  getGoodreadsBooks,
  getGoodreadsBook,
  getGoogleBook,
  saveCombinedBooks,
  saveModifiedBooks,
  addBookToBookshelf,
  updateBookOnBookshelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));
