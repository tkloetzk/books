import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import {
  getBookshelf,
  updateBookOnBookshelf,
} from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import assign from 'lodash/assign';

class Bookshelf extends Component {
  state = {
    genres: [],
  };

  componentDidMount() {
    this.props.getBookshelf();
  }

  componentDidUpdate(prevProps, prevState) {
    const { booklist, getBookshelf, bookshelf } = this.props;
    const { genres } = this.state;

    if (!prevState.genres.length && bookshelf.length && !genres.length) {
      const genres = [];
      bookshelf.forEach(book =>
        book.categories.forEach(category => {
          if (!find(genres, { category })) {
            genres.push({ category, checked: true });
          }
        })
      );
      this.setState({ genres });
    }

    // TODO: Not quite right, running after a search
    if (booklist && booklist !== prevProps.booklist) {
      getBookshelf();
    }

    if (genres !== prevState.genres && prevState.genres.length) {
      const excludeGenre = [];
      forEach(genres, genre => {
        if (!genre.checked) {
          excludeGenre.push(genre.category);
        }
      });
      getBookshelf(excludeGenre);
    }
  }

  handleChange = name => event => {
    const { genres } = this.state;
    this.setState({
      genres: [
        ...genres.filter(genre => name !== genre.category),
        { category: name, checked: event.target.checked },
      ],
    });
  };

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
    const { bookshelf } = this.props;
    const { genres } = this.state;
    return (
      <React.Fragment>
        <GenreSelector handleChange={this.handleChange} genres={genres} />
        <Results
          booklist={bookshelf}
          handleSave={(book, edits) => this.handleSave(book, edits)}
        />
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
