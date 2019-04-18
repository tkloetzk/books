import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { filterBookshelf } from '../../../store/bookshelf/bookshelfActions';

export class Filters extends Component {
  state = {
    filters: { read: false, owned: false },
  };

  componentDidMount() {
    this.props.filterBookshelf(this.state.filters);
  }
  componentDidUpdate(prevProps, prevState) {
    const { filters } = this.state;
    const { filterBookshelf } = this.props;
    if (filters !== prevState.filters) {
      filterBookshelf(filters);
    }
  }

  handleOwned = name => {
    let filters = Object.assign({}, this.state.filters);
    filters[name] = !filters[name];
    this.setState({ filters });
  };

  render() {
    const { classes } = this.props;
    const { unread, owned } = this.state;
    const selectionControls = [
      {
        label: 'owned',
        category: 'owned',
        checked: owned,
      },
      {
        label: 'Unread',
        category: 'read',
        checked: unread,
      },
    ];

    return (
      <FormControl component="fieldset">
        <FormGroup row className={classes.formGroup}>
          {selectionControls.map(selection => {
            const { checked, category, label } = selection;
            return (
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={checked}
                    onChange={() => this.handleOwned(category)}
                    value={category}
                  />
                }
                label={label.toLocaleUpperCase()}
                key={category}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    );
  }
}

const styles = {
  legend: {
    alignSelf: 'center',
    paddingRight: '10px',
  },
  formGroup: {
    justifyContent: 'center',
  },
};

const mapDispatchToProps = {
  filterBookshelf,
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Filters));
