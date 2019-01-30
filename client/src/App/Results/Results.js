import React from 'react';
import Book from './Book/Book';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = () => ({
  // root: {
  //   width: '100%',
  //   backgroundColor: 'white',
  //   display: 'flex',
  // },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
});

const Results = props => {
  const { classes, booklist } = props;
  return (
    <div className={classes.root}>
      <GridList cellHeight={240} className={classes.gridList}>
        {booklist.map(tile => (
          <GridListTile key={tile.isbn} style={{ maxWidth: '240' }}>
            <img src={tile.image} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              // subtitle={<span>by: {tile.author}</span>}
              actionIcon={
                <IconButton className={classes.image}>
                  {/* <InfoIcon /> */}
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
    // <Grid item lg>
    //   <List component="nav">
    //     {booklist.map(book => (
    //       <div key={book.title} className={`row rounded ${classes.root}`}>
    //         <Book book={book} />
    //         <Divider />
    //       </div>
    //     ))}
    //   </List>
    // </Grid>
  );
};

const mapStateToProps = state => {
  return {
    booklist: state.goodreads.booklist,
  };
};

Results.defaultProps = {
  booklist: [],
};

export default connect(mapStateToProps)(withStyles(styles)(Results));
