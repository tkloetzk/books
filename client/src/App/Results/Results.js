import React from 'react';
import Grid from '@material-ui/core/Grid';
import Book from '../Book/Book';

const Results = ({ booklist = [], handleSave }) => (
  <Grid container>
    {booklist.map(book => {
      return <Book key={book.isbn} book={book} handleSave={handleSave} />;
    })}
  </Grid>
);

export default Results;
