import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import ReadBook from './read-book.svg';
import UnreadBook from '@material-ui/icons/BookOutlined';
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
    height: '145px',
  },
  media: {
    height: 0,
    paddingTop: '83%',
    backgroundSize: '100px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: '0px',
  },
};
function RatingDisplay(props) {
  if (!props.book) {
    return null;
  }

  if (props.book.adjustedRating) {
    return (
      <Typography>
        {Math.round(props.book.adjustedRating * 1000) / 1000}
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Typography style={{ textAlign: 'end' }}>
        Amazon Rating:{' '}
        {Math.round(props.book.amazonAverageRating * 1000) / 1000}
        <br />
        Goodreads Rating:{' '}
        {Math.round(props.book.goodreadsAverageRating * 1000) / 1000}
      </Typography>
    </React.Fragment>
  );
}
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
      book.subtitle.length < 45
        ? book.subtitle
        : book.subtitle.substring(0, 45) + '...';

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

        <div className={classes.actions}>
          <IconButton aria-label="Delete" className={classes.icon}>
            <UnreadBook fontSize="large" />
          </IconButton>
          <RatingDisplay book={book} />
        </div>
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
