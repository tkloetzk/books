import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import Filters from './Filters/Filters';
import {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
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

export class Bookshelf extends Component {
  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate() {
    const { amazonBooks, goodreadsBooks, bookshelf } = this.props;

    if (
      amazonBooks.length === bookshelf.length &&
      goodreadsBooks.length === bookshelf.length
    ) {
      // TODO: This all probably could be better
      const { combinedBooks, duplicates, duplicatedISBNs } = util.combineBooks(
        amazonBooks,
        goodreadsBooks,
        bookshelf
      );

      forEach(combinedBooks, combinedBook => {
        const bookshelfBook = find(bookshelf, ['isbn', combinedBook.isbn]);
        console.log(combinedBook, bookshelfBook);
      });
      //  console.log('combinedBooks', combinedBooks);
      console.log('duplicates', duplicates);
      console.log('duplicatedISBNs', duplicatedISBNs);
      //console.log('bookshelf', bookshelf);
    }
  }

  handleSave = (book, edits) => {
    const { updateBookOnBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });
    updateBookOnBookshelf(book._id, assign(...fields));
  };

  refreshBookshelf = () => {
    const { getAmazonBook, bookshelf, getGoodreadsBook } = this.props;
    // if (!loading) {
    //   this.setState({
    //     success: false,
    //     loading: true,
    //     searchIsbns: isbns,
    //     goodreadsBookLoading: LOADING_STATUSES.loading,
    //     amazonBookLoading: LOADING_STATUSES.loading,
    //   });
    // }

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
              onClick={this.refreshBookshelf}
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
  amazonBookErrored: state.amazon.hasErrored,
  googleBooks: state.google.books,
  googleBooksErrored: state.google.hasErrored,
  goodreadsBooks: state.goodreads.books,
  goodreadsBooksErrored: state.goodreads.hasErrored,
});

const mapDispatchToProps = {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
  getAmazonBook,
  getGoodreadsBook,
};

Bookshelf.defaultProps = {
  bookshelf: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Bookshelf));
