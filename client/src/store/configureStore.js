import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './index';
import thunk from 'redux-thunk';

const configureStore = () => ({
  ...createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk))),
});

export default configureStore;
