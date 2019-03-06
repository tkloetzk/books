import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import {
  getBookshelf,
  updateBookOnBookshelf,
} from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';
import map from 'lodash/map';
import assign from 'lodash/assign';

class Bookshelf extends Component {
  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate(prevProps, prevState) {
    const { booklist, getBookshelf } = this.props;
    // TODO: Not quite right, running after a search
    if (booklist && booklist !== prevProps.booklist) {
      console.log('getting');
      getBookshelf();
    }
  }

  handleSave = (book, edits) => {
    const { updateBookOnBookshelf, getBookshelf } = this.props;

    const fields = map(edits, diff => {
      return { [diff.key]: diff.newValue };
    });
    updateBookOnBookshelf(book._id, assign(...fields)).then(
      () => getBookshelf(this.state.genres) //Not refreshing
    );
  };

  // TODO: This is being rendered twice
  render() {
    const { bookshelf, active } = this.props;
    return (
      <React.Fragment>
        <GenreSelector />
        {active && (
          <Results
            booklist={bookshelf}
            handleSave={(book, edits) => this.handleSave(book, edits)}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookshelf: state.bookshelf.bookshelf, // TODO: huh?
    booklist: state.bookshelf.booklist,
  };
};

const mapDispatchToProps = {
  getBookshelf,
  updateBookOnBookshelf,
};

Bookshelf.defaultProps = {
  bookshelf: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
