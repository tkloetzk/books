import get from 'lodash/get';
import forEach from 'lodash/forEach'
import clone from 'lodash/clone'

let meanGoodreadsVotes
let meanAmazonVotes
let totalMean

export default function sortBooklist(originalBooklist) {
  const booklist = clone(originalBooklist);
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

  forEach(booklist, book => {
    goodreadsVotes += get(book, 'goodreadsAverageRating')
    amazonVotes += get(book, 'amazonAverageRating');
    total +=
      get(book, 'goodreadsAverageRating') +
      get(book, 'amazonAverageRating');
  })

  meanGoodreadsVotes = goodreadsVotes / booklist.length;
  meanAmazonVotes = amazonVotes / booklist.length;
  totalMean = total / 2 / booklist.length;

  return booklist;
}

function calculateAdjustedRating(booklist) {
  for (var i = 0; i < booklist.length; i++) {
    var book = booklist[i];
    var adjustedRating =
      (getAdjustedRating(
        get(book, 'goodreadsRatingsCount'),
        get(book, 'goodreadsAverageRating'),
        meanGoodreadsVotes,
        trimmean(getGoodreadsRatingsCountList(booklist))
      ) +
        getAdjustedRating(
          get(book, 'amazonRatingsCount'),
          get(book, 'amazonAverageRating'),
          meanAmazonVotes,
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
