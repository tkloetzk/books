const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    href: {
      type: String,
    },
    price: {
      type: String,
    },
    categories: {
      type: Array,
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
  },
  {
    collection: 'bookshelf',
  }
);

module.exports = Book = mongoose.model('book', BookSchema);
