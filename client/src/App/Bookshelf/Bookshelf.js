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
import util from '../../util/combineBooks';
import find from 'lodash/find';
import merge from 'lodash/merge'
import keys from 'lodash/keys'

export class Bookshelf extends Component {
  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate(prevProps, prevState) {
    const { amazonBooks, goodreadsBooks, bookshelf, updateBookOnBookshelf, clearBooks } = this.props;

    if (
      amazonBooks.length === bookshelf.length &&
      goodreadsBooks.length === bookshelf.length
    ) {
      const combinedBooks = merge(amazonBooks, goodreadsBooks)
      forEach(combinedBooks, updatedBook => {
        const differences = []
        const existingBook = find(bookshelf, ['isbn', updatedBook.isbn]);
        forEach(keys(updatedBook), key => {
          if (key !== 'price' && key !== 'isbn') {
            if (updatedBook[key] && updatedBook[key] > 0 && existingBook[key] !== updatedBook[key]) {
              differences.push({[key]: updatedBook[key]})
            }
          }
        })
        if (differences.length > 0) {
          //TODO: What if a service errors, what happens?
          updateBookOnBookshelf(existingBook._id, assign(...differences), true)
        }
      })
      clearBooks();
    }
  }

  handleSave = (book, edits) => {
    const { updateBookOnBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });

    updateBookOnBookshelf(book._id, assign(...fields), false);
  };

  refreshBookshelf = () => {
    const { getAmazonBook, bookshelf, getGoodreadsBook } = this.props;

    Promise.all(
      forEach(bookshelf, book => {
        return [getAmazonBook(book.isbn), getGoodreadsBook(book.isbn)];
      })
    );
  };
  render() {
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
        <div className={classes.genreBar}>
          <div>
            <GenreSelector />
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
          <Filters />
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
//  amazonBookErrored: state.amazon.hasErrored,
  goodreadsBooks: state.goodreads.books,
  //goodreadsBooksErrored: state.goodreads.hasErrored,
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
