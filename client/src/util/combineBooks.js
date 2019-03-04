import forEach from 'lodash/forEach';
import mergeByKey from 'array-merge-by-key';
import isEmpty from 'lodash/isEmpty';

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
export function compareDifferences(oldBook, newBook, difference) {
  Object.keys(oldBook).forEach(key => {
    if (typeof oldBook[key] !== 'object') {
      if (
        oldBook[key] !== newBook[key] &&
        key !== '__v' &&
        key !== '_id' &&
        key !== 'adjustedRating' &&
        newBook[key] !== ''
      )
        difference.push({
          key,
          currentValue: oldBook[key],
          newValue: newBook[key],
        });
    } else {
      compareDifferences(oldBook[key], newBook[key], difference);
    }
  }, difference);

  return difference;
}

export default { combineBooks, compareDifferences };
