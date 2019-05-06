import React from 'react';
import { shallow, mount } from 'enzyme';
import { SearchBar, mapStateToProps } from './SearchBar';
import Button from '@material-ui/core/Button';
import { LOADING_STATUSES } from '../../../util/constants';

describe('SearchBar', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      classes: {},
      modifiedBooklist: [],
      booklist: [],
      clearBooks: jest.fn(),
      getAmazonBook: jest.fn(),
      getGoogleBook: jest.fn(),
      getGoodreadsBook: jest.fn(),
      getBookshelf: jest.fn(),
      saveCombinedBooks: jest.fn(),
      amazonBookErrored: false,
      insertModifiedBook: jest.fn(),
      saveModifiedBooks: jest.fn(),
      addBookToBookshelf: jest.fn(),
      updateBookOnBookshelf: jest.fn(),
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
  it('mapStateToProps', () => {
    const mockedState = {
      amazon: {
        books: [{ title: 'amazonBook' }],
        hasErrored: false,
      },
      google: {
        books: [{ title: 'googleBook' }],
        hasErrored: false,
      },
      goodreads: {
        books: [{ title: 'goodreadsBook' }],
        hasErrored: false,
      },
      bookshelf: {
        booklist: [],
        bookshelf: [{ title: 'bookshelf' }],
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state).toEqual({
      amazonBookErrored: false,
      amazonBooks: mockedState.amazon.books,
      booklist: [],
      bookshelf: mockedState.bookshelf.bookshelf,
      goodreadsBooks: mockedState.goodreads.books,
      goodreadsBooksErrored: false,
      googleBooks: mockedState.google.books,
      googleBooksErrored: false,
      modifiedBooklist: undefined,
    });
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
      it('TextField change updates state', () => {
        const textfield = wrapper.find('TextField');
        textfield.simulate('change', { target: { value: 'update state' } });

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
      it('calls handleSearch on button click', () => {
        wrapper.setState({
          multiline: '12345',
          loading: false,
        });
        const button = wrapper.find('span').childAt(0);
        button.simulate('click');

        expect(instance.state.searchIsbns).toEqual(['12345']);
      });
      it('does not setState on handleSearch if loading', () => {
        instance.state.loading = true;
        instance.state.multiline = '9780805835595';
        instance.handleSearch();
        expect(instance.state.searchIsbns).toEqual([]);
      });
    });
    describe('promise array', () => {
      it('function calls', () => {
        instance.state.multiline = '9780805835595,9780800731915,9780375700002';
        instance.handleSearch();

        expect(instance.props.getAmazonBook).toHaveBeenCalledTimes(3);
        expect(instance.props.getGoogleBook).toHaveBeenCalledTimes(3);
        expect(instance.props.getGoodreadsBook).toHaveBeenCalledTimes(3);
      });
    });
  });
  describe('Saving', () => {
    let book = {};
    beforeEach(() => {
      book = {
        amazonAverageRating: 4.7,
        amazonRatingsCount: 1915,
        price: '',
        isbn: '9780064404990',
        title: 'Year of the Griffin',
        subtitle: '',
        description:
          "It is eight years after the tours from offworld have stopped. High Chancellor Querida has retired, leaving Wizard Corkoran in charge of the Wizards' University. Although Wizard Corkoran's obsession is to be the first man on the moon, and most of his time is devoted to this project, he decides he will teach the new first years himself in hopes of currying the favor of the new students' families—for surely they must all come from wealth, important families—and obtaining money for the University (which it so desperately needs). But Wizard Corkoran is dismayed to discover that one of those students—indeed, one he had such high hopes for, Wizard Derk's own daughter Elda—is a hugh golden griffin, and that none of the others has any money at all. Wizard Corkoran's money-making scheme backfires, and when Elda and her new friends start working magic on their own, the schemes go wronger still. And when, at length, Elda ropes in her brothers Kit and Blade to send Corkoran to the moon . . . well . . . life at the Wizards' University spins magically and magnificently out of control. This breathtakingly brilliant sequel to Dark Lord of Derkholm is all one would expect from this master of genre.",
        thumbnail:
          'http://books.google.com/books/content?id=zCe6gRHonZgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        categories: ['Juvenile Fiction'],
        goodreadsAverageRating: 4.21,
        goodreadsRatingsCount: 1860886,
        adjustedRating: 4.455,
      };
    });
    describe('Fab save', () => {
      it('hides save button if there is no books in booklist', () => {
        wrapper = mount(<SearchBar {...props} />);
        const saveIcon = wrapper.find('button').at(1);
        expect(saveIcon.length).toEqual(0);
      });
      it('shows save button if there are books in booklist and not in modifiedbooklist', () => {
        props = Object.assign({}, props, { booklist: [book] });
        wrapper = mount(<SearchBar {...props} />);

        const saveIcon = wrapper.find('button').at(1);
        expect(saveIcon).toMatchSnapshot();
      });

      it('shows save button if there are no books in booklist but in modifiedBooklist', () => {
        props = Object.assign({}, props, { modifiedBooklist: [book] });
        wrapper = mount(<SearchBar {...props} />);

        const saveIcon = wrapper.find('button').at(1);
        expect(saveIcon).toMatchSnapshot();
      });

      it('calls handleSave on button click', () => {
        props = Object.assign({}, props, { booklist: [book] });
        wrapper = mount(<SearchBar {...props} />);

        const saveIcon = wrapper.find('button').at(1);
        saveIcon.simulate('click');

        expect(wrapper.props().addBookToBookshelf).toHaveBeenCalledTimes(1);
        expect(wrapper.props().addBookToBookshelf).toBeCalledWith(
          props.booklist
        );
      });
    });
    describe('handleSave', () => {
      it('calls addBookToBookshelf with no modified books', () => {
        props = Object.assign({}, props, { booklist: [book] });
        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();

        instance.handleSave();

        expect(instance.props.addBookToBookshelf).toHaveBeenCalledTimes(1);
        expect(instance.props.addBookToBookshelf).toBeCalledWith(
          props.booklist
        );
      });
      it('calls updateBookOnBookshelf with no books in booklist', () => {
        book = Object.assign({}, book, {
          _id: '12341346256243',
          differences: [
            {
              key: 'goodreadsRatingsCount',
              currentValue: book.goodreadsRatingsCount,
              newValue: 1860898,
            },
            {
              key: 'title',
              currentValue: book.title,
              newValue: 'new title',
            },
          ],
        });
        props = Object.assign({}, props, { modifiedBooklist: [book] });
        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();

        instance.handleSave();

        expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(1);
        expect(instance.props.updateBookOnBookshelf).toBeCalledWith(book._id, {
          goodreadsRatingsCount: 1860898,
          title: 'new title',
        });
      });
      it('calls addBookToBookshelf and updateBookOnBookshelf', () => {
        const modifiedBook = Object.assign({}, book, {
          _id: '12341346256243',
          differences: [
            {
              key: 'goodreadsRatingsCount',
              currentValue: book.goodreadsRatingsCount,
              newValue: 1860898,
            },
            {
              key: 'title',
              currentValue: book.title,
              newValue: 'new title',
            },
          ],
        });
        props = Object.assign({}, props, {
          booklist: [book],
          modifiedBooklist: [modifiedBook],
        });
        wrapper = shallow(<SearchBar {...props} />);
        instance = wrapper.instance();

        instance.handleSave();

        expect(instance.props.addBookToBookshelf).toHaveBeenCalledTimes(1);
        expect(instance.props.addBookToBookshelf).toBeCalledWith(
          props.booklist
        );
        expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(1);
        expect(instance.props.updateBookOnBookshelf).toBeCalledWith(
          modifiedBook._id,
          {
            goodreadsRatingsCount: 1860898,
            title: 'new title',
          }
        );
      });
    });
  });
  describe('onClose', () => {
    it('sets duplicatedISBNs to empty array', () => {
      instance.state.duplicatedISBNs = ['9780805835595', '9780800731915'];
      instance.onClose();

      expect(instance.state.duplicatedISBNs).toEqual([]);
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
        // const book = newBook[0]
        // amazonBooks = [{
        //     amazonAverageRating: book.amazonAverageRating,
        //     amazonRatingsCount: book.amazonRatingsCount,
        //     price: book.price,
        //     isbn: book.isbn,
        //   },
        // ];
        // goodreadsBooks = [
        //   {
        //     isbn: book.isbn,
        //     goodreadsAverageRating: book.goodreadsAverageRating,
        //     goodreadsRatingsCount: book.goodreadsRatingsCount,
        //   },
        // ];
        // googleBooks = [
        //   {
        //     title: book.title,
        //     isbn: book.isbn,
        //     subtitle: book.subtitle,
        //     description: book.description,
        //     thumbnail: book.thumbnail,
        //     categories: book.categories,
        //   }
        // ]
        // props = Object.assign({}, props, {
        //   googleBooks,
        //   goodreadsBooks,
        //   amazonBooks,
        //   bookshelf: newBook,
        // });
        // wrapper = shallow(<SearchBar {...props} />);
        // instance = wrapper.instance();
        // instance.state.loading = true;
        // instance.state.searchIsbns = [book.isbn];
        //
        // instance.componentDidUpdate(prevProps);
        //
        // expect(instance.props.insertModifiedBook).not.toHaveBeenCalled();
        // expect(instance.props.saveModifiedBooks).not.toHaveBeenCalled();
        // expect(instance.props.saveCombinedBooks).not.toHaveBeenCalled();
        // expect(instance.state.duplicatedISBNs).toEqual([book.isbn])
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
      it('modified book with previous modified book', () => {
        // TODO: get this implemented
      });
      it('new books, modified books, exisiting with no differences', () => {
        // TODO: get this implemented
      });
    });
  });
  describe('search for already searched book', () => {
    it('is not added to booklist if already present', () => {
      const isbn = '1234'
      props = Object.assign({}, props, { booklist: [{ isbn }] });
      wrapper = shallow(<SearchBar {...props} />);
      instance = wrapper.instance();

      instance.state.multiline = isbn;
      instance.handleSearch();

      expect(instance.props.getAmazonBook).not.toHaveBeenCalled();
      expect(instance.props.getGoogleBook).not.toHaveBeenCalled();
      expect(instance.props.getGoodreadsBook).not.toHaveBeenCalled();
      expect(instance.state.duplicatedISBNs).toEqual([isbn])
    });
    it('calls the promise array with only non-exisiting books', () => {
      const isbn = ['000', '123']
      props = Object.assign({}, props, { booklist: [{ isbn: isbn[1] }] });
      wrapper = shallow(<SearchBar {...props} />);
      instance = wrapper.instance();

      instance.state.multiline = isbn.join(',');
      instance.handleSearch();

      expect(instance.props.getAmazonBook).toHaveBeenCalledTimes(1);
      expect(instance.props.getGoogleBook).toHaveBeenCalledTimes(1);
      expect(instance.props.getGoodreadsBook).toHaveBeenCalledTimes(1);
      expect(instance.state.duplicatedISBNs).toEqual([isbn[1]])
    })
    // it('displays correct duplicatedISBNs when booklist and bookshelf have duplicates', () => {
    
    // })
  });
});
