import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import { getBookshelf } from '../../../store/bookshelf/bookshelfActions';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Fab from '@material-ui/core/Fab';

export class GenreSelector extends React.Component {
  state = {
    genres: [],
    selectAll: true,
    deselectAll: false,
  };

  // TODO: This is a mess. Also deleting book doesn't update genre
  componentDidUpdate(prevProps, prevState) {
    const { genres, deselectAll } = this.state;
    const { bookshelf, getBookshelf } = this.props;

    //Initial Load
    if (!prevState.genres.length && bookshelf.length && !genres.length) {
      bookshelf.forEach(book =>
        book.categories.forEach(category => {
          if (!find(genres, { category })) {
            genres.push({ category, checked: false });
          }
        })
      );
      this.setState({ genres });
    }
    if (genres !== prevState.genres && prevState.genres.length) {
      const selectedGenre = [];
      forEach(genres, genre => {
        if (genre.checked) {
          selectedGenre.push(genre.category);
        }
      });
      if (deselectAll) {
        getBookshelf(false);
      } else {
        getBookshelf(selectedGenre);
      }
    }
  }
  handleChange = event => {
    const name = event.target.value;
    const { genres } = this.state;
    let updatedGenres = [...genres.filter(genre => name !== genre.category)];
    updatedGenres.unshift({ category: name, checked: event.target.checked });
    this.setState({
      genres: updatedGenres,
      deselectAll: false,
      selectAll: false,
    });
  };
  handleSelectAll = event => {
    if (event.target.checked) {
      const { genres } = this.state;
      const updatedGenre = [];
      genres.forEach(genre =>
        updatedGenre.push({ category: genre.category, checked: false })
      );
      this.setState({
        selectAll: event.target.checked,
        deselectAll: false,
        genres: updatedGenre,
      });
    }
  };
  handleDeselectAll = event => {
    if (event.target.checked) {
      const { genres } = this.state;
      const updatedGenre = [];
      genres.forEach(genre => {
        updatedGenre.push({ category: genre.category, checked: false });
      });
      this.setState({
        selectAll: false,
        deselectAll: true,
        genres: updatedGenre,
      });
    }
  };
  render() {
    const { classes, bookshelf } = this.props;
    const { genres, selectAll, deselectAll } = this.state;

    let headers = [
      { label: 'ISBN', key: 'isbn' },
      { label: 'Title', key: 'title' },
      { label: 'Subtitle', key: 'subtitle' },
      { label: 'Categories', key: 'categories' },
      { label: 'Description', key: 'description' },
      { label: 'Amazon Average Rating', key: 'amazonAverageRating' },
      { label: 'Amazon Ratings Count', key: 'amazonRatingsCount' },
      { label: 'Goodreads Average Rating', key: 'goodreadsAverageRating' },
      { label: 'Goodreads Ratings Count', key: 'goodreadsRatingsCount' },
      { label: 'Adjusted Rating', key: 'adjustedRating' },
      { label: 'Read', key: 'read' },
      { label: 'Owned', key: 'owned' },
    ];

    const selectionControls = [
      {
        handler: event => this.handleSelectAll(event),
        category: 'SELECT ALL',
        checked: selectAll,
      },
      {
        handler: event => this.handleDeselectAll(event),
        category: 'DESELECT ALL',
        checked: deselectAll,
      },
    ];
    return (
      <FormControl component="fieldset">
        <FormGroup row className={classes.formGroup}>
          <FormLabel component="label" className={classes.legend}>
            Genres:
          </FormLabel>
          {genres.map(genre => {
            const { checked, category } = genre;
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={event => this.handleChange(event)}
                    value={category}
                  />
                }
                label={category}
                key={category}
              />
            );
          })}
          {selectionControls.map(selection => {
            const { checked, category, handler } = selection;
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={event => handler(event)}
                    value={category}
                  />
                }
                label={category}
                key={category}
              />
            );
          })}
          <CSVLink data={bookshelf} headers={headers}>
            <Fab size="small">
              <DownloadIcon fontSize="small" />
            </Fab>
          </CSVLink>
        </FormGroup>
      </FormControl>
    );
  }
}

GenreSelector.defaultProps = {
  classes: {},
  bookshelf: [],
};
const styles = {
  legend: {
    alignSelf: 'center',
    paddingRight: '10px',
  },
  formGroup: {
    justifyContent: 'center',
  },
};
const mapStateToProps = state => {
  return {
    bookshelf: state.bookshelf.bookshelf,
  };
};

const mapDispatchToProps = {
  getBookshelf,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GenreSelector));
