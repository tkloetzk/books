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
};
class App extends React.Component {
  state = {
    value: 0,
    open: true,
  };

  componentDidUpdate(prevProps) {
    const { saveStatus } = this.props;
    if (saveStatus === LOADING_STATUSES.success) {
      this.setState({ open: true });
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
              <Tab label="Bookshelf" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={this.handleChangeIndex}
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
  };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
