import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import {
  getBookshelf,
  updateBookOnBookshelf,
  deleteBookOnBookshelf,
} from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';
import map from 'lodash/map';
import assign from 'lodash/assign';
import { CSVLink } from 'react-csv';

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

  // TODO: This is being rendered twice
  render() {
    const { bookshelf, active, deleteBookOnBookshelf } = this.props;
    return (
      <React.Fragment>
        <CSVLink data={bookshelf}>Download CSV</CSVLink>;
        <GenreSelector />
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

const mapStateToProps = state => {
  return {
    bookshelf: state.bookshelf.bookshelf, // TODO: better naming?
  };
};

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
)(Bookshelf);
