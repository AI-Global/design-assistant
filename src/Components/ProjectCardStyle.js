import { makeStyles, withStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
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
  statusRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusColor: {
    color: '#5A6C83',
    fontSize: 18,
  },
  riskFactor: {
    color: '#BF4051',
    fontSize: 18,
  },
  startOnStyle: {
    color: '#5A6C83',
    fontSize: 14,
  },
  completedStyle: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
  },
  chipColor: {
    backgroundColor: '#E5EFFF',
  },
  designChipColor: {
    backgroundColor: '#ECB22E',
  },
  viewAuditLog: {
    color: '#386EDA',
    whiteSpace: 'nowrap',
    padding: 10,
  },
});
