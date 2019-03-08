import React from 'react';
import { Search } from './Search';
import { shallow } from 'enzyme';
import { LOADING_STATUSES } from '../../util/constants';

describe('Search', () => {
  let props;
  let wrapper;
  let instance;

  const booklist = [
    {
      categories: ['Parenting'],
      _id: '5c801a9f4549aac8fe03f088',
      amazonAverageRating: 0,
      amazonRatingsCount: 0,
      price: '',
      isbn: '9780310338130',
      title: 'Hands Free Mama',
      subtitle:
        'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
      description:
        '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless conversations online and off about freeing ourselves from the vicious cycle of keeping up with our overstuffed agendas. Hands Free Mama has the power to keep that conversation going and remind us that we must not let our lives pass us by.” --Arianna Huffington, Chair, President, and Editor-in-Chief of the Huffington Post Media Group, nationally syndicated columnist, and author of thirteen books http://www.huffingtonpost.com/ DISCOVER THE POWER, JOY, AND LOVE of Living “Hands Free” If technology is the new addiction, then multi-tasking is the new marching order. We check our email while cooking dinner, send a text while bathing the kids, and spend more time looking into electronic screens than into the eyes of our loved ones. With our never-ending to-do lists and jam-packed schedules, it’s no wonder we’re distracted. But this isn’t the way it has to be. In July 2010, special education teacher and mother Rachel Macy Stafford decided enough was enough. Tired of losing track of what matters most in life, Rachel began practicing simple strategies that enabled her to momentarily let go of largely meaningless distractions and engage in meaningful soul-to-soul connections. She started a blog to chronicle her endeavors and soon saw how both external and internal distractions had been sabotaging her happiness and preventing her from bonding with the people she loves most. Hands Free Mama is the digital society’s answer to finding balance in a media-saturated, perfection-obsessed world. It doesn’t mean giving up all technology forever. It doesn’t mean forgoing our jobs and responsibilities. What it does mean is seizing the little moments that life offers us to engage in real and meaningful interaction. It means looking our loved ones in the eye and giving them the gift of our undivided attention, leaving the laundry till later to dance with our kids in the rain, and living a present, authentic, and intentional life despite a world full of distractions. So join Rachel and go hands-free. Discover what happens when you choose to open your heart—and your hands—to the possibilities of each God-given moment.',
      thumbnail:
        'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      goodreadsAverageRating: 3.59,
      goodreadsRatingsCount: 3180,
      __v: 0,
    },
    {
      categories: ['Parliamentary practice'],
      _id: '5c801a9f4549aac8fe03f089',
      amazonAverageRating: 4.6,
      amazonRatingsCount: 848,
      price: '',
      isbn: '9780306820205',
      title: 'Pocket Manual of Rules of Order for Deliberative Assemblies',
      subtitle: '',
      thumbnail:
        'http://books.google.com/books/content?id=QegaAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      goodreadsAverageRating: 3.87,
      goodreadsRatingsCount: 1313,
      __v: 0,
    },
  ];
  const modifiedBooklist = [
    {
      amazonAverageRating: 4.4,
      amazonRatingsCount: 340,
      price: '',
      isbn: '9780310338130',
      title: 'Hands Free Mama',
      subtitle:
        'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
      description:
        '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless conversations online and off about freeing ourselves from the vicious cycle of keeping up with our overstuffed agendas. Hands Free Mama has the power to keep that conversation going and remind us that we must not let our lives pass us by.” --Arianna Huffington, Chair, President, and Editor-in-Chief of the Huffington Post Media Group, nationally syndicated columnist, and author of thirteen books http://www.huffingtonpost.com/ DISCOVER THE POWER, JOY, AND LOVE of Living “Hands Free” If technology is the new addiction, then multi-tasking is the new marching order. We check our email while cooking dinner, send a text while bathing the kids, and spend more time looking into electronic screens than into the eyes of our loved ones. With our never-ending to-do lists and jam-packed schedules, it’s no wonder we’re distracted. But this isn’t the way it has to be. In July 2010, special education teacher and mother Rachel Macy Stafford decided enough was enough. Tired of losing track of what matters most in life, Rachel began practicing simple strategies that enabled her to momentarily let go of largely meaningless distractions and engage in meaningful soul-to-soul connections. She started a blog to chronicle her endeavors and soon saw how both external and internal distractions had been sabotaging her happiness and preventing her from bonding with the people she loves most. Hands Free Mama is the digital society’s answer to finding balance in a media-saturated, perfection-obsessed world. It doesn’t mean giving up all technology forever. It doesn’t mean forgoing our jobs and responsibilities. What it does mean is seizing the little moments that life offers us to engage in real and meaningful interaction. It means looking our loved ones in the eye and giving them the gift of our undivided attention, leaving the laundry till later to dance with our kids in the rain, and living a present, authentic, and intentional life despite a world full of distractions. So join Rachel and go hands-free. Discover what happens when you choose to open your heart—and your hands—to the possibilities of each God-given moment.',
      thumbnail:
        'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Family & Relationships'],
      goodreadsAverageRating: 3.59,
      goodreadsRatingsCount: 3180,
      differences: [
        {
          key: '0',
          currentValue: 'Parenting',
          newValue: 'Family & Relationships',
        },
        {
          key: 'amazonAverageRating',
          currentValue: 0,
          newValue: 4.4,
        },
        {
          key: 'amazonRatingsCount',
          currentValue: 0,
          newValue: 340,
        },
      ],
      _id: '5c801a9f4549aac8fe03f088',
    },
  ];
  beforeEach(() => {
    props = { booklist, modifiedBooklist, insertModifiedBook: jest.fn() };
    wrapper = shallow(<Search {...props} />);
    instance = wrapper.instance();
  });
  describe('rendering', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('renders with no props', () => {
      const noPropsWrapper = shallow(<Search />);
      expect(noPropsWrapper).toMatchSnapshot();
    });
    it('renders with booklist but no modifiedBooklist', () => {
      const booklistProps = { booklist };
      const booklistPropsWrapper = shallow(<Search {...booklistProps} />);
      expect(booklistPropsWrapper).toMatchSnapshot();
    });
    it('renders with booklist and modifiedBooklist', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('Notification', () => {
    it('opens notification on save', () => {
      expect(instance.state.open).toEqual(false);
      const prevProps = {
        saveStatus: {
          status: LOADING_STATUSES.initial,
          message: '',
        },
      };
      props = Object.assign({}, props, {
        saveStatus: {
          status: LOADING_STATUSES.success,
          message: 'Save Successful',
        },
      });
      wrapper = shallow(<Search {...props} />);
      instance = wrapper.instance();
      instance.componentDidUpdate(prevProps);
      expect(instance.state.open).toEqual(true);
      expect(wrapper).toMatchSnapshot();
    });
    it('closes notification on initial status', () => {
      const prevProps = {
        saveStatus: {
          status: LOADING_STATUSES.success,
          message: 'Save Successful',
        },
      };
      props = Object.assign({}, props, {
        saveStatus: {
          status: LOADING_STATUSES.initial,
          message: 'Initial',
        },
      });

      wrapper = shallow(<Search {...props} />);
      instance = wrapper.instance();

      instance.state.open = true;

      instance.componentDidUpdate(prevProps);
      expect(instance.state.open).toEqual(false);
    });
    it('handleClose sets open state to false', () => {
      instance.state.open = true;
      expect(instance.state.open).toEqual(true);

      instance.handleClose();
      expect(instance.state.open).toEqual(false);
    });
    it('handleClose clickaway keeps notification open', () => {
      instance.state.open = true;
      expect(instance.state.open).toEqual(true);

      instance.handleClose({}, 'clickaway');
      expect(instance.state.open).toEqual(true);
    });
  });
  describe('handleSearchedBookEditSave', () => {
    it('saves an edited non exisiting book', () => {
      const book = {
        amazonAverageRating: 4.7,
        amazonRatingsCount: 1404,
        price: '',
        isbn: '9780718031824',
        title: 'Interrupted1',
        subtitle: 'When Jesus Wrecks Your Comfortable Christianity',
        description:
          'Interrupted follows the author’s messy journey through life and church and into living on mission. Snatching Jen from the grip of her consumer life, God began asking her questions like, “What is really the point of My Church? What have I really asked of you?” She was far too busy doing church than being church, even as a pastor’s wife, an author of five Christian books, and a committed believer for 26 years. She discovered she had missed the point. Christ brought Jen and her family to a place of living on mission by asking them tough questions, leading them through Scripture, and walking together with them on the path. Interrupted invites readers to take a similar journey.',
        thumbnail:
          'http://books.google.com/books/content?id=6ZkaAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        categories: ['Religion'],
        goodreadsAverageRating: 4.11,
        goodreadsRatingsCount: 22060,
      };
      const edits = [
        { key: 'title', currentValue: 'Interrupted', newValue: 'Interrupted1' },
      ];
      instance.handleSearchedBookEditSave(book, edits);
      expect(props.insertModifiedBook).toBeCalledWith([book]);
    });
    it('saves an edited exisiting book', () => {
      const book = {
        amazonAverageRating: 4.4,
        amazonRatingsCount: 340,
        price: '',
        isbn: '9780310338130',
        title: 'Hands Free Mama1',
        subtitle:
          'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
        description:
          '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless conversations online and off about freeing ourselves from the vicious cycle of keeping up with our overstuffed agendas. Hands Free Mama has the power to keep that conversation going and remind us that we must not let our lives pass us by.” --Arianna Huffington, Chair, President, and Editor-in-Chief of the Huffington Post Media Group, nationally syndicated columnist, and author of thirteen books http://www.huffingtonpost.com/ DISCOVER THE POWER, JOY, AND LOVE of Living “Hands Free” If technology is the new addiction, then multi-tasking is the new marching order. We check our email while cooking dinner, send a text while bathing the kids, and spend more time looking into electronic screens than into the eyes of our loved ones. With our never-ending to-do lists and jam-packed schedules, it’s no wonder we’re distracted. But this isn’t the way it has to be. In July 2010, special education teacher and mother Rachel Macy Stafford decided enough was enough. Tired of losing track of what matters most in life, Rachel began practicing simple strategies that enabled her to momentarily let go of largely meaningless distractions and engage in meaningful soul-to-soul connections. She started a blog to chronicle her endeavors and soon saw how both external and internal distractions had been sabotaging her happiness and preventing her from bonding with the people she loves most. Hands Free Mama is the digital society’s answer to finding balance in a media-saturated, perfection-obsessed world. It doesn’t mean giving up all technology forever. It doesn’t mean forgoing our jobs and responsibilities. What it does mean is seizing the little moments that life offers us to engage in real and meaningful interaction. It means looking our loved ones in the eye and giving them the gift of our undivided attention, leaving the laundry till later to dance with our kids in the rain, and living a present, authentic, and intentional life despite a world full of distractions. So join Rachel and go hands-free. Discover what happens when you choose to open your heart—and your hands—to the possibilities of each God-given moment.',
        thumbnail:
          'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        categories: ['Family & Relationships'],
        goodreadsAverageRating: 3.59,
        goodreadsRatingsCount: 3180,
        differences: [
          {
            key: 'amazonAverageRating',
            currentValue: 0,
            newValue: 4.4,
          },
          {
            key: 'amazonRatingsCount',
            currentValue: 0,
            newValue: 340,
          },
        ],
        _id: '5c801a9f4549aac8fe03f088',
      };
      const edits = [
        {
          key: 'title',
          currentValue: 'Hands Free Mama',
          newValue: 'Hands Free Mama1',
        },
      ];
      const modifiedBook = {
        amazonAverageRating: 4.4,
        amazonRatingsCount: 340,
        adjustedRating: 3.639172059456242,
        price: '',
        isbn: '9780310338130',
        title: 'Hands Free Mama',
        subtitle:
          'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
        description:
          '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless conversations online and off about freeing ourselves from the vicious cycle of keeping up with our overstuffed agendas. Hands Free Mama has the power to keep that conversation going and remind us that we must not let our lives pass us by.” --Arianna Huffington, Chair, President, and Editor-in-Chief of the Huffington Post Media Group, nationally syndicated columnist, and author of thirteen books http://www.huffingtonpost.com/ DISCOVER THE POWER, JOY, AND LOVE of Living “Hands Free” If technology is the new addiction, then multi-tasking is the new marching order. We check our email while cooking dinner, send a text while bathing the kids, and spend more time looking into electronic screens than into the eyes of our loved ones. With our never-ending to-do lists and jam-packed schedules, it’s no wonder we’re distracted. But this isn’t the way it has to be. In July 2010, special education teacher and mother Rachel Macy Stafford decided enough was enough. Tired of losing track of what matters most in life, Rachel began practicing simple strategies that enabled her to momentarily let go of largely meaningless distractions and engage in meaningful soul-to-soul connections. She started a blog to chronicle her endeavors and soon saw how both external and internal distractions had been sabotaging her happiness and preventing her from bonding with the people she loves most. Hands Free Mama is the digital society’s answer to finding balance in a media-saturated, perfection-obsessed world. It doesn’t mean giving up all technology forever. It doesn’t mean forgoing our jobs and responsibilities. What it does mean is seizing the little moments that life offers us to engage in real and meaningful interaction. It means looking our loved ones in the eye and giving them the gift of our undivided attention, leaving the laundry till later to dance with our kids in the rain, and living a present, authentic, and intentional life despite a world full of distractions. So join Rachel and go hands-free. Discover what happens when you choose to open your heart—and your hands—to the possibilities of each God-given moment.',
        thumbnail:
          'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        categories: ['Family & Relationships'],
        goodreadsAverageRating: 3.59,
        goodreadsRatingsCount: 3180,
        differences: [
          {
            key: 'amazonAverageRating',
            currentValue: 0,
            newValue: 4.4,
          },
          {
            key: 'amazonRatingsCount',
            currentValue: 0,
            newValue: 340,
          },
          {
            key: 'title',
            currentValue: 'Hands Free Mama',
            newValue: 'Hands Free Mama1',
          },
        ],
        _id: '5c801a9f4549aac8fe03f088',
      };
      instance.handleSearchedBookEditSave(book, edits);
      expect(props.insertModifiedBook).toBeCalledWith([modifiedBook]);
    });
  });
});
