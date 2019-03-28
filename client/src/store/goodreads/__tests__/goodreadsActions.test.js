import * as actions from '../goodreadsActions';
import * as types from '../goodreadsActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import { getGoodreadsSingleBooksService } from '../../../services/goodreadsService';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const createMockStore = configureMockStore([thunk])

jest.mock('../../../services/goodreadsService')

describe('goodreads actions', () => {
  let book;
  beforeEach(() => {
    book = {
      isbn: '9781400079094',
      goodreadsAverageRating: 3.5,
      goodreadsRatingsCount: 90,
    };
    getGoodreadsSingleBooksService.mockClear()
  });
  it('can set goodreads book hasErrored', () => {
    
  })
})
