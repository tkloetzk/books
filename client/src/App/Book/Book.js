import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import ReadBook from './read-book.svg';
import UnreadBook from './unread-book.svg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 200,
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
    paddingTop: '83%',
    backgroundSize: '100px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
};

class Book extends Component {
  state = {
    anchorEl: null,
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

  render() {
    const { book, classes } = this.props;
    const { anchorEl } = this.state;

    const title =
      book.title.length < 92 ? book.title : book.title.substring(0, 92) + '...';

    const subheader =
      book.subtitle.length < 54
        ? book.subtitle
        : book.subtitle.substring(0, 54) + '...';

    const description =
      book.description.length < 285
        ? book.description
        : book.description.substring(0, 285) + '...';

    const highlighted =
      !book.amazonAverageRating ||
      !book.amazonRatingsCount ||
      !book.goodreadsAverageRating ||
      !book.goodreadsRatingsCount;

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
          subheader={subheader}
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
          image={book.thumbnail}
          title={book.title}
        />
        <CardContent className={classes.content}>{description}</CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <img src={UnreadBook} alt="Unread Book" />
          {Math.round(book.adjustedRating * 100) / 100}
        </CardActions>
      </Card>
    );
  }
}

Book.defaultProps = {
  book: {
    title: '',
    subtitle: '',
    description: '',
  },
};
export default withStyles(styles)(Book);
