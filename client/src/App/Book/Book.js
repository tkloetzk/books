import React, { Component } from 'react';
import BookActions from './BookActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { connect } from 'react-redux';
import Delete from '@material-ui/icons/DeleteForever';
import EditableLabel from 'react-editable-label';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import Icon from '@material-ui/icons/AnnouncementOutlined';
import IconButton from '@material-ui/core/IconButton';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import OwnedBook from '@material-ui/icons/Home';
import PropTypes from 'prop-types';
import ReadBook from '@material-ui/icons/CheckCircle';
import ReactTooltip from 'react-tooltip';
// import Truncate from 'react-truncate';
import truncate from 'lodash/truncate';
import Typography from '@material-ui/core/Typography';
import UnownedBook from '@material-ui/icons/HomeOutlined';
import UnreadBook from '@material-ui/icons/CheckCircleOutline';
import util from '../../util/combineBooks';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  adjustedRating: {
    paddingLeft: '15px',
    paddingRight: '15px',
  },
  card: {
    width: 210,
    maxHeight: 455,
    padding: '5px',
    margin: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: 0,
    fontSize: '12px',
    margin: '5px',
    height: '145px',
    overflow: 'auto',
    // whiteSpace: 'nowrap',
  },
  different: {
    cursor: 'pointer',
    boxShadow:
      '0px 0px 3px 6px yellow, 0px 1px 1px 2px yellow, 0px 2px 1px 1px yellow',
  },
  expand: {
    transform: 'rotate(0deg)',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    // margin: 'auto',
  },
  header: {
    display: 'flex',
    height: '80px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    padding: '5px',
  },
  media: {
    height: 0,
    paddingTop: '83%',
    backgroundSize: '100px',
  },
  owned: {
    backgroundColor: '#9bfaff',
  },
};

export class Book extends Component {
  state = {
    expanded: false,
    edits: [],
    read: this.props.book.read,
    owned: this.props.book.owned,
  };

  componentDidMount() {
    const { book, bookshelf } = this.props;
    const exisitingBook = find(bookshelf, {
      isbn: book.isbn,
    });
    if (exisitingBook) {
      this.setState({
        edits: util.compareDifferences(exisitingBook, book, []),
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(this.props.book.adjustedRating, prevProps.book.adjustedRating)
    ) {
      console.log('adjustedrating different');
    }

    // if (
    //   !isEqual(book, prevProps.book) &&
    //   !isEqual(book, prevState.book) &&
    //   !isEmpty(prevState.book.title)
    // ) {
    //   this.setState({
    //     edits: util.compareDifferences(originalBook, book, []),
    //   });
    // }
  }

  validateSave = (key, newValue) => {
    const { book, handleSave } = this.props;
    if (!isEqual(book[key], newValue)) {
      if (key === 'categories') {
        newValue = newValue.split(',').map(el => el.trim());
      }
      handleSave(book, [{ key, newValue: newValue }]);
    }
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, book, handleDelete, handleSave, filters } = this.props;
    const { expanded, read, owned, edits } = this.state;

    if (
      isEmpty(book) ||
      (filters.read && filters.read === book.read) ||
      (filters.owned && filters.owned === !book.owned)
    ) {
      return null;
    }

    const differences = get(book, 'differences', []);

    const expandStyle = !expanded
      ? styles.card
      : { ...styles.card, maxHeight: 614 };

    return (
      <Card
        style={expandStyle}
        className={[
          owned ? classes.owned : null,
          differences.length ? classes.different : null,
        ].join(' ')}
      >
        <div className={classes.header}>
          <IconButton
            aria-label="Delete"
            onClick={() => handleDelete(book)}
            className={classes.headerButtons}
            children={<Delete />}
          />
          <Typography variant="body1" align="center" component="span">
            <EditableLabel
              initialValue={book.title}
              save={value => {
                this.validateSave('title', value);
              }}
            />
          </Typography>
          {edits.length ? (
            <React.Fragment>
              <Icon
                aria-label="Differences"
                data-tip
                data-for="differencesIcon"
              />
              <ReactTooltip id="differencesIcon" type="info" effect="solid">
                {edits.length > 0 &&
                  edits.map(different => (
                    <span key={different.key}>
                      {different.key} {different.currentValue} ->{' '}
                      {different.newValue}
                      <br />
                    </span>
                  ))}
              </ReactTooltip>
            </React.Fragment>
          ) : (
            <IconButton
              aria-label="Unread"
              className={classes.headerButtons}
              onClick={() => [
                this.setState({ read: !read }),
                this.validateSave('read', !read),
              ]}
              children={read ? <ReadBook /> : <UnreadBook />}
            />
          )}
        </div>
        <Typography variant="caption" align="center">
          <EditableLabel
            initialValue={book.subtitle}
            save={value => {
              this.validateSave('subtitle', value);
            }}
          />
        </Typography>
        <CardMedia
          className={classes.media}
          image={book.thumbnail}
          title={book.title}
        />
        <CardContent className={classes.content}>
          <EditableLabel
            initialValue={book.description}
            save={value => {
              this.validateSave('description', value);
            }}
          />
          {/* <Truncate
            trimWhitespace
            lines={10}
            ellipsis={
                <span>
                  ... <a href="/link/to/article">Read more</a>
                </span>
            }
          >
            {book.description}
          </Truncate> */}
        </CardContent>
        <div className={classes.actions}>
          <IconButton
            aria-label="Owned"
            onClick={() => [
              this.setState({ owned: !owned }),
              this.validateSave('owned', !owned),
            ]}
            children={owned ? <OwnedBook /> : <UnownedBook />}
          />
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Typography className={classes.adjustedRating}>
            {Math.round(book.adjustedRating * 1000) / 1000}
          </Typography>
        </div>
        {expanded && (
          <BookActions
            expanded={expanded}
            book={book}
            validateSave={this.validateSave}
          />
        )}
      </Card>
    );
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    read: PropTypes.bool.isRequired,
    owned: PropTypes.bool.isRequired,
  }),
};

const mapStateToProps = state => {
  return {
    filters: state.bookshelf.filters,
    bookshelf: state.bookshelf.bookshelf,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Book));
