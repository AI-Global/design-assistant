import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    width: '523px',
    height: '278px',
    borderRadius: '10px',
  },
  title: {
    fontSize: 24,
  },
  cardContent: {
    backgroundColor: '#F3F5F7',
  },
  buttonColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  trashIcon: {
    height: '40px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: '2em',
    width: '100%',
  },
});

export default function ProjectCard(props) {
  const classes = useStyles();
  const {
    status,
    projectName,
    updatedBy,
    updatedOn,
    handleDeleteClick,
    handleCloneClick,
    handleResumeClick,
  } = props;
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.title}>{status}</Typography>
          <Typography className={classes.title}>{projectName}</Typography>
          <div>Updated by: {updatedBy}</div>
        </CardContent>
        <CardActions>
          <div>Updated on: {updatedOn}</div>
        </CardActions>
        <CardActions>
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
