# Administration Panel

The administration panel is only accessible by users with admin credentials, and can be navigated to through the user dropdown menu at the main landing page. The panel consists of four sections: Survey Management, User Management, Submission Viewing, Analytics.

## Survey Management
From the **Survey Management** tab, the admin can manage the questions of the survey. It presents a list of all the current questions, their numbers, and trust index dimensions. The survey and questions can be managed and edited through the following functionalities:

### Add Question
To add a new question click the *add* icon in the top left corner of the table header to display the question window. Closing the modal or clockong *Delete* will cancel the creation. Saving the question will add it to the database as the last question, and it will populate the bottom of the table. From here, it can be dragged to a new location to be re-ordered, or create a parent-child relationship as necessary. 

### Edit Question
An existing question can be edited by clicking the *Edit* button associated with its table row. This will bring up a window populated with the questions current data. From here, fields can be edited, and changes saved by via the *Save* button. Clicking the *x* button will close the window and not save any changes made. The window cannot be dismissed by clicking outside of the area to prevent accidental closure and loss of changes.


### Delete Question
An existing question can be deleted by clicking the *Edit* button associated with its table row, and then clicking the *Delete* button at the bottom of the window. A confirmation will propmt to prevent accidental deletion. Once the question is deleted, the table will update and all subsequent question numbers will be updated.

### Reorder Question
Questions can be reordered by either clicking and holding on the row, and dragging the question to a new location, or by navigating to the row with the ```tab``` key, pressing ```space```, and using the ```arrow keys``` to navigate, and pressing ```space``` to confirm or ```esc``` to cancel. When dropped to a new location, a modal will popup asking if the admin wants to create a new question relationship. Selecting no and confirming will reorder the questions.

### Create Hierarchy Question
Hierarchy relationships can be created by dragging the desired child question and dropping it below the desired parent question. When dropped, a modal will popup asking if the admin wants to create a new question relationship. Selecting yes will display the responses of the parent question, and the admin can select which of these will trigger the child question. To have multiple children for one parent, all subsequent children need to still be placed directly below the parent question. To create a grandchild question, it need to be placed below the child.

## User Management
From the **User** tab, the admin can view all the registered accounts, and has the ability to delete the account if required. 

## Submission Viewing
From the **Submissions** tab, the admin can view a list of all the completed survey assessments. Each submission is associated with the users profile and identified by a project name and the date/time of submission. The admin can view the results of the assessment by clicking *View Responses*, which will redirect them to the results page populated with that submissions data. 

## Analytics
From the **Analytics** tab, the admin is presented the following site analytics from Google Analytics: Number of Sessions, Location of Session, Average Session Duration.
