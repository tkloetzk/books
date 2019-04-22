import CardContent from '@material-ui/core/CardContent';
import EditableLabel from 'react-editable-label';
import isEmpty from 'lodash/isEmpty';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  categories: {
    '& > div': {
      wordBreak: 'break-word',
    },
  },
};
const BookActions = ({ classes, expanded = false, book, validateSave }) => {
  const goodreadsAverageRating =
    Math.round(book.goodreadsAverageRating * 1000) / 1000;
  const amazonAverageRating =
    Math.round(book.amazonAverageRating * 1000) / 1000;

  return (
    <CardContent style={{ textAlign: 'center' }}>
      <Typography style={{ display: 'inline-flex' }} component="span">
        ISBN:{' '}
        <EditableLabel
          initialValue={book.isbn}
          save={value => validateSave('isbn', value)}
        />
      </Typography>
      {!isEmpty(book.price) && (
        <Typography style={{ display: 'inline-flex' }} component="span">
          Price:{' '}
          <EditableLabel
            initialValue={book.price}
            save={value => validateSave('price', value)}
          />
        </Typography>
      )}
      <Typography style={{ display: 'inline-flex' }} component="span">
        Amazon Rating:{' '}
        <EditableLabel
          initialValue={`${amazonAverageRating}`}
          save={value => validateSave('amazonAverageRating', value)}
        />
      </Typography>
      <Typography style={{ display: 'inline-flex' }} component="span">
        Goodreads Rating:{' '}
        <EditableLabel
          initialValue={`${goodreadsAverageRating}`}
          save={value => {
            validateSave('amazonRatingsCount', value);
          }}
        />
      </Typography>
      <Typography style={{ display: 'inline-flex' }} component="span">
        Amazon Review:{' '}
        <EditableLabel
          initialValue={`${book.amazonRatingsCount}`}
          save={value => {
            validateSave('amazonRatingsCount', value);
          }}
        />
      </Typography>
      <Typography style={{ display: 'inline-flex' }} component="span">
        Goodreads Review:{' '}
        <EditableLabel
          initialValue={`${book.goodreadsRatingsCount}`}
          save={value => {
            validateSave('goodreadsRatingsCount', value);
          }}
        />
      </Typography>
      <Typography
        style={{ display: 'inline-flex' }}
        className={classes.categories}
        component="span"
      >
        Category:{' '}
        <EditableLabel
          initialValue={`${book.categories}`}
          save={value => {
            validateSave('categories', [value]);
          }}
        />
      </Typography>
    </CardContent>
  );
};

export default withStyles(styles)(BookActions);
