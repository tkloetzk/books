const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    href: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
    amazonAverageRating: {
      type: Number,
    },
    goodreadsAverageRating: {
      type: Number,
    },
    amazonRatingsCount: {
      type: Number,
    },
    goodreadsRatingsCount: {
      type: Number,
    },
    adjustedRating: {
      type: Number,
    },
  },
  {
    collection: 'bookshelf',
  }
);

module.exports = Book = mongoose.model('book', BookSchema);
