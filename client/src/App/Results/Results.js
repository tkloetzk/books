import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReadBook from './read-book.svg';
import UnreadBook from './unread-book.svg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import amber from '@material-ui/core/colors/amber';
import Typography from '@material-ui/core/Typography';
const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
  card: {
    maxWidth: 193,
    margin: '6px',
    padding: '5px',
  },
  header: {
    '& span': {
      fontSize: '14px',
    },
    padding: '6px',
    height: '73px',
    textAlign: 'center',
  },
  content: {
    fontSize: '12px',
    padding: '6px',
  },
  media: {
    height: 0,
    paddingTop: '150%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  warning: {
    backgroundColor: amber[700],
  },
});

class Results extends React.Component {
  state = {
    anchorEl: null,
    open: false,
    booklist: [
      {
        isbn: '9781508450061',
        title:
          "The Ladies' Book of Etiquette, and Manual of Politeness: A Complete Hand Book for the Use of the Lady in Polite Society",
        image: 'https://images.gr-assets.com/books/1320440996m/330983.jpg',
        href: null,
        price: '',
        description:
          'This is a facsimile reprint of the original book by Florence Hartley, rebuilt using the latest technology. There are no poor, missing or blurred pages and all photographic images have been professionally restored. At Yokai Publishing we believe that by restoring this title to print it will live on for generations to come.',
        amazonAverageRating: 4.0,
        goodreadsAverageRating: 3.58,
        amazonRatingsCount: 59,
        goodreadsRatingsCount: 266,
        adjustedRating: 3.9234,
      },
      {
        isbn: '9780449015933',
        title:
          'The Butler Speaks: A Return to Proper Etiquette, Stylish Entertaining, and the Art of Good Housekeeping',
        image: 'https://images.gr-assets.com/books/1471287427m/28686855.jpg',
        href: null,
        price: '$13.56',
        description:
          '<i>Host a dinner party * Make a bed * Set a table * Use the proper fork * Polish silver * Prepare high tea * Present a calling card * Make conversation * Fold a shirt </i>... all with the charm, ease and sophistication of a butler. <br />     In a clear, straightforward style, Charles MacPherson lays out the essentials of entertaining and household management in this beautifully illustrated style, etiquette and entertainment guide. For anyone who rents or owns--be it a small urban condo or a lavish country estate--<i>\n  <b>The Butler Speaks</b>\n</i> includes everything you need to know to simplify, organize and care for your home. It also offers modern advice on personal style and etiquette--how to receive guests; present your business card; make polite dinner conversation-- and advice on entertaining at home--how to make a cheese plate; hold your cutlery; set a table--all with the flair, charm and unpretentious grace of the butler.',
        amazonAverageRating: 4.7,
        goodreadsAverageRating: 3.8,
        amazonRatingsCount: 32,
        goodreadsRatingsCount: 191,
        adjustedRating: 4.73456,
      },
      {
        isbn: '9780470106723',
        title: 'Etiquette For Dummies',
        image:
          'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
        href: null,
        price: '$12.71',
        description:
          "Life is full of moments when you don't know how to act or how to handle yourself in front of other people. In these situations, etiquette is vital for keeping your sense of humor and your self-esteem intact. But etiquette is not a behavior that you should just turn on and off. This stuffy French word that translates into getting along with others allows you to put people at ease, make them feel good about a situation, and even improve your reputation. <i>Etiquette For Dummies</i> approaches the subject from a practical point of view, throwing out the rulebook full of long, pointless lists. Instead, it sets up tough social situations and shows you how to navigate through them successfully, charming everyone with your politeness and social grace. This straightforward, no-nonsense guide will let you discover the ins and outs of:<br /><br /><br />Basic behavior for family, friends, relationships, and business Grooming, dressing, and staying healthy Coping with unexpected stuff like sneezing or feeling queasy Maintaining a civilized relationship Making friends and keeping them Building positive relationships at work Communicating effectively This book shows you how to take on these situations and make them pleasant. It also gives you great advice for tipping appropriately in all types of services and setting stellar examples for your kids. Full of useful advice and written in a laid-back, friendly style, <i>Etiquette For Dummies</i> has all the tools you need to face any social situation with politeness and courtesy.",
        amazonAverageRating: 4.6,
        goodreadsAverageRating: 3.67,
        amazonRatingsCount: 51,
        goodreadsRatingsCount: 99,
        adjustedRating: 4.5627,
      },
      {
        isbn: '9781578265183',
        title:
          'Manners That Matter Most: The Easy Guide to Etiquette At Home and In the World',
        image: 'https://images.gr-assets.com/books/1411948624m/21432204.jpg',
        href: null,
        price: '$8.22',
        description:
          'Etiquette is one of the most valuable assets a person can have: knowing how best to present yourself, and how to deal with others in a direct, effective manner, is paramount in all personal, professional, and social relationships. <i>Manners That Matter Most </i>seeks to resurrect the bygone customs of good manners and graceful style; all while updating and applying them to the modern age.<br /><br />Covering topics from introductions, greetings and thank-yous, to the etiquette of modern technology (including appropriate places and times to call and text), <i>Manners That Matter Most </i>is a valuable resource and a much-needed guide in our fast-paced world. Suitable for all readers in all social situations, <i>Manners That Matter Most</i> contains both the information and the support you need to gain and give more consideration in your social encounters. With an emphasis on graciousness and chivalry that lends the book its authoritative tone, <i>Manners That Matter Most </i>is the essential companion for anyone looking to put their best foot forward in any situation.<br /><br /><i>Manners That Matter Most</i> also includes:<br /> * Inspirational quotes on the importance of courtesy, respect and dignity<br /> * The 25 essential lessons everyone should learn to cultivate better manners<br /> * Tips for more effective communication with family, friends and co-workers<br /><br /><i>Manners That Matter Most</i> takes an old subject and presents it in a fresh and accessible way, as it reminds us why good practice in etiquette not only makes the practitioner look good, but enhances society as a whole. With <i>Manners That Matter Most</i>, the world opens up—and you know just what to say.',
        amazonAverageRating: 0,
        goodreadsAverageRating: 3.32,
        amazonRatingsCount: 11,
        goodreadsRatingsCount: 34,
        adjustedRating: 3.5123,
      },
    ],
  };

  handleExpandClick = event => {
    console.log('clicked');
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  // TODO: Create modal instead of redirecting
  viewAmazonPage = href => {
    var win = window.open(href, '_blank');
    win.focus();
    this.handleClose();
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes /*, booklist */ } = this.props;
    const { anchorEl, booklist } = this.state;
    return (
      <React.Fragment>
        {booklist.map(book => {
          const title =
            book.title.length < 92
              ? book.title
              : book.title.substring(0, 92) + '...';
          const highlighted =
            !book.amazonAverageRating ||
            !book.amazonRatingsCount ||
            !book.goodreadsAverageRating ||
            !book.goodreadsRatingsCount ||
            !book.adjustedRating;
          return (
            <Card
              className={classes.card}
              key={book.isbn}
              style={{ backgroundColor: highlighted ? 'yellow' : null }}
            >
              <CardHeader
                className={classes.header}
                action={
                  book.href && (
                    <IconButton onClick={this.handleExpandClick}>
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
                title={title}
              />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={() => this.viewAmazonPage(book.href)}>
                  View on Amazon
                </MenuItem>
              </Menu>
              <CardMedia
                className={classes.media}
                image={book.image}
                title={book.title}
              />
              <CardContent className={classes.content}>
                {unescape(book.description).substring(0, 285)}...
              </CardContent>
              <CardActions className={classes.actions} disableActionSpacing>
                <img src={UnreadBook} />
                {Math.round(book.adjustedRating * 100) / 100}
              </CardActions>
            </Card>
          );
        })}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    booklist: state.goodreads.booklist,
  };
};

Results.defaultProps = {
  booklist: [],
};

export default connect(mapStateToProps)(withStyles(styles)(Results));
