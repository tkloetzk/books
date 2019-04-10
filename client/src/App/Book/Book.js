import React, { Component } from 'react';
import BookActions from './BookActions';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ReadBook from '@material-ui/icons/CheckCircle';
import UnreadBook from '@material-ui/icons/CheckCircleOutline';
import Delete from '@material-ui/icons/DeleteForever';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/icons/AnnouncementOutlined';
import ReactTooltip from 'react-tooltip';
import get from 'lodash/get';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import isEmpty from 'lodash/isEmpty';
import EditableLabel from 'react-inline-editing';
import util from '../../util/combineBooks';
import SaveIcon from '@material-ui/icons/Save';
import remove from 'lodash/remove';
import isEqual from 'lodash/isEqual';
import UnownedBook from '@material-ui/icons/HomeOutlined';
import OwnedBook from '@material-ui/icons/Home';
import forEach from 'lodash/forEach';

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
  owned: {
    backgroundColor: '#9bfaff',
  },
  header: {
    '& span': {
      fontSize: '14px',
    },
    marginTop: '-18px',
    height: '73px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  topRightButton: {
    marginTop: '-5px',
    marginBottom: '-13px',
    marginLeft: '157px',
  },
  topLeftButton: {
    marginTop: '-43px',
    marginLeft: '-5px',
  },
  content: {
    fontSize: '12px',
    margin: '-14px',
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
  expand: {
    transform: 'rotate(0deg)',
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
    originalBook: {},
    book: {
      title: '',
      subtitle: '',
      isbn: '',
      description: '',
      owned: false,
      read: false,
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
    this.updateOriginalBook();
  }

  componentDidUpdate(prevProps, prevState) {
    const { book, originalBook, edits } = this.state;
    const { handleSave, book: propBook } = this.props;

    if (!isEqual(originalBook.adjustedRating, propBook.adjustedRating)) {
      this.updateOriginalBook();
    }

    if (
      !isEqual(book, prevProps.book) &&
      !isEqual(book, prevState.book) &&
      !isEmpty(prevState.book.title)
    ) {
      this.setState({
        edits: util.compareDifferences(originalBook, book, []),
      });
    }
    if (edits.length && edits !== prevState.edits) {
      this.setState({ saveIcon: true });
    }

    if (!edits.length && prevState.edits.length) {
      this.setState({ saveIcon: false });
    }

    if (
      originalBook.owned !== book.owned &&
      book.owned !== prevState.book.owned
    ) {
      handleSave(book, [{ key: 'owned', newValue: book.owned }]);
    }
    if (originalBook.read !== book.read && book.read !== prevState.book.read) {
      handleSave(book, [{ key: 'read', newValue: book.read }]);
    }
  }

  updateOriginalBook = () => {
    const { book } = this.props;

    const mergedBook = Object.assign({}, this.state.book, book);
    this.setState({ book: mergedBook, originalBook: mergedBook });
  };

  handleOwnedReadBook = key => {
    const { book } = this.state;

    const updatedBook = Object.assign({}, book, { [key]: !book[key] });
    this.setState({ book: updatedBook });
  };

  _handleFocusOut = (text, property) => {
    var book = { ...this.state.book };
    book[property] = text;
    this.setState({ book });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, handleSave, handleDelete, filters } = this.props;
    const { book, expanded, saveIcon, edits } = this.state;

    const owned = get(book, 'owned', false);
    const read = get(book, 'read', false);

    let filteredBook = false;
    forEach(filters, filter => {
      if (filter.value) {
        if (
          (filter.key === 'read' && read) ||
          (filter.key === 'owned' && !owned)
        ) {
          filteredBook = true;
        }
      }
    });

    if (filteredBook) {
      return null;
    }

    const title =
      get(book, 'title', '').length < 92
        ? book.title
        : book.title.substring(0, 92) + '...';

    const subheader =
      get(book, 'subtitle', '').length < 51
        ? book.subtitle
        : book.subtitle.substring(0, 51) + '...';

    const description =
      get(book, 'description', '').length < 295
        ? book.description
        : book.description.substring(0, 295) + '...';

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
        className={[
          book.differences.length ? classes.different : null,
          owned ? classes.owned : null,
        ].join(' ')}
        style={expandStyle}
        key={book.isbn}
      >
        {!saveIcon && (
          <IconButton
            aria-label="Unread"
            onClick={() => this.handleOwnedReadBook('read')}
            children={read ? <ReadBook /> : <UnreadBook />}
            className={classes.topRightButton}
          />
        )}
        <IconButton
          className={classes.topLeftButton}
          onClick={() => handleDelete(book)}
          children={<Delete />}
        />
        {saveIcon && (
          <IconButton
            onClick={() => [
              handleSave(book, edits),
              this.setState({ saveIcon: false }),
            ]}
            children={<SaveIcon />}
            className={classes.topRightButton}
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
        {!isEmpty(book.thumbnail) && (
          <CardMedia
            className={classes.media}
            image={book.thumbnail}
            title={book.title}
          />
        )}
        <CardContent className={classes.content}>
          {!isEmpty(description) && (
            <EditableLabel
              text={description}
              inputWidth="190px"
              inputHeight="25px"
              onFocus={() => {}}
              onFocusOut={text => this._handleFocusOut(text, 'description')}
            />
          )}
        </CardContent>

        <div className={classes.actions}>
          {book.differences.length ? (
            <React.Fragment>
              <Icon
                aria-label="Differences"
                data-tip
                data-for="differencesIcon"
              />
              <ReactTooltip id="differencesIcon" type="info" effect="solid">
                {book.differences.length > 0 &&
                  book.differences.map(different => (
                    <span key={different.key}>
                      {different.key} {different.currentValue} ->{' '}
                      {different.newValue}
                      <br />
                    </span>
                  ))}
              </ReactTooltip>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <IconButton
                aria-label="Onwed"
                onClick={() => this.handleOwnedReadBook('owned')}
                children={owned ? <OwnedBook /> : <UnownedBook />}
              />
            </React.Fragment>
          )}
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Typography style={{ paddingLeft: '15px', paddingRight: '15px' }}>
            {Math.round(book.adjustedRating * 1000) / 1000}
          </Typography>
        </div>
        <BookActions
          expanded={expanded}
          book={book}
          handleFocusOut={this._handleFocusOut}
        />
      </Card>
    );
  }
}

Book.defaultProps = {
  classes: {},
  book: {
    differences: [],
    title: '',
    description: '',
  },
};

const mapStateToProps = state => {
  return {
    filters: state.bookshelf.filters,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Book));
