import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import InitialIcon from '@material-ui/icons/RadioButtonUnchecked';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import { LOADING_STATUSES } from '../../util/constants';
import isEmpty from 'lodash/isEmpty';
import CircularProgress from '@material-ui/core/CircularProgress';

const variantIcon = {
  [LOADING_STATUSES.initial]: InitialIcon,
  [LOADING_STATUSES.success]: CheckCircleIcon,
  [LOADING_STATUSES.warning]: WarningIcon,
  [LOADING_STATUSES.errored]: ErrorIcon,
  [LOADING_STATUSES.info]: InfoIcon,
  [LOADING_STATUSES.loading]: CircularProgress,
};
const styles = () => ({
  [LOADING_STATUSES.initial]: {
    backgroundColor: 'green',
  },
  [LOADING_STATUSES.success]: {
    backgroundColor: green[600],
  },
  [[LOADING_STATUSES.errored]]: {
    backgroundColor: 'red',
  },
  [[LOADING_STATUSES.loading]]: {
    backgroundColor: 'yellow',
  },
  [LOADING_STATUSES.info]: {
    backgroundColor: blue[300],
  },
  [LOADING_STATUSES.warning]: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
    marginRight: 5,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const Notification = ({
  classes = {},
  open = false,
  handleClose,
  autoHideDuration = 1,
  message = '',
  type = '',
}) => {
  //TODO: Doesn't work
  if (!open || isEmpty(message) || isEmpty(type)) {
    return null;
  }
  const Icon = variantIcon[type];

  return (
    open &&
    !isEmpty(message) &&
    !isEmpty(type) && (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
      >
        <SnackbarContent
          className={classes[type]}
          message={
            <span className={classes.message}>
              <Icon className={classes.icon} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
  );
};

export default withStyles(styles)(Notification);
