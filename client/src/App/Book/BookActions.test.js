import React from 'react';
import { shallow, mount } from 'enzyme';
import BookActions from './BookActions'
import EditableLabel from 'react-inline-editing';

describe('BookActions', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      handleFocusOut: jest.fn(),
      expanded: true,
      book: {
        categories: ['Religion'],
        _id: '5c806393df78d5e84f8388ad',
        amazonAverageRating: 4.6,
        amazonRatingsCount: 20,
        price: '',
        isbn: '9780736917728',
        title: "Raising a Daughter After God's Own Heart",
        subtitle: '',
        description:
          'Elizabeth George, bestselling author and mother of two daughters, provides biblical insight and guidance for every mom who wants to lead their daughter to a godly life through example, study, and prayer. Elizabeth includes questions to draw moms and daughter closer as together they pursue spiritual priorities and God s heart."',
        thumbnail:
          'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        goodreadsAverageRating: 4.24,
        goodreadsRatingsCount: 148,
        __v: 0,
        adjustedRating: 4.225772626931567,
      },
    };
    wrapper = shallow(<BookActions {...props} />);
    instance = wrapper.instance();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('renders', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})