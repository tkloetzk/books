import React from 'react';
import { shallow } from 'enzyme';
import { Bookshelf } from './Bookshelf';

describe('Bookshelf', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;

  beforeEach(() => {
    props = {
      getBookshelf: jest.fn(),
      updateBookOnBookshelf: jest.fn(),
      bookshelf: [],
      active: true,
    };
    wrapper = shallow(<Bookshelf {...props} />);
    instance = wrapper.instance();
    bookshelf = [
      {
        amazonAverageRating: 4.6,
        amazonRatingsCount: 113,
        categories: ['Family & Relationships'],
        description:
          'A complete guide to the concept of attachment parenting, which argues that parental responsiveness to a baby\'s needs leads to a well-adjusted child, offers tips on breastfeeding on demand, responding to a baby\'s cries, minimizing parent-child separation, and avoiding baby "gadgets." Original.',
        goodreadsAverageRating: 4.22,
        goodreadsRatingsCount: 236,
        isbn: '9780988995819',
        price: '',
        subtitle: 'Instinctive Care for Your Baby and Young Child',
        thumbnail:
          'http://books.google.com/books/content?id=daeq84DTC3IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        title: 'Attachment Parenting',
      },
    ];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('renders', () => {
    it('does not with active false', () => {
      props = Object.assign({}, props, {
        bookshelf,
        active: false,
      });
      wrapper = shallow(<Bookshelf {...props} />);
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
    it('with no books on bookshelf', () => {
      wrapper = shallow(<Bookshelf {...props} />);
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
    it('with books on bookshelf', () => {
      props = Object.assign({}, props, {
        bookshelf,
      });
      wrapper = shallow(<Bookshelf {...props} />);
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('handleSave', () => {
    it('calls successfully', () => {
      bookshelf[0]._id = '1234';
      const edits = [
        { key: 'title', currentValue: 'Femininity', newValue: 'Femininity1' },
        { key: 'amazonAverageRating', currentValue: 4.6, newValue: '4.65' },
      ];
      instance.handleSave(...bookshelf, edits);
      expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledWith(
        bookshelf[0]._id,
        { amazonAverageRating: '4.65', title: 'Femininity1' }
      );
    });
  });
});
