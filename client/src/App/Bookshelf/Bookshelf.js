import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import Filters from './Filters/Filters';
import {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
  clearBooks,
} from '../../store/bookshelf/bookshelfActions';
import { getAmazonBook } from '../../store/amazon/amazonActions';
import { getGoodreadsBook } from '../../store/goodreads/goodreadsActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';
import map from 'lodash/map';
import assign from 'lodash/assign';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import Fab from '@material-ui/core/Fab';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import merge from 'lodash/merge';
import keys from 'lodash/keys';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '../Tooltip/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactTooltip from 'react-tooltip';
import { LOADING_STATUSES } from '../../util/constants';
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'

export class Bookshelf extends Component {
  state = {
    completed: 0,
    bookshelf: [],
    bookshelfToUpdate: [],
    allDifferencesArray: [],
    loading: LOADING_STATUSES.initial,
    amazonBookLoading: LOADING_STATUSES.initial,
    goodreadsBookLoading: LOADING_STATUSES.initial,
  };

  componentDidMount() {
    this.props.getBookshelf()
  }

  componentDidUpdate(prevProps, prevState) {
    const { clearBooks, getBookshelf, selectedGenres, propBookshelf } = this.props;
    const {
      amazonBookLoading,
      goodreadsBookLoading,
      bookshelfToUpdate,
      completed,
      bookshelf,
      allDifferencesArray,
    } = this.state;

    if (prevProps.propBookshelf.length && !bookshelf.length) {
      this.setState({
        bookshelf: propBookshelf
      })
    }
    if (bookshelfToUpdate.length && !prevState.bookshelfToUpdate.length) {
      this.createPromiseArray();
    }

    if (
      bookshelfToUpdate.length &&
      prevState.bookshelfToUpdate.length &&
      amazonBookLoading === LOADING_STATUSES.success &&
      goodreadsBookLoading === LOADING_STATUSES.success
    ) {
      
      this.findAndMergeInUpdates();
    }

    if (completed === 100 && prevState.completed !== 100) {
      this.setState({ loading: LOADING_STATUSES.success });
      if (allDifferencesArray.length > 0) {
        getBookshelf(selectedGenres);
        this.setState({ allDifferencesArray: [] });
      }
      clearBooks();
    }

    // Genre Selection has changed
    if (!isEqual(selectedGenres, prevProps.selectedGenres) || (prevProps.propBookshelf.length && !isEqual(prevProps.propBookshelf, propBookshelf))) {
      const selectedBooks = []
      forEach(propBookshelf, (book) => {
        forEach(book.categories, category => {
          if (selectedGenres.includes(category) && !selectedBooks.includes(book)) {
            selectedBooks.push(book)
          }
        })
      })
      this.setState({bookshelf: selectedBooks})
    }
  }

  handleSave = (book, edits) => {
    const { getBookshelf, selectedGenres, updateBookOnBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });

    updateBookOnBookshelf(book._id, assign(...fields), false).then(() => {
      getBookshelf(selectedGenres);
    });
  };

  updateProgressState = count => {
    if (count <= 100 && count > this.state.completed) {
      this.setState({ completed: count });
    }
  };

  refreshBookshelf = () => {
    const { bookshelf } = this.state
    const { filters } = this.props;

    this.setState({
      completed: 0,
      loading: LOADING_STATUSES.loading,
      amazonBookLoading: LOADING_STATUSES.loading,
      goodreadsBookLoading: LOADING_STATUSES.loading,
    });

    const filteredArray = [];
    const booksToUpdate = [];
    forEach(filters, filter => {
      if (filter.value) filteredArray.push(filter.key);
    });
    if (filteredArray.length) {
      forEach(bookshelf, book => {
        forEach(filteredArray, filter => {
          if (book[filter]) {
            booksToUpdate.push(book);
          }
        });
      });
    }
    this.setState({
      bookshelfToUpdate: booksToUpdate.length ? booksToUpdate : bookshelf,
    });
  };

  createPromiseArray = () => {
    const { bookshelfToUpdate } = this.state;
    const { getAmazonBook, getGoodreadsBook } = this.props;

    let count = 0;
    const amazonPromiseArray = [];
    const goodreadsPromiseArray = [];
    forEach(bookshelfToUpdate, book => {
      amazonPromiseArray.push(
        getAmazonBook(book.isbn).then(val => {
          this.updateProgressState(
            (++count / (bookshelfToUpdate.length * 2.125)) * 100
          );
          return val;
        })
      );
      goodreadsPromiseArray.push(
        getGoodreadsBook(book.isbn).then(val => {
          this.updateProgressState(
            (++count / (bookshelfToUpdate.length * 2.125)) * 100
          );
          return val;
        })
      );
    });
    Promise.all(amazonPromiseArray).then(() =>
      this.setState({
        amazonBookLoading: LOADING_STATUSES.success,
      })
    );
    Promise.all(goodreadsPromiseArray).then(() => {
      this.setState({
        goodreadsBookLoading: LOADING_STATUSES.success,
      });
    });
  };

  findAndMergeInUpdates = () => {
    const { bookshelfToUpdate } = this.state;
    const { amazonBooks, goodreadsBooks, updateBookOnBookshelf } = this.props;
    const combinedBooks = merge(amazonBooks, goodreadsBooks);

    const promiseArray = [];
    const allDifferencesArray = [];
    forEach(combinedBooks, updatedBook => {
      const bookDifferences = [];
      const existingBook = find(bookshelfToUpdate, ['isbn', updatedBook.isbn]);

      if (existingBook) {
        forEach(keys(updatedBook), key => {
          if (key !== 'price' && key !== 'isbn') {
            if (
              updatedBook[key] &&
              updatedBook[key] > 0 &&
              existingBook[key] !== updatedBook[key]
            ) {
              bookDifferences.push({ [key]: updatedBook[key] });
            }
          }
        });
      }
      if (bookDifferences.length) {
        allDifferencesArray.push({
          id: existingBook._id,
          differences: bookDifferences,
        });
      }
    });

    if (allDifferencesArray.length > 0) {
      this.setState({ allDifferencesArray });
      const progress =
        (100 - this.state.completed) / allDifferencesArray.length;
      //TODO: What if a service errors, what happens?
      forEach(allDifferencesArray, diff => {
        promiseArray.push(
          updateBookOnBookshelf(diff.id, assign(...diff.differences)).then(
            val => {
              const { completed } = this.state;
              if (completed + progress < 100)
                this.updateProgressState(completed + progress);
              return val;
            }
          )
        );
      });
    }
    this.setState({
      bookshelfToUpdate: [],
    });
    Promise.all(promiseArray).then(() => {
      this.setState({
        completed: 100,
      });
    });
  };

  render() {
    const {
      completed,
      bookshelf,
      loading,
      amazonBookLoading,
      goodreadsBookLoading,
    } = this.state;
    const { classes, active, deleteBookOnBookshelf } = this.props;

    let headers = [
      { label: 'ISBN', key: 'isbn' },
      { label: 'Title', key: 'title' },
      { label: 'Subtitle', key: 'subtitle' },
      { label: 'Categories', key: 'categories' },
      { label: 'Amazon Average Rating', key: 'amazonAverageRating' },
      { label: 'Amazon Ratings Count', key: 'amazonRatingsCount' },
      { label: 'Goodreads Average Rating', key: 'goodreadsAverageRating' },
      { label: 'Goodreads Ratings Count', key: 'goodreadsRatingsCount' },
      { label: 'Adjusted Rating', key: 'adjustedRating' },
      { label: 'Read', key: 'read' },
      { label: 'Owned', key: 'owned' },
      // TODO: Include Amazon link instead of description
    ];

    const tooltipObj = [
      { label: 'Amazon', loading: amazonBookLoading },
      { label: 'Goodreads', loading: goodreadsBookLoading },
    ];

    return (
      <React.Fragment>
        <LinearProgress variant="determinate" value={completed} />
        <div className={classes.genreBar}>
          <GenreSelector />
          {bookshelf.length > 0 && (
            <div>
              <Filters />
              <CSVLink data={bookshelf} headers={headers}>
                <Fab size="small">
                  <DownloadIcon fontSize="small" />
                </Fab>
              </CSVLink>

              <span data-tip data-for="refreshBookshelfButtonWrapper">
                <Fab
                  size="small"
                  onClick={() => this.refreshBookshelf()}
                  style={{
                    marginLeft: '11px',
                    backgroundColor: 'black',
                    color: 'white',
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </Fab>
              </span>
              {loading !== LOADING_STATUSES.initial && (
                <React.Fragment>
                  {loading === LOADING_STATUSES.loading && (
                    <CircularProgress size={24} />
                  )}
                  <ReactTooltip
                    id="refreshBookshelfButtonWrapper"
                    place="right"
                    effect="solid"
                    getContent={() => <Tooltip content={tooltipObj} />}
                  />
                </React.Fragment>
              )}
            </div>
          )}
        </div>
        {active && (
          <Results
            booklist={bookshelf}
            handleSave={(book, edits) => this.handleSave(book, edits)}
            handleDelete={book => deleteBookOnBookshelf(book._id)}
          />
        )}
      </React.Fragment>
    );
  }
}

const styles = {
  genreBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10px',
    flexDirection: 'column',
  },
};

export const mapStateToProps = state => ({
  propBookshelf: state.bookshelf.bookshelf,
  amazonBooks: state.amazon.books,
  amazonBookErrored: state.amazon.hasErrored,
  goodreadsBooks: state.goodreads.books,
  goodreadsBooksErrored: state.goodreads.hasErrored,
  selectedGenres: state.bookshelf.selectedGenres,
  filters: state.bookshelf.filters,
});

const mapDispatchToProps = {
  getBookshelf,
  deleteBookOnBookshelf,
  updateBookOnBookshelf,
  getAmazonBook,
  getGoodreadsBook,
  clearBooks,
};

Bookshelf.defaultProps = {
  propBookshelf: [],
  selectedGenres: [],
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Bookshelf));
