import React from 'react';
import Grid from '@material-ui/core/Grid';
import Book from '../Book/Book';
import sortBooklist from '../../util/calculator';

const Results = ({ booklist = [], handleSave, handleDelete }) => (
  <Grid container>
    {sortBooklist(booklist).map(book => {
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
