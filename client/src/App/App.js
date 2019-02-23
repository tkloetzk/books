import React from 'react';
import './App.css';
import Header from './header/Header';
import Search from './Search/Search';
import AppBar from '@material-ui/core/AppBar';
import Bookshelf from './Bookshelf/Bookshelf';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

class App extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { value } = this.state;

    return (
      <div className="App">
        <Header>Book Review Aggregator</Header>
        <section className="container">
          <AppBar position="static" color="default">
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
        </section>
      </div>
    );
  }
}

export default App;
