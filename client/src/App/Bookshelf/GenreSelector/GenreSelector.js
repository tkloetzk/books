import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const GenreSelector = ({ classes, handleChange, genres }) => (
  <FormControl component="fieldset" fullWidth>
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
                onChange={handleChange(category)}
                value={category}
              />
            }
            label={category}
            key={category}
          />
        );
      })}
    </FormGroup>
  </FormControl>
);

const styles = {
  legend: {
    alignSelf: 'center',
    paddingRight: '10px',
  },
  formGroup: {
    justifyContent: 'center',
  },
};

export default withStyles(styles)(GenreSelector);
