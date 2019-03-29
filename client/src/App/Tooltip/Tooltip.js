import React from 'react';
import InitialIcon from '@material-ui/icons/RadioButtonUnchecked';
import DoneIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { LOADING_STATUSES } from '../../util/constants';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

function TooltipProgress(props) {
  const { progress } = props;
  const green = { color: 'green' };
  if (progress === LOADING_STATUSES.initial)
    return <InitialIcon style={green} fontSize="small" />;

  if (progress === LOADING_STATUSES.loading) {
    return (
      <CircularProgress
        size={18}
        style={{ color: 'yellow', marginTop: '1px' }}
        thickness={4}
      />
    );
  }
  if (progress === LOADING_STATUSES.success) return <DoneIcon style={green} />;
  if (progress === LOADING_STATUSES.errored)
    return <ErrorIcon style={{ color: 'red' }} />;
}

export default function Tooltip({ content }) {
  if (!content) {
    return null;
  }
  return (
    <div style={{ width: 100 }}>
      {content.map(tooltip => (
        <span
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          key={tooltip.label}
        >
          <Typography style={{ color: 'white' }}>{tooltip.label}</Typography>
          <TooltipProgress progress={tooltip.loading} />
        </span>
      ))}
    </div>
  );
}
