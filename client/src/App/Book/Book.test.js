import { Book } from './Book';
import React from 'react';
import { shallow, mount } from 'enzyme';

describe('Book', () => {
  let wrapper;
  let props;
  let instance;
  beforeEach(() => {
    props = {
      classes: {},
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      filters: { read: false, owned: false },
      book: {
        _id: '5c83043936c4b64ed32877f2',
        adjustedRating: 4.0355443753888665,
        amazonAverageRating: 4.3,
        amazonRatingsCount: 3594,
        categories: ['BABY'],
        description:
          'Discover the positive prescription for curing sleepless nights and fussy babies.',
        goodreadsAverageRating: 3.61,
        goodreadsRatingsCount: 11162,
        isbn: '9781932740080',
        owned: false,
        price: '',
        read: false,
        subtitle: 'Book One',
        thumbnail: 'http://books.google.com/books/content',
        title: 'On Becoming Baby Wise',
      },
    };
    wrapper = shallow(<Book {...props} />);
    instance = wrapper.instance();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('renders', () => {
    it('renders with proper props but not expanded', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('renders with proper props and expanded', () => {
      wrapper.setState({
        expanded: true,
      });
      expect(wrapper).toMatchSnapshot();
    });
    it('does not render if book is empty', () => {
      props = Object.assign({}, props, { book: {} });
      wrapper = shallow(<Book {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    describe('filters', () => {
      it('does not show if read with unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: false },
          book: { read: true },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('shows if unread with unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: false },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('does not show if unowned with owned filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: false, owned: true },
          book: { owned: false },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('shows if owned with owned filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: false, owned: true },
          book: { owned: true, categories: [] },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('shows if unread and owned with owned and unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: true },
          book: { owned: true, categories: [] },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('does not show if read and owned with owned and unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: true },
          book: { owned: true, read: true },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('does not show if unread and unowned with owned and unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: true },
          book: { owned: false, read: false },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
      it('does not show if read and unowned with owned and unread filter selected', () => {
        props = Object.assign({}, props, {
          filters: { read: true, owned: true },
          book: { owned: false, read: true },
        });
        wrapper = shallow(<Book {...props} />);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
  describe('componentDidMount', () => {
    it('sets state of differences on an existing book', () => {
      const book = Object.assign({}, props.book, {
        categories: ['no'],
        goodreadsAverageRating: 4,
        amazonRatingsCount: 123,
      });
      props = Object.assign({}, props, {
        bookshelf: [props.book],
        book,
      });
      wrapper = shallow(<Book {...props} />);
      instance = wrapper.instance();
      instance.componentDidMount();
      expect(instance.state.edits).toEqual([
        {
          currentValue: props.bookshelf[0].amazonRatingsCount,
          key: 'amazonRatingsCount',
          newValue: book.amazonRatingsCount,
        },
        {
          currentValue: props.bookshelf[0].goodreadsAverageRating,
          key: 'goodreadsAverageRating',
          newValue: book.goodreadsAverageRating,
        },
      ]);
      expect(wrapper).toMatchSnapshot();
    });
    it('sets state of differences on an existing book if no differences', () => {
      props = Object.assign({}, props, {
        bookshelf: [props.book],
      });
      wrapper = shallow(<Book {...props} />);
      instance = wrapper.instance();
      instance.componentDidMount();
      expect(instance.state.edits).toEqual([]);
    });
  });
  describe('validateSave', () => {
    it('does not call handleSave if values are equal', () => {
      instance.validateSave('title', props.book.title);
      expect(instance.props.handleSave).not.toHaveBeenCalled();
    });
    it('calls handleSave if values are different', () => {
      instance.validateSave('title', 'new title');
      expect(instance.props.handleSave.mock.calls).toMatchSnapshot();
    });
    it('turns newValue into an array if key is categories', () => {
      instance.validateSave('categories', ['Category, Category 2']);
      expect(instance.props.handleSave.mock.calls).toMatchSnapshot();
    });
  });
  describe('handleExpandClick', () => {
    it('updates expand state', () => {
      instance.handleExpandClick();
      expect(instance.state.expanded).toBe(true);

      instance.handleExpandClick();
      expect(instance.state.expanded).toBe(false);
    });
  });
  describe('toggle owned', () => {
    it('renders with owned', () => {
      wrapper.setState({
        owned: true,
      });
      expect(wrapper).toMatchSnapshot();
    });
    it('read onclick', () => {
      wrapper = mount(<Book {...props} />);
      instance = wrapper.instance();
      const readButton = wrapper.find('button').at(1);
      readButton.simulate('click');
      expect(instance.state.read).toEqual(true);
      expect(instance.props.handleSave.mock.calls).toMatchSnapshot();
    });
  });
  describe('toggles read', () => {
    it('renders with read', () => {
      wrapper.setState({
        read: true,
      });
      expect(wrapper).toMatchSnapshot();
    });
    it('owned onclick', () => {
      wrapper = mount(<Book {...props} />);
      instance = wrapper.instance();
      const ownedButton = wrapper.find('button').at(2);
      ownedButton.simulate('click');
      expect(instance.state.owned).toEqual(true);
      expect(instance.props.handleSave.mock.calls).toMatchSnapshot();
    });
  });
  describe('delete', () => {
    it('calls handleDelete on delete button click', () => {
      wrapper = mount(<Book {...props} />);
      instance = wrapper.instance();
      const deleteButton = wrapper.find('button').at(0);
      deleteButton.simulate('click');
      expect(instance.props.handleDelete.mock.calls).toMatchSnapshot();
    });
  });
});
