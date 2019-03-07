import React from 'react';
import { shallow } from 'enzyme';
import Results from './Results';

describe('Results', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      handleSave: jest.fn(),
      booklist: [
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
      ],
    };
    wrapper = shallow(<Results {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders with no props', () => {
    wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with correct props', () => {
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with no save function', () => {
    props = Object.assign({}, props, { handleSave: undefined });
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
