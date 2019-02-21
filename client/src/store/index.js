import { combineReducers } from 'redux';
import amazon from './amazon/amazonReducer';
import goodreads from './goodreads/goodreadsReducer';
import bookshelf from './bookshelf/bookshelfReducer';
import google from './google/googleReducer';

const rootReducer = combineReducers({
  amazon,
  goodreads,
  google,
  bookshelf,
});

export default rootReducer;
