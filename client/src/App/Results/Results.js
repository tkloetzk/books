import React from 'react';
import Book from './Book/Book';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
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
  card: {
    maxWidth: 180,
    margin: '10px',
  },
  header: {
    '& span': {
      fontSize: '12px',
    },
    padding: '6px',
  },
  media: {
    height: 0,
    paddingTop: '150%',
  },
});

const Results = props => {
  const { classes, booklist } = props;
  return (
    <React.Fragment>
      {booklist.map(tile => (
        <Card className={classes.card}>
          <CardHeader
            className={classes.header}
            //action={
            // <IconButton>
            //   <MoreVertIcon />
            // </IconButton>
            //}
            title={tile.title}
            subheader={tile.author}
          />
          <CardMedia
            className={classes.media}
            image={tile.image}
            title="Paella dish"
          />
        </Card>
        // <GridListTile key={tile.isbn} cols={4}>
        //   <img src={tile.image} alt={tile.title} />
        //   <GridListTileBar
        //     title={tile.title}
        //     // subtitle={<span>by: {tile.author}</span>}
        //     actionIcon={
        //       <IconButton className={classes.image}>
        //         {/* <InfoIcon /> */}
        //       </IconButton>
        //     }
        //   />
        // </GridListTile>
      ))}
    </React.Fragment>
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
