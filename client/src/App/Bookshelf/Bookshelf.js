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

export class Bookshelf extends Component {
  state = {
    completed: 0,
    progressStatus: 'initial',
    bookshelfToUpdate: [],
    loading: LOADING_STATUSES.initial,
    amazonBookLoading: LOADING_STATUSES.initial,
    goodreadsBookLoading: LOADING_STATUSES.initial,
  };

  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      progressStatus,
      bookshelfToUpdate,
      amazonBookLoading,
      goodreadsBookLoading,
      loading,
    } = this.state;
    const {
      amazonBooks,
      goodreadsBooks,
      getBookshelf,
      clearBooks,
      selectedGenres,
    } = this.props;

    if (
      progressStatus === 'booksToUpdateFinished' &&
      prevState.progressStatus !== 'booksToUpdateFinished'
    ) {
      this.createPromiseArray();
    }
    // Getting all the bookshelf values from amazon and goodreads has finished
    if (
      amazonBooks.length &&
      bookshelfToUpdate.length &&
      progressStatus !== 'mergeStarted' &&
      amazonBooks.length === bookshelfToUpdate.length &&
      goodreadsBooks.length === bookshelfToUpdate.length
    ) {
      this.findAndMergeInUpdates();
    }

    if (
      amazonBookLoading === LOADING_STATUSES.success &&
      goodreadsBookLoading === LOADING_STATUSES.success &&
      loading !== LOADING_STATUSES.success
    ) {
      this.setState({
        loading: LOADING_STATUSES.success,
      });
    }

    // If merge has finished, refresh the bookshelf
    if (
      progressStatus === 'mergeEnded' &&
      prevState.progressStatus !== 'mergeEnded'
    ) {
      clearBooks();
      getBookshelf(selectedGenres);
    }
  }

  handleSave = (book, edits) => {
    const { updateBookOnBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });

    updateBookOnBookshelf(book._id, assign(...fields), false);
  };

  updatePogressState = count => {
    console.log('count', count);
    if (count <= 100) {
      this.setState({ completed: count });
    }
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
          this.updatePogressState(
            (++count / (bookshelfToUpdate.length * 2.125)) * 100
          );
          return val;
        })
      );
      goodreadsPromiseArray.push(
        getGoodreadsBook(book.isbn).then(val => {
          this.updatePogressState(
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
    Promise.all(goodreadsPromiseArray).then(() =>
      this.setState({
        goodreadsBookLoading: LOADING_STATUSES.success,
      })
    );
  };

  findAndMergeInUpdates = () => {
    console.log('in find merge');
    const { bookshelfToUpdate } = this.state;
    const {
      amazonBooks,
      goodreadsBooks,
      updateBookOnBookshelf,
      bookshelf,
    } = this.props;
    this.setState({ progressStatus: 'mergeStarted' });
    const combinedBooks = merge(amazonBooks, goodreadsBooks);

    const promiseArray = [];
    const allDifferencesArray = [];
    forEach(combinedBooks, updatedBook => {
      console.log('updatedBook');
      const bookDifferences = [];
      const existingBook = find(bookshelfToUpdate, ['isbn', updatedBook.isbn]);

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
      if (bookDifferences.length) {
        allDifferencesArray.push({
          id: existingBook._id,
          differences: bookDifferences,
        });
      }
    });

    if (allDifferencesArray.length > 0) {
      const progress =
        (100 - this.state.completed) / allDifferencesArray.length;
      //TODO: What if a service errors, what happens?
      forEach(allDifferencesArray, diff => {
        promiseArray.push(
          updateBookOnBookshelf(diff.id, assign(...diff.differences)).then(
            val => {
              const { completed } = this.state;
              if (completed + progress < 100)
                this.updatePogressState(completed + progress);
              return val;
            }
          )
        );
      });
    }
    Promise.all(promiseArray).then(() => {
      this.setState({
        completed: 100,
        progressStatus: 'mergeEnded',
        bookshelfToUpdate: [],
      });
    });
  };

  refreshBookshelf = () => {
    const { bookshelfToUpdate } = this.state;
    const { bookshelf, filters } = this.props;

    this.setState({
      progressStatus: 'refreshStarted',
      completed: 0,
      loading: LOADING_STATUSES.loading,
      amazonBookLoading: LOADING_STATUSES.loading,
      goodreadsBookLoading: LOADING_STATUSES.loading,
    });

    const filteredArray = [];
    forEach(filters, filter => {
      if (filter.value) filteredArray.push(filter.key);
    });
    if (filteredArray.length) {
      forEach(bookshelf, book => {
        forEach(filteredArray, filter => {
          if (book[filter]) {
            let booksToUpdate = [...this.state.bookshelfToUpdate];

            // Add item to it
            booksToUpdate.push(book);

            // Set state
            this.setState({ bookshelfToUpdate: booksToUpdate });
          }
        });
      });
      this.setState({
        progressStatus: 'booksToUpdateFinished',
      });
    } else {
      this.setState({
        bookshelfToUpdate: bookshelf,
        progressStatus: 'booksToUpdateFinished',
      });
    }
  };

  render() {
    const {
      completed,
      loading,
      amazonBookLoading,
      goodreadsBookLoading,
    } = this.state;
    const { classes, bookshelf, active, deleteBookOnBookshelf } = this.props;

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
  bookshelf: state.bookshelf.bookshelf, // TODO: better naming?
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
  bookshelf: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Bookshelf));
