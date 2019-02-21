import { combineReducers } from 'redux';
import amazon from './amazon/amazonReducer';
import goodreads from './goodreads/goodreadsReducer';
import bookshelf from './bookshelf/bookshelfReducer';

const rootReducer = combineReducers({
  amazon,
  goodreads,
  bookshelf,
});

export default rootReducer;
