import React from 'react';
import Grid from '@material-ui/core/Grid';
import Book from '../Book/Book';

const Results = ({ booklist = [], handleSave, handleDelete }) => (
  <Grid container>
    {booklist.map(book => {
      return (
        <Book
          key={book.isbn}
          book={book}
          handleSave={handleSave}
          handleDelete={book => handleDelete(book)}
        />
      );
    })}
  </Grid>
);

export default Results;
