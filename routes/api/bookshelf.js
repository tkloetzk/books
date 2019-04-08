const express = require('express');
const bookRoutes = express.Router();
const map = require('lodash/map');
const { ObjectId } = require('mongodb');
const Book = require('../../models/Book');

bookRoutes.route('/').post((req, res) => {
  const param = req.body.length ? { categories: { $in: req.body } } : {};
  Book.find(param, function(err, books) {
    var bookshelf = [];

    books.forEach(function(book) {
      bookshelf.push(book);
    });

    res.send(bookshelf);
  });
});

bookRoutes.route('/add').post((req, res) => {
  const books = map(req.body, book => {
    Book.find({ isbn: book.isbn }, { isbn: 1 }).limit(1);
    return new Book(book);
  });
  Book.insertMany(books, (err, books) => {
    if (err) {
      console.error('error mongo insert', err);
      res.error(err);
    } else {
      console.info('mongo inserted', books);
      res.send(books);
    }
  });
});

bookRoutes.route('/update/:id').put((req, res) => {
  Book.updateMany(
    { _id: ObjectId(req.params.id) },
    { $set: req.body },
    (err, books) => {
      if (err) {
        console.error('error mongo update', err);
        res.send(err);
      } else {
        console.info('mongo updated', books);
        res.send(books);
      }
    }
  );
});

bookRoutes.route('/delete/:id').delete((req, res) => {
  console.log('deleting', req.params);
  Book.findByIdAndDelete({ _id: ObjectId(req.params.id) }, (err, success) => {
    if (err) {
      console.error('error mongo delete', err);
      res.send(err);
    } else {
      console.info('mongo deleted', success);
      res.send(success);
    }
  });
});

bookRoutes.route('/genres').get((req, res) => {
  Book.distinct('categories', (err, success) => {
    if (err) {
      console.error('error mongo delete', err);
      res.send(err);
    } else {
      console.info('mongo genres', success);
      res.send(success);
    }
  })
})
module.exports = bookRoutes;
