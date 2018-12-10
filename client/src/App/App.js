import React from 'react';
import './App.css';
import Header from './header/Header';
import Search from './Search/Search';

const App = () => (
  <div className="App">
    <Header>Book Review Aggregator</Header>
    <section className="container">
      <Search />
      {/*<Grid container>
        <Results />
      </Grid> */}
    </section>
  </div>
);

export default App;
