import React from 'react';
import { shallow, mount } from 'enzyme';
import { Bookshelf, mapStateToProps } from './Bookshelf';

describe('Bookshelf', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;

  beforeEach(() => {
    props = {
      classes: {},
      getBookshelf: jest.fn(),
      updateBookOnBookshelf: jest.fn(),
      getAmazonBook: jest.fn(),
      getGoodreadsBook: jest.fn(),
      clearBooks: jest.fn(),
      bookshelf: [],
      amazonBooks: [],
      goodreadsBooks: [],
      selectedGenres: [],
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
  describe('componentDidUpdate', () => {
    it('updatesBookOnBookshelf if there are differences in both amazon and goodreads', () => {
      const amazonBooks = [
         {
            "amazonAverageRating":4.55,
            "amazonRatingsCount":3613,
            "price":"$5.07",
            "isbn":"9780988995819"
         },
         {
            "amazonAverageRating":2.8,
            "amazonRatingsCount":4589,
            "price":"$9.69",
            "isbn":"9780736917728"
         }
      ]
      const goodreadsBooks = [
         {
            "goodreadsAverageRating":2.51,
            "goodreadsRatingsCount":1315,
            "isbn":"9780988995819"
         },
         {
            "goodreadsAverageRating":4.16,
            "goodreadsRatingsCount":2333,
            "isbn":"9780736917728"
         },
      ]
      bookshelf[0]['_id'] = '1234125c80df7'
      bookshelf.push({
        "categories":[
           "Religion"
        ],
        "_id":"5c806393df78d5e84f8388ad",
        "amazonAverageRating":4.6,
        "amazonRatingsCount":20,
        "price":"",
        "isbn":"9780736917728",
        "title":"Raising a Daughter After God's Own Heart",
        "subtitle":"",
        "description":"Elizabeth George, bestselling author and mother of two daughters, provides biblical insight and guidance for every mom who wants to lead their daughter to a godly life through example, study, and prayer. Elizabeth includes questions to draw moms and daughter closer as together they pursue spiritual priorities and God s heart.\"",
        "thumbnail":"http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        "goodreadsAverageRating":4.24,
        "goodreadsRatingsCount":148,
        "__v":0,
        "adjustedRating":4.170573030409615
     })
     props = Object.assign({}, props, {amazonBooks, goodreadsBooks, bookshelf})
     wrapper = shallow(<Bookshelf {...props} />);
     instance = wrapper.instance();
     instance.componentDidUpdate()
     expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(2)
     expect(instance.props.updateBookOnBookshelf.mock.calls).toMatchSnapshot()
     expect(instance.props.clearBooks).toHaveBeenCalledTimes(1)
    })
    it('updatesBookOnBookshelf if there are only differences in amazon ', () => {
      const amazonBooks = [
         {
            "amazonAverageRating":4.55,
            "amazonRatingsCount":3613,
            "price":"$5.07",
            "isbn":"9780988995819"
         },
      ]
      const goodreadsBooks = [
         {
           goodreadsAverageRating: bookshelf[0].goodreadsAverageRating,
           goodreadsRatingsCount: bookshelf[0].goodreadsRatingsCount,
            "isbn":"9780988995819"
         },
      ]
      bookshelf[0]['_id'] = '1234125c80df7'

      props = Object.assign({}, props, {amazonBooks, goodreadsBooks, bookshelf})
      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();
      instance.componentDidUpdate()
      expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(1)
      expect(instance.props.updateBookOnBookshelf.mock.calls).toMatchSnapshot()
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(1)
    })
    it('updatesBookOnBookshelf if there are only differences in goodreads ', () => {
      const amazonBooks = [
         {
            "amazonAverageRating":bookshelf[0].amazonAverageRating,
            "amazonRatingsCount": bookshelf[0].amazonRatingsCount,
            "price":"$5.07",
            "isbn":"9780988995819"
         },
      ]
      const goodreadsBooks = [
         {
            "goodreadsAverageRating":4.16,
            "goodreadsRatingsCount":2333,
            "isbn":"9780988995819"
         },
      ]
      bookshelf[0]['_id'] = '1234125c80df7'

      props = Object.assign({}, props, {amazonBooks, goodreadsBooks, bookshelf})
      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();
      instance.componentDidUpdate()
      expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(1)
      expect(instance.props.updateBookOnBookshelf.mock.calls).toMatchSnapshot()
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(1)
    })
    it('does not call updatesBookOnBookshelf if there are no differences', () => {
      const amazonBooks = [
         {
            "amazonAverageRating":bookshelf[0].amazonAverageRating,
            "amazonRatingsCount": bookshelf[0].amazonRatingsCount,
            "price":"$5.07",
            "isbn":"9780988995819"
         },
      ]
      const goodreadsBooks = [
         {
            "goodreadsAverageRating": bookshelf[0].goodreadsAverageRating,
            "goodreadsRatingsCount": bookshelf[0].goodreadsRatingsCount,
            "isbn":"9780988995819"
         },
      ]
      bookshelf[0]['_id'] = '1234125c80df7'

      props = Object.assign({}, props, {amazonBooks, goodreadsBooks, bookshelf})
      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();
      instance.componentDidUpdate()
      expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(0)
      expect(instance.props.updateBookOnBookshelf.mock.calls).toMatchSnapshot()
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(1)
    })
  })
  describe('refreshBookshelf', () => {
    it('creates a promise array', () => {
      bookshelf = bookshelf.concat([{isbn: '1234'}, { isbn: '5678'}])
      props = Object.assign({}, props, {bookshelf})

      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();

      instance.refreshBookshelf();

      expect(instance.props.getAmazonBook).toHaveBeenCalledTimes(3);
      expect(instance.props.getGoodreadsBook).toHaveBeenCalledTimes(3);
      expect(instance.props.getAmazonBook.mock.calls).toMatchSnapshot()
      expect(instance.props.getGoodreadsBook.mock.calls).toMatchSnapshot()
    })
  })
  it('mapStateToProps', () => {
    const mockedState = {
      bookshelf: {
        bookshelf: [{title: 'title'}],
      },
      amazon: {
        books: [{ title: 'amazonBook' }],
      },
      goodreads: {
        books: [{ title: 'goodreadsBook' }],
      },
    }
    const state = mapStateToProps(mockedState)
    expect(state).toEqual({"bookshelf": mockedState.bookshelf.bookshelf, 'amazonBooks': mockedState.amazon.books, 'goodreadsBooks': mockedState.goodreads.books})
  })
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
        { amazonAverageRating: '4.65', title: 'Femininity1' },
        false
      );
    });
  });
});
