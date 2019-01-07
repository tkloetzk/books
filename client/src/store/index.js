import { combineReducers } from 'redux';
import amazon from './amazon/amazonReducer';
import goodreads from './goodreads/goodreadsReducer';

const rootReducer = combineReducers({
  amazon,
  goodreads,
});

export default rootReducer;
