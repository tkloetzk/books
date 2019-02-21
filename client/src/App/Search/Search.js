import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import Results from '../Results/Results';
import { connect } from 'react-redux';
import { addBookToBookshelf } from '../../store/bookshelf/bookshelfActions';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';

const styles = {
  fab: {
    alignSelf: 'flex-end',
  },
};
class Search extends React.Component {
  handleSave = () => {
    this.props
      .addBookToBookshelf([this.state.booklist[0]])
      .then(res => console.log('saved', res));
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { booklist, classes } = this.props;
    return (
      <React.Fragment>
        <SearchBar />
        <Results booklist={booklist} />
        <Fab color="primary" aria-label="Save" className={classes.fab}>
          <SaveIcon onClick={this.handleSave} />
        </Fab>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    booklist: state.goodreads.booklist,
  };
};

const mapDispatchToProps = {
  addBookToBookshelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Search));
