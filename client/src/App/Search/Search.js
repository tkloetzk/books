import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import Results from '../Results/Results';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { LOADING_STATUSES } from '../../util/constants';
import { insertModifiedBook } from '../../store/bookshelf/bookshelfActions';
import Notification from '../Notification/Notification';

export class Search extends React.Component {
  state = {
    open: true,
  };
  handleSave = (book, edits) => {
    const { modifiedBooklist, insertModifiedBook } = this.props;

    const exisitingBook = find(
      modifiedBooklist,
      modifiedBook => modifiedBook.isbn === book.isbn
    );
    if (exisitingBook) {
      const newDiff = book.differences
        .filter(diff => !edits.find(edit => diff['key'] === edit['key']))
        .concat(edits);
      exisitingBook.differences = newDiff;
      insertModifiedBook(exisitingBook);
    } else {
      insertModifiedBook(book);
    }
    // if it's exisiting, or new
  };

  componentDidUpdate() {
    const { saveStatus } = this.props;
    if (saveStatus === LOADING_STATUSES.success) {
      this.setState({ open: true });
    }
  }
  render() {
    const { modifiedBooklist, booklist, saveStatus } = this.props;
    const { open } = this.state;
    const books = modifiedBooklist.concat(booklist);
    return (
      <React.Fragment>
        <SearchBar />
        <Results
          booklist={books}
          handleSave={(book, edits) => this.handleSave(book, edits)}
        />
        <Notification
          open={open}
          handleClose={this.handleClose}
          autoHideDuration={4000}
          message={saveStatus.message}
          type={saveStatus.status}
        />
      </React.Fragment>
    );
  }
}

Search.defaultProps = {
  saveStatus: {
    message: '',
    type: '',
  },
};

const mapStateToProps = state => {
  return {
    booklist: state.bookshelf.booklist,
    modifiedBooklist: state.bookshelf.modifiedBooklist,
    saveStatus: state.bookshelf.saveStatus,
  };
};

const mapDispatchToProps = {
  insertModifiedBook,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
