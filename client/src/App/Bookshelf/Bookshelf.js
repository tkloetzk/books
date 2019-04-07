import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import Filters from './Filters/Filters';
import {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
} from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';
import map from 'lodash/map';
import assign from 'lodash/assign';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import Fab from '@material-ui/core/Fab';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@material-ui/icons/SaveAlt';

export class Bookshelf extends Component {
  componentDidMount() {
    this.props.getBookshelf();
  }

  handleSave = (book, edits) => {
    const { updateBookOnBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });
    updateBookOnBookshelf(book._id, assign(...fields));
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
});

const mapDispatchToProps = {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
};

Bookshelf.defaultProps = {
  bookshelf: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Bookshelf));
