import React from 'react';
import Box from '@material-ui/core/Box';
import AssessmentSlider from './AssessmentSlider';
import { useTheme } from '@material-ui/core/styles';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons/';

import { ExpandButton, useStyles } from './AssessmentStyle';

export default function Assessment(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [expandButton, setExpandButton] = React.useState(false);

  const handleExpandButton = () => {
    setExpandButton(!expandButton);
  };

  return (
    <div>
      <div className={classes.outerContainer}>
        <Box mt={20} />
        <div className={classes.assessmentTitle}>
          {expandButton ? <div></div> : <div>What do Assessments Cover?</div>}
        </div>

        <div className={classes.expandButtonEnd}>
          <ExpandButton onClick={handleExpandButton}>
            {expandButton ? (
              <div>
                Collapse
                <KeyboardArrowUp />
              </div>
            ) : (
              <div>
                Expand
                <KeyboardArrowDown />
              </div>
            )}
          </ExpandButton>
        </div>
      </div>
      {expandButton && <AssessmentSlider expandButton={false} />}
    </div>
  );
}
