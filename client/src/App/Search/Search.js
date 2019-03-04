import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import Results from '../Results/Results';
import { connect } from 'react-redux';
import find from 'lodash/find';
import extend from 'lodash/extend';
import { insertModifiedBook } from '../../store/bookshelf/bookshelfActions';

class Search extends React.Component {
  handleSave = (book, edits) => {
    const { modifiedBooklist, insertModifiedBook } = this.props;

    const exisitingBook = find(
      modifiedBooklist,
      modifiedBook => modifiedBook.isbn === book.isbn
    );
    if (exisitingBook) {
      const newDiff = [];
      var newDiff = book.differences
        .filter(diff => !edits.find(edit => diff['key'] === edit['key']))
        .concat(edits);
      exisitingBook.differences = newDiff;
      insertModifiedBook(exisitingBook);
    } else {
      insertModifiedBook(book);
    }
    // if it's exisiting, or new
  };
  render() {
    const { modifiedBooklist, booklist } = this.props;
    const books = modifiedBooklist.concat(booklist);
    return (
      <React.Fragment>
        <SearchBar />
        <Results
          booklist={books}
          handleSave={(book, edits) => this.handleSave(book, edits)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    booklist: state.bookshelf.booklist,
    modifiedBooklist: state.bookshelf.modifiedBooklist,
  };
};

const mapDispatchToProps = {
  insertModifiedBook,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
