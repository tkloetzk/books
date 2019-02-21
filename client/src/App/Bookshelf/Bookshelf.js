import React, { Component } from 'react';
import GenreSelector from './GenreSelector/GenreSelector';
import { getBookshelf } from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import Results from '../Results/Results';

class Bookshelf extends Component {
  componentDidMount() {
    this.props.getBookshelf();
  }
  render() {
    const { bookshelf } = this.props;
    return (
      <React.Fragment>
        <GenreSelector />
        <Results booklist={bookshelf} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookshelf: state.bookshelf.bookshelf, // TODO: huh?
  };
};

const mapDispatchToProps = {
  getBookshelf,
};

Bookshelf.defaultProps = {
  bookshelf: [],
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookshelf);
