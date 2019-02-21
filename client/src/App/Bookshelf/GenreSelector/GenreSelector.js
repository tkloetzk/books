import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { getGennresFromBookshelf } from '../../../store/bookshelf/bookshelfActions'

class GenreSelector extends Component {
  state = {
    gilad: true,
    jason: false,
    antoine: false,
  }

  componentDidMount () {
    this.props.getGennresFromBookshelf()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  render () {
    const { classes } = this.props
    const { gilad, jason, antoine } = this.state
    const error = [gilad, jason, antoine].filter(v => v).length !== 2
    return (
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" className={classes.legend}>
          Genres
        </FormLabel>
        <FormGroup row className={classes.formGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={gilad}
                onChange={this.handleChange('gilad')}
                value="gilad"
              />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={jason}
                onChange={this.handleChange('jason')}
                value="jason"
              />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={antoine}
                onChange={this.handleChange('antoine')}
                value="antoine"
              />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
      </FormControl>
    )
  }
}

const styles = {
  legend: {
    textAlign: 'center',
  },
  formGroup: {
    justifyContent: 'center',
  },
}
const mapStateToProps = state => {
  return {
    booklist: state.goodreads.booklist,
  }
}

const mapDispatchToProps = {
  getGennresFromBookshelf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GenreSelector))
