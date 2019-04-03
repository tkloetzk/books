import React from 'react'
import Collapse from '@material-ui/core/Collapse';
import CardContent from '@material-ui/core/CardContent';
import EditableLabel from 'react-inline-editing';
import isEmpty from 'lodash/isEmpty';
import Typography from '@material-ui/core/Typography';

const BookActions = ({expanded = false, book, handleFocusOut}) => {
  const goodreadsAverageRating =
    Math.round(book.goodreadsAverageRating * 1000) / 1000;
  const amazonAverageRating =
     Math.round(book.amazonAverageRating * 1000) / 1000;

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent style={{ textAlign: 'center' }}>
        <Typography style={{ display: 'inline-flex' }} component="span">
          ISBN:{' '}
          <EditableLabel
            text={book.isbn}
            inputWidth="100px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text => handleFocusOut(text, 'isbn')}
          />
        </Typography>
        {!isEmpty(book.price) && (
          <Typography style={{ display: 'inline-flex' }} component="span">
            Price:{' '}
            <EditableLabel
              text={book.price}
              inputWidth="75px"
              inputHeight="25px"
              onFocus={() => {}}
              onFocusOut={text => handleFocusOut(text, 'price')}
            />
          </Typography>
        )}
        <Typography style={{ display: 'inline-flex' }} component="span">
          Amazon Rating:{' '}
          <EditableLabel
            text={`${amazonAverageRating}`}
            inputWidth="75px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text =>
              handleFocusOut(text, 'amazonAverageRating')
            }
          />
        </Typography>
        <Typography style={{ display: 'inline-flex' }} component="span">
          Goodreads Rating:{' '}
          <EditableLabel
            text={`${goodreadsAverageRating}`}
            inputWidth="75px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text =>
              handleFocusOut(text, 'goodreadsAverageRating')
            }
          />
        </Typography>
        <Typography style={{ display: 'inline-flex' }} component="span">
          Amazon Review:{' '}
          <EditableLabel
            text={`${book.amazonRatingsCount}`}
            inputWidth="75px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text =>
              handleFocusOut(text, 'amazonRatingsCount')
            }
          />
        </Typography>
        <Typography style={{ display: 'inline-flex' }} component="span">
          Goodreads Review:{' '}
          <EditableLabel
            text={`${book.goodreadsRatingsCount}`}
            inputWidth="75px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text =>
              handleFocusOut(text, 'goodreadsRatingsCount')
            }
          />
        </Typography>
        <Typography style={{ display: 'inline-flex' }} component="span">
          Category:{' '}
          <EditableLabel
            text={`${book.categories}`}
            inputWidth="75px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text => handleFocusOut(text, 'categories')}
          />
        </Typography>
      </CardContent>
    </Collapse>
  )
}

export default BookActions