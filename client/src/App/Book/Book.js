import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
// import ReadBook from './read-book.svg';
import UnreadBook from '@material-ui/icons/BookOutlined';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/icons/AnnouncementOutlined';
import ReactTooltip from 'react-tooltip';
import get from 'lodash/get';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import isEmpty from 'lodash/isEmpty';
import EditableLabel from 'react-inline-editing';
import util from '../../util/combineBooks';
import { insertModifiedBook } from '../../store/bookshelf/bookshelfActions';
import { connect } from 'react-redux';
import SaveIcon from '@material-ui/icons/Save';

const styles = {
  card: {
    maxWidth: 200,
    margin: '6px',
    padding: '5px',
    maxHeight: 465,
  },
  different: {
    cursor: 'pointer',
    boxShadow:
      '0px 0px 3px 6px yellow, 0px 1px 1px 2px yellow, 0px 2px 1px 1px yellow',
  },
  header: {
    '& span': {
      fontSize: '14px',
    },
    height: '73px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
  expand: {
    transform: 'rotate(0deg)',
    // transition: theme.transitions.create('transform', {
    //   duration: theme.transitions.duration.shortest,
    // }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    margin: 'auto',
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

  if (!props.expanded) {
    return (
      <React.Fragment>
        <Typography style={{ textAlign: 'end' }}>
          Amazon: {Math.round(props.book.amazonAverageRating * 1000) / 1000}
          <br />
          Goodreads:{' '}
          {Math.round(props.book.goodreadsAverageRating * 1000) / 1000}
        </Typography>
      </React.Fragment>
    );
  }
  return null;
}
export class Book extends Component {
  state = {
    anchorEl: null,
    expanded: false,
    saveIcon: false,
    edits: [],
    book: {
      title: '',
      subtitle: '',
      isbn: '',
      description: '',
      amazonAverageRating: null,
      amazonRatingsCount: null,
      goodreadsAverageRating: null,
      goodreadsRatingsCount: null,
      categories: [],
      thumbnail: '',
    },
  };

  componentDidMount() {
    const book = { ...this.props.book };
    this.setState({ book });
  }

  componentDidUpdate(prevProps, prevState) {
    const { book } = this.state;
    if (book !== prevState.book && !isEmpty(prevState.book.title)) {
      console.log('difference');
      this.setState({ saveIcon: true });
      this.setState({
        edits: util.compareDifferences(prevState.book, book, []),
      });
    }
  }

  _handleFocusOut = (text, property) => {
    var book = { ...this.state.book };
    book[property] = text;
    this.setState({ book });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
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
    const { classes, handleSave } = this.props;
    const { book, expanded, saveIcon, edits } = this.state;

    const title =
      get(book, 'title', '').length < 92
        ? book.title
        : book.title.substring(0, 92) + '...';

    const subheader =
      get(book, 'subtitle', '').length < 56
        ? book.subtitle
        : book.subtitle.substring(0, 56) + '...';

    const description =
      get(book, 'description', '').length < 285
        ? book.description
        : book.description.substring(0, 285) + '...';

    const goodreadsAverageRating =
      Math.round(book.goodreadsAverageRating * 1000) / 1000;
    const amazonAverageRating =
      Math.round(book.amazonAverageRating * 1000) / 1000;
    const bookDifferences = get(book, 'differences', []);
    const defaultStyle = {
      maxWidth: 200,
      margin: '6px',
      padding: '5px',
    };
    const expandStyle = expanded
      ? defaultStyle
      : { ...defaultStyle, maxHeight: 461 };

    return (
      <Card
        className={bookDifferences.length ? classes.different : null}
        style={expandStyle}
        key={book.isbn}
      >
        {saveIcon && (
          <IconButton
            onClick={() => [
              handleSave(book, edits),
              this.setState({ saveIcon: false }),
            ]}
            children={<SaveIcon />}
            style={{
              marginTop: '-12px',
              marginBottom: '-26px',
              marginLeft: '157px',
            }}
          />
        )}
        <div className={classes.header}>
          <Typography variant="body1" component="span">
            <EditableLabel
              text={title}
              inputWidth="190px"
              inputHeight="25px"
              onFocus={() => {}}
              onFocusOut={text => this._handleFocusOut(text, 'title')}
            />
          </Typography>
          <Typography variant="caption" component="span">
            <EditableLabel
              text={subheader}
              inputWidth="190px"
              inputHeight="25px"
              onFocus={() => {}}
              onFocusOut={text => this._handleFocusOut(text, 'subheader')}
            />
          </Typography>
        </div>
        {/* className={classes.header}
          action={
            <IconButton onClick={this.handleExpandClick}>
              <EditIcon />
            </IconButton>
          }
          title={title}
          subheader={subheader}
        /> */}
        {/* <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={() => this.viewAmazonPage(book.href)}>
            View on Amazon
          </MenuItem>
        </Menu> */}
        {!isEmpty(book.thumbnail) && (
          <CardMedia
            className={classes.media}
            image={book.thumbnail}
            title={book.title}
          />
        )}
        <CardContent className={classes.content}>{description}</CardContent>

        <div className={classes.actions}>
          {bookDifferences.length ? (
            <React.Fragment>
              <Icon
                aria-label="Differences"
                className={classes.icon}
                data-tip
                data-for="differencesIcon"
              />
              <ReactTooltip id="differencesIcon" type="info" effect="solid">
                {bookDifferences.map(different => (
                  <span key={different.key}>
                    {different.key} {different.currentValue} ->{' '}
                    {different.newValue}
                    <br />
                  </span>
                ))}
              </ReactTooltip>
            </React.Fragment>
          ) : (
            <IconButton aria-label="Unread" className={classes.icon}>
              <UnreadBook fontSize="large" />
            </IconButton>
          )}
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <RatingDisplay book={book} expanded={expanded} />
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography style={{ display: 'inline-flex' }} component="span">
              ISBN:{' '}
              <EditableLabel
                text={book.isbn}
                inputWidth="100px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text => this._handleFocusOut(text, 'isbn')}
              />
            </Typography>
            {!isEmpty(book.price) && (
              <Typography style={{ display: 'inline-flex' }} component="span">
                Price:{' '}
                <EditableLabel
                  text={book.price}
                  inputWidth="75px"
                  inputHeight="25px"
                  onFocus={() => {}}
                  onFocusOut={text => this._handleFocusOut(text, 'price')}
                />
              </Typography>
            )}
            <Typography style={{ display: 'inline-flex' }} component="span">
              Amazon Rating:{' '}
              <EditableLabel
                text={`${amazonAverageRating}`}
                inputWidth="75px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text =>
                  this._handleFocusOut(text, 'amazonAverageRating')
                }
              />
            </Typography>
            <Typography style={{ display: 'inline-flex' }} component="span">
              Goodreads Rating:{' '}
              <EditableLabel
                text={`${goodreadsAverageRating}`}
                inputWidth="75px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text =>
                  this._handleFocusOut(text, 'goodreadsAverageRating')
                }
              />
            </Typography>
            <Typography style={{ display: 'inline-flex' }} component="span">
              Amazon Review:{' '}
              <EditableLabel
                text={`${book.amazonRatingsCount}`}
                inputWidth="75px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text =>
                  this._handleFocusOut(text, 'amazonRatingsCount')
                }
              />
            </Typography>
            <Typography style={{ display: 'inline-flex' }} component="span">
              Goodreads Review:{' '}
              <EditableLabel
                text={`${book.goodreadsRatingsCount}`}
                inputWidth="75px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text =>
                  this._handleFocusOut(text, 'goodreadsRatingsCount')
                }
              />
            </Typography>
            <Typography style={{ display: 'inline-flex' }} component="span">
              Category:{' '}
              <EditableLabel
                text={`${book.categories}`}
                inputWidth="75px"
                inputHeight="25px"
                onFocus={() => {}}
                onFocusOut={text => this._handleFocusOut(text, 'categories')}
              />
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

Book.defaultProps = {
  book: {
    title: '',
    subtitle: '',
    description: '',
    differences: [],
  },
};

const mapDispatchToProps = {
  insertModifiedBook,
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Book));
