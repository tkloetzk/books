import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import Results from '../Results/Results';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { LOADING_STATUSES } from '../../util/constants';
import {
  updateBookInBooklist,
  deleteModifiedBook,
  updateModifiedBook,
} from '../../store/bookshelf/bookshelfActions';
import Notification from '../Notification/Notification';
import sortBooklist from '../../util/calculator';
import forEach from 'lodash/forEach';

export class Search extends React.Component {
  state = {
    open: false,
  };

  componentDidUpdate(prevProps) {
    const { saveStatus } = this.props;
    if (
      saveStatus !== prevProps.saveStatus &&
      saveStatus.status !== LOADING_STATUSES.initial
    ) {
      this.setState({ open: true });
    }
    if (
      saveStatus !== prevProps.saveStatus &&
      saveStatus.status === LOADING_STATUSES.initial
    ) {
      this.setState({ open: false });
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  handleSearchedBookEditSave = (book, edits) => {
    const {
      modifiedBooklist,
      updateBookInBooklist,
      updateModifiedBook,
    } = this.props;

    const exisitingBook = find(
      modifiedBooklist,
      modifiedBook => modifiedBook.isbn === book.isbn
    );
    if (exisitingBook) {
      const newDiff = book.differences
        .filter(diff => !edits.find(edit => diff['key'] === edit['key']))
        .concat(edits);
      exisitingBook.differences = newDiff;
      updateModifiedBook(exisitingBook);
    } else {
      forEach(edits, edit => {
        book[edit.key] = edit.newValue;
      });
      updateBookInBooklist(book);
    }
  };

  render() {
    const {
      modifiedBooklist,
      booklist,
      saveStatus,
      deleteModifiedBook,
    } = this.props;
    const { open } = this.state;
    const books = sortBooklist(modifiedBooklist.concat(booklist));

    return (
      <div style={{ height: '74vh' }}>
        <SearchBar />
        <Results
          booklist={books}
          handleSave={(book, edits) =>
            this.handleSearchedBookEditSave(book, edits)
          }
          handleDelete={book => deleteModifiedBook(book.isbn)}
        />
        <Notification
          open={open}
          handleClose={this.handleClose}
          autoHideDuration={4000}
          message={saveStatus.message}
          type={saveStatus.status}
        />
      </div>
    );
  }
}

Search.defaultProps = {
  booklist: [],
  modifiedBooklist: [],
  saveStatus: {
    message: '',
    type: LOADING_STATUSES.initial,
  },
};

export const mapStateToProps = state => {
  return {
    booklist: state.bookshelf.booklist,
    modifiedBooklist: state.bookshelf.modifiedBooklist,
    saveStatus: state.bookshelf.saveStatus,
  };
};

const mapDispatchToProps = {
  updateBookInBooklist,
  deleteModifiedBook,
  updateModifiedBook,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
