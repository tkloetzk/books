import React from 'react';
import './App.css';
import Header from './header/Header';
import Search from './Search/Search';
import AppBar from '@material-ui/core/AppBar';
import Bookshelf from './Bookshelf/Bookshelf';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import Notification from './Notification/Notification';
import { connect } from 'react-redux';
import { LOADING_STATUSES } from '../util/constants';
import { withStyles } from '@material-ui/core';
import forEach from 'lodash/forEach';
import RefreshIcon from '@material-ui/icons/Refresh';
import { getAmazonSingleBook } from '../store/amazon/amazonActions';
import { getGoodreadsBook } from '../store/goodreads/goodreadsActions';
import { getGoogleBook } from '../store/google/googleActions';
import {
  refreshBookshelf,
  updateBookOnBookshelf,
  getBookshelf,
} from '../store/bookshelf/bookshelfActions';
import map from 'lodash/map';
import util from '../util/combineBooks';
import assign from 'lodash/assign';

const styles = {
  header: {
    backgroundColor: 'white',
    height: 60,
    backgroundSize: 'cover',
    left: 0,
    right: 0,
    position: 'fixed',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '2px solid',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  label: {
    width: 'unset',
  },
};
class App extends React.Component {
  state = {
    value: 0,
    open: true,
  };

  componentDidUpdate(prevProps) {
    const {
      saveStatus,
      updateBookOnBookshelf,
      bookshelf,
      refreshed,
      amazonBooks,
      googleBooks,
      goodreadsBooks,
      getBookshelf,
    } = this.props;
    if (saveStatus === LOADING_STATUSES.success) {
      this.setState({ open: true });
    }
    if (
      amazonBooks !== prevProps.amazonBooks &&
      amazonBooks.length &&
      googleBooks.length &&
      goodreadsBooks.length &&
      amazonBooks.length === googleBooks.length &&
      refreshed
    ) {
      const { duplicates } = util.combineBooks(
        amazonBooks,
        googleBooks,
        goodreadsBooks,
        bookshelf
      );
      if (duplicates.length) {
        Promise.all(
          forEach(duplicates, book => {
            const fields = map(book.differences, diff => {
              return { [diff.key]: diff.newValue };
            });
            return updateBookOnBookshelf(book._id, assign(...fields));
          })
        );
      }
    }
    if (prevProps.refreshed && !refreshed) {
      getBookshelf();
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  refreshBookshelf = () => {
    console.log('refresh');
    const {
      bookshelf,
      getAmazonSingleBook,
      getGoogleBook,
      getGoodreadsBook,
      refreshBookshelf,
    } = this.props;
    let serviceCalls = map(bookshelf, book => {
      return [
        getAmazonSingleBook(book.isbn),
        getGoogleBook(book.isbn),
        getGoodreadsBook(book.isbn),
      ];
    });
    serviceCalls.push(refreshBookshelf(true));
    console.log(serviceCalls);
    Promise.all(serviceCalls);
  };
  render() {
    const { value, open } = this.state;
    const { saveStatus, classes } = this.props;
    return (
      <div className="App">
        <Header>Book Review Aggregator</Header>
        <section className="container">
          <AppBar
            position="static"
            color="default"
            style={{ marginTop: '-13px', marginBottom: '14px' }}
          >
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Search" />
              <Tab
                label="Bookshelf"
                icon={<RefreshIcon onClick={this.refreshBookshelf} />}
                classes={{
                  wrapper: classes.wrapper,
                  labelContainer: classes.label,
                }}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={this.handleChangeIndex}
            style={{ maxHeight: '78vh' }}
          >
            <Search />
            <Bookshelf />
          </SwipeableViews>
          <Notification
            open={open}
            handleClose={this.handleClose}
            autoHideDuration={4000}
            message={saveStatus.message}
            type={saveStatus.status}
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    saveStatus: state.bookshelf.saveStatus,
    bookshelf: state.bookshelf.bookshelf,
    refreshed: state.bookshelf.refreshed,
    amazonBooks: state.amazon.books,
    googleBooks: state.google.books,
    goodreadsBooks: state.goodreads.books,
  };
};

const mapDispatchToProps = {
  getAmazonSingleBook,
  getGoodreadsBook,
  getGoogleBook,
  refreshBookshelf,
  updateBookOnBookshelf,
  getBookshelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
