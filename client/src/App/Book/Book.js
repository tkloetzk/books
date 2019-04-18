import React, { Component } from 'react';
import BookActions from './BookActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { connect } from 'react-redux';
import Delete from '@material-ui/icons/DeleteForever';
import EditableLabel from 'react-editable-label';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import forEach from 'lodash/forEach';
import IconButton from '@material-ui/core/IconButton';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import OwnedBook from '@material-ui/icons/Home';
import PropTypes from 'prop-types';
import ReadBook from '@material-ui/icons/CheckCircle';
// import Truncate from 'react-truncate';
import truncate from 'lodash/truncate';
import Typography from '@material-ui/core/Typography';
import UnownedBook from '@material-ui/icons/HomeOutlined';
import UnreadBook from '@material-ui/icons/CheckCircleOutline';
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
    read: this.props.book.read,
    owned: this.props.book.owned,
  };

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
    const { expanded, read, owned } = this.state;

    if (
      isEmpty(book) ||
      (filters.read && filters.read === book.read) ||
      (filters.owned && filters.owned === !book.owned)
    ) {
      return null;
    }

    const expandStyle = !expanded
      ? styles.card
      : { ...styles.card, maxHeight: 614 };

    return (
      <Card style={expandStyle} className={owned ? classes.owned : null}>
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
          <IconButton
            aria-label="Unread"
            className={classes.headerButtons}
            // onClick={() => this.handleOwnedReadBook('read')}
            onClick={() => [
              this.setState({ read: !read }),
              this.validateSave('read', !read),
            ]}
            children={read ? <ReadBook /> : <UnreadBook />}
          />
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
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Book));
