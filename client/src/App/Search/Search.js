import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import Results from '../Results/Results';
import { connect } from 'react-redux';

class Search extends React.Component {
  render() {
    const { modifiedBooklist, booklist } = this.props;
    const books = modifiedBooklist.concat(booklist);
    return (
      <React.Fragment>
        <SearchBar />
        <Results booklist={books} />
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

export default connect(mapStateToProps)(Search);
