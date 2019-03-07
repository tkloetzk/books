import React from 'react';
import { shallow } from 'enzyme';
import { SearchBar } from './SearchBar';
import Button from '@material-ui/core/Button';
import { LOADING_STATUSES } from '../../../util/constants';
import cloneDeep from 'lodash/cloneDeep';

describe('SearchBar', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      classes: {},
      modifiedBooklist: [],
      clearBooks: jest.fn(),
      getAmazonSingleBook: jest.fn(),
      getGoogleBook: jest.fn(),
      getGoodreadsBook: jest.fn(),
      saveCombinedBooks: jest.fn(),
      amazonBookErrored: false,
      saveCombinedBooks: jest.fn(),
      insertModifiedBook: jest.fn(),
      saveModifiedBooks: jest.fn(),
    };
    wrapper = shallow(<SearchBar {...props} />);
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe('search', () => {
    describe('button', () => {
      it('disabled if no text', () => {
        wrapper.setState({
          loading: false,
          multiline: '',
        });
        expect(
          wrapper
            .find(Button)
            .at(0)
            .props().disabled
        ).toBe(true);
      });
      it('disabled if loading', () => {
        wrapper.setState({
          loading: true,
          multiline: 'ISBN',
        });
        expect(
          wrapper
            .find(Button)
            .at(0)
            .props().disabled
        ).toBe(true);
      });
    });
    describe('bar', () => {
      it('handleChange updates state', () => {
        instance.handleChange({ target: { value: 'update state' } });
        expect(instance.state.multiline).toEqual('update state');
      });
    });
    describe('isbn array', () => {
      it('one long string with comma separator', () => {
        instance.state.multiline = '9780805835595,9780800731915,,9780375700002';
        instance.handleSearch();
        expect(instance.state.searchIsbns).toEqual([
          '9780805835595',
          '9780800731915',
          '9780375700002',
        ]);
      });
      it('one long string with space separator', () => {
        instance.state.multiline = '9780805835595 9780800731915  9780375700002';
        instance.handleSearch();
        expect(instance.state.searchIsbns).toEqual([
          '9780805835595',
          '9780800731915',
          '9780375700002',
        ]);
      });
      it('one long string with newline separator', () => {
        instance.state.multiline =
          '9780805835595\n9780800731915\n\n9780375700002';
        instance.handleSearch();
        expect(instance.state.searchIsbns).toEqual([
          '9780805835595',
          '9780800731915',
          '9780375700002',
        ]);
      });
    });
    describe('promise array', () => {
      it('function calls', () => {
        instance.state.multiline = '9780805835595,9780800731915,9780375700002';
        instance.handleSearch();

        expect(instance.props.getAmazonSingleBook).toHaveBeenCalledTimes(3);
        expect(instance.props.getGoogleBook).toHaveBeenCalledTimes(3);
        expect(instance.props.getGoodreadsBook).toHaveBeenCalledTimes(3);
      });
    });
  });
  describe('componentDidUpdate', () => {
    it('lifecycle of successful loading states', () => {
      const prevProps = {
        amazonBooks: [],
        goodreadsBooks: [],
        googleBooks: [],
      };
      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.initial
      );
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.initial
      );
      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.initial
      );

      instance.state.multiline = '9780805835595,9780800731915';
      instance.handleSearch();

      instance.componentDidUpdate(prevProps);

      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.loading
      );
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.loading
      );
      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.loading
      );

      wrapper.setProps({
        googleBooks: [{ title: 'title1' }, { title: 'title2' }],
        goodreadsBooks: [{ title: 'title1' }],
        amazonBooks: [{ title: 'title1' }],
      });
      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.success
      );
      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.loading
      );
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.loading
      );

      wrapper.setProps({
        goodreadsBooks: [{ title: 'title1' }, { title: 'title2' }],
      });

      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.success
      );
      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.loading
      );
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.success
      );

      wrapper.setProps({
        amazonBooks: [{ title: 'title1' }, { title: 'title2' }],
      });
      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.success
      );
      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.success
      );
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.success
      );
    });
    it('errored loading states', () => {
      wrapper.setProps({ amazonBookErrored: true });
      instance.componentDidUpdate();
      expect(instance.state.amazonBookLoading).toEqual(
        LOADING_STATUSES.errored
      );
      wrapper.setProps({ goodreadsBooksErrored: true });
      instance.componentDidUpdate();
      expect(instance.state.goodreadsBookLoading).toEqual(
        LOADING_STATUSES.errored
      );
      wrapper.setProps({ googleBooksErrored: true });
      instance.componentDidUpdate();
      expect(instance.state.googleBookLoading).toEqual(
        LOADING_STATUSES.errored
      );
    });
    describe('books returned', () => {
      let amazonBooks;
      let googleBooks;
      let goodreadsBooks;
      let prevProps;
      let newBook;
      let modifiedBook;
      beforeEach(() => {
        amazonBooks = [
          {
            amazonAverageRating: 4.6,
            amazonRatingsCount: 113,
            price: '',
            isbn: '9780988995819',
          },
        ];
        goodreadsBooks = [
          {
            isbn: '9780988995819',
            goodreadsAverageRating: 4.22,
            goodreadsRatingsCount: 236,
          },
        ];
        googleBooks = [
          {
            title: 'Attachment Parenting',
            isbn: '9780988995819',
            subtitle: 'Instinctive Care for Your Baby and Young Child',
            description:
              'A complete guide to the concept of attachment parenting, which argues that parental responsiveness to a baby\'s needs leads to a well-adjusted child, offers tips on breastfeeding on demand, responding to a baby\'s cries, minimizing parent-child separation, and avoiding baby "gadgets." Original.',
            thumbnail:
              'http://books.google.com/books/content?id=daeq84DTC3IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
            categories: ['Family & Relationships'],
          },
        ];
        prevProps = {
          amazonBooks: [],
          goodreadsBooks: [],
          googleBooks: [],
          modifiedBooklist: [],
        };
        newBook = [
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
        modifiedBook = [
          {
            _id: undefined,
            amazonAverageRating: 2,
            amazonRatingsCount: 7,
            categories: ['Family & Relationships'],
            description:
              'A complete guide to the concept of attachment parenting, which argues that parental responsiveness to a baby\'s needs leads to a well-adjusted child, offers tips on breastfeeding on demand, responding to a baby\'s cries, minimizing parent-child separation, and avoiding baby "gadgets." Original.',
            differences: [
              {
                currentValue: 4.6,
                key: 'amazonAverageRating',
                newValue: 2,
              },
              {
                currentValue: 113,
                key: 'amazonRatingsCount',
                newValue: 7,
              },
            ],
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
      it('new book', () => {
        props = Object.assign({}, props, {
          googleBooks,
          goodreadsBooks,
          amazonBooks,
        });

        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();
        instance.state.loading = true;
        instance.state.searchIsbns = ['9780988995819'];

        instance.componentDidUpdate(prevProps);
        expect(instance.props.insertModifiedBook).not.toHaveBeenCalled();
        expect(instance.props.saveModifiedBooks).not.toHaveBeenCalled();
        expect(instance.props.saveCombinedBooks).toBeCalledWith(newBook);
      });
      it('modified book', () => {
        amazonBooks[0].amazonAverageRating = 2;
        amazonBooks[0].amazonRatingsCount = 7;
        props = Object.assign({}, props, {
          googleBooks,
          goodreadsBooks,
          amazonBooks,
          bookshelf: newBook,
        });
        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();
        instance.state.loading = true;
        instance.state.searchIsbns = ['9780988995819'];

        instance.componentDidUpdate(prevProps);

        expect(instance.props.insertModifiedBook).not.toHaveBeenCalled();
        expect(instance.props.saveModifiedBooks).toHaveBeenCalledWith(
          modifiedBook
        );
        expect(instance.props.saveCombinedBooks).not.toHaveBeenCalled();
      });
      it('exisiting book with no differences', () => {
        // TODO: get this implemented
      });
      it('new books with modified book', () => {
        amazonBooks[0].amazonAverageRating = 2;
        amazonBooks[0].amazonRatingsCount = 7;
        amazonBooks.push({
          amazonAverageRating: 4.6,
          amazonRatingsCount: 932,
          price: '',
          isbn: '9780553807912',
        });
        googleBooks.push({
          amazonAverageRating: 4.6,
          amazonRatingsCount: 932,
          price: '',
          isbn: '9780553807912',
        });
        goodreadsBooks.push({
          isbn: '9780553807912',
          goodreadsAverageRating: 4.18,
          goodreadsRatingsCount: 11600,
        });
        props = Object.assign({}, props, {
          googleBooks,
          goodreadsBooks,
          amazonBooks,
          bookshelf: newBook,
        });
        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();
        instance.state.loading = true;
        instance.state.searchIsbns = ['9780988995819', '9780553807912'];

        instance.componentDidUpdate(prevProps);

        expect(instance.props.insertModifiedBook).not.toHaveBeenCalled();
        expect(instance.props.saveModifiedBooks).toHaveBeenCalledWith(
          modifiedBook
        );
        expect(instance.props.saveCombinedBooks).toHaveBeenCalledWith([
          {
            amazonAverageRating: 4.6,
            amazonRatingsCount: 932,
            goodreadsAverageRating: 4.18,
            goodreadsRatingsCount: 11600,
            isbn: '9780553807912',
            price: '',
          },
        ]);
      });
      it('modified book with previous modified book', () => {});
      it('new books, modified books, exisiting with no differences', () => {
        // TODO: get this implemented
      });
    });
  });
});
