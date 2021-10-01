import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './ProjectCardStyle';

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
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <div className={classes.statusRow}>
            <Typography
              className={
                projectStatus ? classes.statusColor : classes.riskFactor
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
                <img src="/img/refresh.png" alt="refresh" />
              </Button>
              Resume
            </div>
            <div className={classes.buttonColumn}>
              <Button onClick={handleCloneClick}>
                <img src="/img/clone.png" alt="clone" />
              </Button>
              Clone
            </div>
            <div className={classes.buttonColumn}>
              <Button onClick={handleDeleteClick}>
                <img
                  className={classes.trashIcon}
                  src="/img/trash.png"
                  alt="trash"
                />
              </Button>
              Delete
            </div>
          </div>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
