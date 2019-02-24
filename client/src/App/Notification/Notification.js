import React from 'react';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};
const styles = () => ({
  success: {
    backgroundColor: green[600],
  },
  errored: {
    backgroundColor: 'red',
  },
  info: {
    backgroundColor: 'yellow',
  },
  warning: {
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
  classes,
  open,
  handleClose,
  autoHideDuration,
  message,
  type,
}) => {
  if (!message || !type) return null;

  const Icon = variantIcon[type];

  return (
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
  );
};

export default withStyles(styles)(Notification);
