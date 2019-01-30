import ListItem from '@material-ui/core/ListItem';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  img: {
    maxWidth: '100%',
    height: 'auto',
    position: 'relative',
  },
};

class Book extends Component {
  render() {
    const { book, classes } = this.props;

    return (
      <ListItem>
        <div className="col-sm-1">
          <img src={book.image} className={`img-fluid ${classes.img}`} />
        </div>
      </ListItem>
    );
  }
}

export default withStyles(styles)(Book);
