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
    read: {
      type: Boolean,
      default: false,
    },
    owned: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'bookshelf',
    unique: true,
    sparse: true,
  }
);

module.exports = Book = mongoose.model('book', BookSchema);
