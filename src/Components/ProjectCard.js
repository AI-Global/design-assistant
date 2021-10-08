import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './ProjectCardStyle';
import RefreshRounded from '@material-ui/icons/RefreshRounded';
import FileCopyRounded from '@material-ui/icons/FileCopyRounded';
import DeleteRounded from '@material-ui/icons/DeleteRounded';

export default function ProjectCard(props) {
  const classes = useStyles();
  const {
    projectStatus,
    statusTitle,
    projectName,
    updatedBy,
    startedOn,
    updatedOn,
    completedOn,
    handleDeleteClick,
    handleCloneClick,
    handleResumeClick,
  } = props;
  return (
    <React.Fragment>
      <Card className={classes.root} raised={true}>
        <CardContent className={classes.cardContent}>
          <div className={classes.statusRow}>
            <Typography
              className={
                projectStatus ? classes.statusColor : classes.viewReports
              }
            >
              {statusTitle}
            </Typography>
            <Chip
              className={
                projectStatus ? classes.chipColor : classes.designChipColor
              }
              label={projectStatus ? 'Deployment' : 'Design'}
            />
          </div>

          <div className={classes.title}>{projectName}</div>
          <div>Updated by: {updatedBy}</div>
        </CardContent>
        <CardActions>
          <div className={classes.statusRow}>
            <div className={classes.startOnStyle}>Started on: {updatedOn}</div>
            <div className={classes.completedStyle}>
              Updated on: {updatedOn}
            </div>
          </div>
        </CardActions>
        <CardActions>
          <div className={classes.viewAuditLog}>View Audit Log</div>
          <div className={classes.buttonRow}>
            <div className={classes.buttonColumn}>
              <Button onClick={handleResumeClick}>
                <RefreshRounded className={classes.iconStyle} />
              </Button>
              <div className={classes.iconFont}>Resume</div>
            </div>
            <div className={classes.buttonColumn}>
              <Button onClick={handleCloneClick}>
                <FileCopyRounded className={classes.iconStyle} />
              </Button>
              <div className={classes.iconFont}>Clone</div>
            </div>
            <div className={classes.buttonColumn}>
              <Button onClick={handleDeleteClick}>
                <DeleteRounded className={classes.iconFont}></DeleteRounded>
              </Button>
              <div className={classes.iconFont}>Delete</div>
            </div>
          </div>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
