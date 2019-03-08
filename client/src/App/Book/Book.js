import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
// import ReadBook from './read-book.svg';
import UnreadBook from '@material-ui/icons/BookOutlined';
import { withStyles, jssPreset } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/icons/AnnouncementOutlined';
import ReactTooltip from 'react-tooltip';
import get from 'lodash/get';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import isEmpty from 'lodash/isEmpty';
import EditableLabel from 'react-inline-editing';
import util from '../../util/combineBooks';
import SaveIcon from '@material-ui/icons/Save';
import remove from 'lodash/remove';

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
      differences: [],
      amazonAverageRating: null,
      amazonRatingsCount: null,
      goodreadsAverageRating: null,
      goodreadsRatingsCount: null,
      adjustedRating: '',
      categories: [],
      thumbnail: '',
    },
  };

  componentDidMount() {
    const { book } = this.props;
    this.setState({ book });
  }

  componentDidUpdate(prevProps, prevState) {
    const { book } = this.state;
    // book !== prevState.book &&
    if (
      book !== prevProps.book &&
      book !== prevState.book &&
      !isEmpty(prevState.book.title)
    ) {
      console.log('difference');
      this.setState({ saveIcon: true });
      this.setState(
        {
          edits: util.compareDifferences(prevProps.book, book, []),
        },
        () => console.log(this.state.edits)
      );
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

  // viewAmazonPage = href => {
  //   var win = window.open(href, '_blank');
  //   win.focus();
  //   this.handleClose();
  // };

  // handleClose = () => {
  //   this.setState({ anchorEl: null });
  // };

  render() {
    const { classes, handleSave } = this.props;
    const { book, expanded, saveIcon, edits } = this.state;

    if (!book) return null;
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
    remove(bookDifferences, diff => diff.key === 'categories');
    book.differences = bookDifferences;
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
        className={book.differences.length ? classes.different : null}
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
              onFocusOut={text => this._handleFocusOut(text, 'subtitle')}
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
        <CardContent className={classes.content}>
          <EditableLabel
            text={description}
            inputWidth="190px"
            inputHeight="25px"
            onFocus={() => {}}
            onFocusOut={text => this._handleFocusOut(text, 'description')}
          />
        </CardContent>

        <div className={classes.actions}>
          {book.differences.length ? (
            <React.Fragment>
              <Icon
                aria-label="Differences"
                className={classes.icon}
                data-tip
                data-for="differencesIcon"
              />
              <ReactTooltip id="differencesIcon" type="info" effect="solid">
                {book.differences.map(different => (
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
          <Typography>
            {Math.round(book.adjustedRating * 1000) / 1000}
          </Typography>
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
  classes: {},
};

export default withStyles(styles)(Book);
