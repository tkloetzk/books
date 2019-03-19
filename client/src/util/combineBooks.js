import forEach from 'lodash/forEach';
import mergeByKey from 'array-merge-by-key';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import { isEqual } from 'date-fns';

export function combineBooks(
  amazonBooks,
  googleBooks,
  goodreadsBooks,
  bookshelf
) {
  const combinedBooks = mergeByKey(
    'isbn',
    amazonBooks,
    googleBooks,
    goodreadsBooks
  );
  let duplicates = [];
  let duplicatedISBNs = [];
  forEach(combinedBooks, duplicatedBook => {
    return forEach(bookshelf, existingBook => {
      if (duplicatedBook.isbn === existingBook.isbn) {
        duplicatedBook.differences = this.compareDifferences(
          existingBook,
          duplicatedBook,
          []
        );
        // TODO: If duplicate but no differences exist, don't add but show notification
        if (duplicatedBook.differences.length) {
          duplicatedBook._id = existingBook._id;
          duplicates.push(duplicatedBook);
        } else {
          duplicatedISBNs.push({ isbn: duplicatedBook.isbn });
        }
      }
    });
  });
  return { combinedBooks, duplicates, duplicatedISBNs };
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
export function compareDifferences(oldBook, newBook, difference) {
  Object.keys(oldBook).forEach(key => {
    if (typeof oldBook[key] !== 'object') {
      if (
        oldBook[key] !== newBook[key] &&
        key !== '__v' &&
        key !== '_id' &&
        key !== 'adjustedRating' &&
        key !== 'owned' &&
        key !== 'read' &&
        newBook[key] !== '' &&
        newBook[key] !== 0
      )
        difference.push({
          key,
          currentValue: oldBook[key],
          newValue: newBook[key],
        });
    } else {
      if (isArray(oldBook[key])) {
        if (!isArray(newBook[key]) && !isEmpty(newBook[key])) {
          newBook[key] = newBook[key].split(',');
        }
        if (!arraysEqual(oldBook[key], newBook[key])) {
          difference.push({
            key,
            currentValue: oldBook[key],
            newValue: newBook[key],
          });
        }
      }
    }
  }, difference);

  return difference;
}

export default { combineBooks, compareDifferences };
