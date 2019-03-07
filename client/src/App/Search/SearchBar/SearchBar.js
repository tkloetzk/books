import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getAmazonSingleBook } from '../../../store/amazon/amazonActions';
import { getGoodreadsBook } from '../../../store/goodreads/goodreadsActions';
import {
  saveCombinedBooks,
  saveModifiedBooks,
  addBookToBookshelf,
  updateBookOnBookshelf,
  clearBooks,
  insertModifiedBook,
} from '../../../store/bookshelf/bookshelfActions';
import { getGoogleBook } from '../../../store/google/googleActions';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LOADING_STATUSES } from '../../../util/constants';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import map from 'lodash/map';
import assign from 'lodash/assign';
import Notification from '../../Notification/Notification';
import util from '../../../util/combineBooks';
import Tooltip from '../../Tooltip/Tooltip';

// TODO: This file is getting huge
const styles = {
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
    alignSelf: 'center',
    marginLeft: '10px',
  },
};

export class SearchBar extends Component {
  state = {
    searchIsbns: [],
    duplicatedISBNs: [],
    multiline: '',
    loading: false,
    success: null,
    amazonBookLoading: LOADING_STATUSES.initial,
    goodreadsBookLoading: LOADING_STATUSES.initial,
    googleBookLoading: LOADING_STATUSES.initial,
  };

  componentDidUpdate(prevProps) {
    const {
      amazonBooks,
      goodreadsBooks,
      googleBooks,
      bookshelf,
      saveModifiedBooks,
      saveCombinedBooks,
      amazonBookErrored,
      goodreadsBooksErrored,
      googleBooksErrored,
      clearBooks,
      insertModifiedBook,
    } = this.props;
    const {
      searchIsbns,
      loading,
      amazonBookLoading,
      goodreadsBookLoading,
      googleBookLoading,
    } = this.state;

    if (searchIsbns.length) {
      if (
        amazonBooks.length === searchIsbns.length &&
        prevProps.amazonBooks.length !== amazonBooks.length
      ) {
        this.setState({ amazonBookLoading: LOADING_STATUSES.success });
      }
      if (
        goodreadsBooks.length === searchIsbns.length &&
        prevProps.goodreadsBooks.length !== goodreadsBooks.length
      ) {
        this.setState({ goodreadsBookLoading: LOADING_STATUSES.success });
      }
      if (
        googleBooks.length === searchIsbns.length &&
        prevProps.googleBooks.length !== googleBooks.length
      ) {
        this.setState({ googleBookLoading: LOADING_STATUSES.success });
      }
    }
    if (amazonBookErrored && amazonBookLoading !== LOADING_STATUSES.errored) {
      this.setState({
        loading: false,
        amazonBookLoading: LOADING_STATUSES.errored,
      });
    }
    if (
      goodreadsBooksErrored &&
      goodreadsBookLoading !== LOADING_STATUSES.errored
    ) {
      this.setState({
        loading: false,
        goodreadsBookLoading: LOADING_STATUSES.errored,
      });
    }
    if (googleBooksErrored && googleBookLoading !== LOADING_STATUSES.errored) {
      this.setState({
        loading: false,
        googleBookLoading: LOADING_STATUSES.errored,
      });
    }

    if (
      amazonBooks.length === searchIsbns.length &&
      googleBooks.length === searchIsbns.length &&
      goodreadsBooks.length === searchIsbns.length &&
      loading
    ) {
      // TODO: This all probably could be better
      const { combinedBooks, duplicates, duplicatedISBNs } = util.combineBooks(
        amazonBooks,
        googleBooks,
        goodreadsBooks,
        bookshelf
      );
      // TODO: What's this doing again?
      forEach([...duplicates, ...duplicatedISBNs], duplicate =>
        forEach([...combinedBooks], obj =>
          obj.isbn === duplicate.isbn ? remove(combinedBooks, obj) : null
        )
      );

      if (duplicates.length) {
        if (prevProps.modifiedBooklist.length) {
          insertModifiedBook(duplicates);
        } else {
          saveModifiedBooks(duplicates);
        }
      }
      if (combinedBooks.length) {
        saveCombinedBooks(combinedBooks);
      }
      clearBooks();
      this.setState({ success: true, loading: false, multiline: '' });
    }
  }
  handleChange = event => {
    this.setState({
      multiline: event.target.value,
    });
  };

  handleSearch = () => {
    const { getAmazonSingleBook, getGoogleBook, getGoodreadsBook } = this.props;
    const { multiline, loading } = this.state;
    const isbns = multiline.split(/[\n, ]/).filter(v => v !== '');
    if (!loading) {
      this.setState({
        success: false,
        loading: true,
        searchIsbns: isbns,
        goodreadsBookLoading: LOADING_STATUSES.loading,
        googleBookLoading: LOADING_STATUSES.loading,
        amazonBookLoading: LOADING_STATUSES.loading,
      });
    }

    Promise.all(
      forEach(isbns, isbn => {
        const formattedIsbn = isbn.replace(/[- ]/g, '');
        return [
          getAmazonSingleBook(formattedIsbn),
          getGoogleBook(formattedIsbn),
          getGoodreadsBook(formattedIsbn),
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
    const { classes, booklist } = this.props;
    const {
      loading,
      duplicatedISBNs,
      amazonBookLoading,
      goodreadsBookLoading,
      googleBookLoading,
      multiline,
    } = this.state;
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
          value={multiline}
          onChange={event => this.handleChange(event)}
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
            onClick={this.handleSearch}
            disabled={loading || !multiline.length}
          >
            Search
          </Button>
        </span>
        {booklist.length > 0 && (
          <Fab color="primary" aria-label="Save" className={classes.fab}>
            <SaveIcon onClick={this.handleSave} />
          </Fab>
        )}
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        <ReactTooltip
          id="searchButtonWrapper"
          place="right"
          effect="solid"
          getContent={() => <Tooltip content={tooltipObj} />}
        />
        <Notification
          open={false}
          //open={duplicatedISBNs.length ? true : false}
          handleClose={this.onClose}
          autoHideDuration={3500}
          message={`${duplicatedISBNs.join(
            ', '
          )} already shelved with no differences`}
          type={LOADING_STATUSES.info}
        />
      </form>
    );
  }
}

SearchBar.defaultProps = {
  classes: {},
  booklist: [],
  amazonBooks: [],
  googleBooks: [],
  goodreadsBooks: [],
  amazonBookErrored: false,
};

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  amazonBooks: PropTypes.array,
  booklist: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    amazonBooks: state.amazon.books,
    amazonBookErrored: state.amazon.hasErrored,
    googleBooks: state.google.books,
    googleBooksErrored: state.google.hasErrored,
    goodreadsBooks: state.goodreads.books,
    goodreadsBooksErrored: state.goodreads.hasErrored,
    booklist: state.bookshelf.booklist,
    bookshelf: state.bookshelf.bookshelf,
    modifiedBooklist: state.bookshelf.modifiedBooklist,
  };
};
const mapDispatchToProps = {
  getAmazonSingleBook,
  getGoodreadsBook,
  getGoogleBook,
  saveCombinedBooks,
  saveModifiedBooks,
  addBookToBookshelf,
  updateBookOnBookshelf,
  clearBooks,
  insertModifiedBook,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));
