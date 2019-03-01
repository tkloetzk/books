import forEach from 'lodash/forEach';

export default function combineBooks(combinedBooks, bookshelf) {
  let duplicates = [];
  let duplicatedISBNs = [];
  forEach(combinedBooks, duplicatedBook => {
    return forEach(bookshelf, existingBook => {
      if (duplicatedBook.isbn === existingBook.isbn) {
        duplicatedBook.differences = compareDifferences(
          existingBook,
          duplicatedBook,
          []
        );
        // TODO: If duplicate but no differences exist, don't add but show notification
        if (duplicatedBook.differences.length) {
          duplicatedBook._id = existingBook._id;
          duplicates.push(duplicatedBook);
        } else {
          this.state.duplicatedISBNs.push({ isbn: duplicatedBook.isbn });
        }
      }
    });
  });
  return { duplicates, duplicatedISBNs };
}
function compareDifferences(oldBook, newBook, difference) {
  Object.keys(oldBook).forEach(key => {
    if (typeof oldBook[key] !== 'object') {
      if (
        oldBook[key] != newBook[key] &&
        key !== '__v' &&
        key !== '_id' &&
        key !== 'adjustedRating'
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
