import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    width: 264,
    borderRadius: '10px 10px 0px 0px',
  },
  title: {
    fontSize: 24,
  },
  cardContent: {
    backgroundColor: '#E5EEFF',
  },
  buttonColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  trashIcon: {
    height: '40px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default function ProjectCard(props) {
  const classes = useStyles();
  const {
    projectName,
    assessmentType,
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
          <Typography className={classes.title}>{projectName}</Typography>
          <div>Assessment Type: {assessmentType}</div>
          <div>Updated by: {updatedBy}</div>
          <div>Updated on: {updatedOn}</div>
        </CardContent>
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
