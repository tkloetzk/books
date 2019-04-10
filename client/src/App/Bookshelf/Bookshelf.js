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


export class Bookshelf extends Component {
  state = {
    completed: 0,
    progressStatus: 'initial'
  };

  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate(prevProps, prevState) {
    const { progressStatus } = this.state
    const { amazonBooks, goodreadsBooks, bookshelf, getBookshelf } = this.props

    // Getting all the bookshelf values from amazon and goodreads has finished
    if (progressStatus === 'refreshEnded' && prevState.progressStatus === 'refreshStarted' &&
      amazonBooks.length === bookshelf.length && goodreadsBooks.length === bookshelf.length) {
      this.findAndMergeInUpdates()
    }

    // If merge has finished, refresh the bookshelf
    if (progressStatus === 'mergeEnded' && prevState.progressStatus !== 'mergeEnded') {
      getBookshelf()
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

  findAndMergeInUpdates = () => {
    const {
      amazonBooks,
      goodreadsBooks,
      bookshelf,
      clearBooks,
      updateBookOnBookshelf,
    } = this.props;
    this.setState({ progressStatus: 'mergeStarted'})
    const combinedBooks = merge(amazonBooks, goodreadsBooks);

    const promiseArray = [];
    const allDifferencesArray = [];
    forEach(combinedBooks, updatedBook => {
      const bookDifferences = [];
      const existingBook = find(bookshelf, ['isbn', updatedBook.isbn]);

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
        allDifferencesArray.push({ id: existingBook._id, differences: bookDifferences });
      }
    });

    if (allDifferencesArray.length > 0) {
      const progress = (100 - this.state.completed) / allDifferencesArray.length;
      //TODO: What if a service errors, what happens?
      forEach(allDifferencesArray, diff => {
        promiseArray.push(
          updateBookOnBookshelf(diff.id, assign(...diff.differences)).then(
            val => {
              const { completed } = this.state;
              if (completed + progress < 100)
                this.progress(completed + progress);
              return val;
            }
          )
        );
      });
      Promise.all(promiseArray)
    }
    clearBooks();
    this.setState({ completed: 100, progressStatus: 'mergeEnded'})
  }

  refreshBookshelf = () => {
    const { getAmazonBook, bookshelf, getGoodreadsBook } = this.props;

    this.setState({ progressStatus: 'refreshStarted', completed: 0 });
    let count = 0;
     const promiseArray = [];
     forEach(bookshelf, book => {
       promiseArray.push(
         getAmazonBook(book.isbn).then(val => {
           this.updatePogressState((++count / (bookshelf.length * 2.125)) * 100);
           return val;
         })
       );
       promiseArray.push(
         getGoodreadsBook(book.isbn).then(val => {
           this.updatePogressState((++count / (bookshelf.length * 2.125)) * 100);
           return val;
         })
       );
     });
     Promise.all(promiseArray).then(() => this.setState({
       progressStatus: 'refreshEnded',
     }))
  };
  render() {
    const { completed, color } = this.state;
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
