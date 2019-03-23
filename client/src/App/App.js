import React from 'react';
import './App.css';
import Header from './header/Header';
import Search from './Search/Search';
import AppBar from '@material-ui/core/AppBar';
import Bookshelf from './Bookshelf/Bookshelf';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  label: {
    width: 'unset',
  },
};
export class App extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (
      <div className="App">
        <Header>Book Review Aggregator</Header>
        <section className="container">
          <AppBar
            position="static"
            color="default"
            style={{ marginTop: '-13px' }}
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
                // icon={
                //   <RefreshIcon
                //     onClick={}
                //     data-tip
                //     data-for="bookshelfRefreshTooltip"
                //   />
                //}
                // classes={{
                //   wrapper: classes.wrapper,
                //   labelContainer: classes.label,
                // }}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews index={value} style={{ maxHeight: '78vh' }}>
            <Search />
            <Bookshelf active={value === 1} />
          </SwipeableViews>
          {/* <ReactTooltip
            id="bookshelfRefreshTooltip"
            place="right"
            effect="solid"
            getContent={() => <Tooltip content={tooltipObj} />}
          /> */}
        </section>
      </div>
    );
  }
}

export default App;
