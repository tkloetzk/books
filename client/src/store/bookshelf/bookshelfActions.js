import get from 'lodash/get';
import {
  addBookshelfService,
  getBookshelfService,
} from '../../services/bookshelfService';
import * as types from './bookshelfActionTypes';

//TODO: probably shouldn't be modifying original booklist
export default function sortBooklist(booklist) {
  calculateMeans(booklist);
  calculateAdjustedRating(booklist);
  booklist.sort((a, b) =>
    a.adjustedRating < b.adjustedRating
      ? 1
      : b.adjustedRating < a.adjustedRating
      ? -1
      : 0
  );
  return booklist;
}

function calculateMeans(booklist) {
  let goodreadsVotes = 0,
    amazonVotes = 0,
    total = 0;
  for (var i = 0; i < booklist.length; i++) {
    //TODO: Best for loop?
    // for (Book book: booklist) { // TODO Iterator
    goodreadsVotes += get(booklist[i], 'goodreadsAverageRating');
    amazonVotes += get(booklist[i], 'amazonAverageRating');
    total +=
      get(booklist[i], 'goodreadsAverageRating') +
      get(booklist[i], 'amazonAverageRating');
  }

  booklist.meanGoodreadsVotes = goodreadsVotes / booklist.length;
  booklist.meanAmazonVotes = amazonVotes / booklist.length;
  booklist.totalMean = total / 2 / booklist.length;
  return booklist;
}

function calculateAdjustedRating(booklist) {
  for (var i = 0; i < booklist.length; i++) {
    var book = booklist[i];
    var adjustedRating =
      (getAdjustedRating(
        get(book, 'goodreadsRatingsCount'),
        get(book, 'goodreadsAverageRating'),
        get(booklist, 'meanGoodreadsVotes'),
        trimmean(getGoodreadsRatingsCountList(booklist))
      ) +
        getAdjustedRating(
          get(book, 'amazonRatingsCount'),
          get(book, 'amazonAverageRating'),
          get(booklist, 'meanAmazonVotes'),
          trimmean(getAmazonRatingsCountList(booklist))
        )) /
      2;
    book.adjustedRating = adjustedRating;
  }
}

function getAdjustedRating(ratingsCount, averageRating, meanVote, minVotes) {
  //double rating = averageRating * 2;
  return (
    (ratingsCount / (ratingsCount + minVotes)) * averageRating +
    (minVotes / (ratingsCount + minVotes)) * meanVote
  );
}

function getGoodreadsRatingsCountList(booklist) {
  let votes = [];
  for (const book of booklist) {
    votes.push(book.goodreadsRatingsCount);
  }

  return votes.sort(function(a, b) {
    return a - b;
  });
}

function getAmazonRatingsCountList(booklist) {
  let votes = [];
  for (const book of booklist) {
    votes.push(book.amazonRatingsCount);
  }

  return votes.sort(function(a, b) {
    return a - b;
  });
}

function trimmean(votes) {
  votes.sort(function(a, b) {
    return a - b;
  });

  const removeAmount = (votes.length * 0.25) / 2;
  const roundDownNearedMultipleTwo = Math.floor(
    removeAmount >= 0
      ? (removeAmount / 2) * 2
      : ((removeAmount - 2 + 1) / 2) * 2
  );
  return getMean(
    votes.slice(
      roundDownNearedMultipleTwo,
      votes.length - roundDownNearedMultipleTwo
    )
  );
}

function getMean(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}

export function getBookshelfIsLoading(bool) {
  return {
    type: types.FETCH_BOOKSHELF_IS_LOADING,
    isLoading: bool,
  };
}

export function getBookshelfSuccess(bookshelf) {
  return {
    type: types.FETCH_BOOKSHELF_SUCCESS,
    bookshelf,
  };
}

export function getBookshelfFailure(bool) {
  return {
    type: types.FETCH_BOOKSHELF_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function saveCombinedBooksSuccess(booklist) {
  return {
    type: types.SAVE_COMBINED_BOOKS_SUCESS,
    booklist,
  };
}
export function saveCombinedBooks(books) {
  return dispatch => {
    dispatch(saveCombinedBooksSuccess(books));
  };
}
export function getBookshelf(excludeGenre = []) {
  return dispatch => {
    dispatch(getBookshelfIsLoading(true));
    return getBookshelfService(excludeGenre)
      .then(bookshelf => {
        dispatch(getBookshelfIsLoading(false));
        dispatch(getBookshelfSuccess(bookshelf));
        return bookshelf;
      })
      .catch(error => {
        dispatch(getBookshelfIsLoading(false));
        dispatch(getBookshelfFailure(true));
        console.error('bookshelf error', error);
      });
  };
}

export function addBookToBookshelfSuccess(booklist) {
  return {
    type: types.ADD_BOOK_TO_BOOKSHELF_SUCCESS,
    booklist,
  };
}
export function addBookToBookshelf(booklist) {
  return dispatch => {
    return addBookshelfService(booklist)
      .then(resp => {
        dispatch(addBookToBookshelfSuccess(booklist));
        return true;
      })
      .catch(error => {
        console.log('error', error);
      });
  };
}
