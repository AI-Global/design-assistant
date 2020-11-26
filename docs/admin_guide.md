# Administration Panel
_A visual guide is also available [here](docs/Responsible%20AI%20Assistant%20Administrator%20User%20Manual.pdf)_

The administration panel is only accessible by users with _admin_ or _superadmin_ credentials, and can be navigated to through the user dropdown menu at the main landing page. The panel consists of the following tabs: **Survey Management, User, Submissions, Trusted AI Providers, Trusted AI Resources,** and **Analytics**.

## Survey Management
From the **Survey Management** tab, the admin can easily manage the questions of the survey. It presents a list of all the current questions, their numbers, and trust index dimensions. The survey and questions can be managed and edited through the following functionalities:

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

## Users
From the **Users** tab, you can view and manage all of the registered users. The table is paginated, and the page controls and results per page can be accessed at the bottom of the table. The Admin can also filter the displayed users from the _Filters_ menu located on the left side of the table. By entering the desired _Role_ and/or _Organization_, the table will only display the users that match the search criteria. From this table, the admin can view a user's submissions, or delete an account. 

### View Submission
By clicking the _View_ button, you will be sent to a page that displays all of the submissions of the user. From here, you can view the results of any submission by clicking the _Responses_ button, which will redirect you to the Results page, where you can view the detailed report. 

### Delete User
By clicking the red _trash icon_, you will be prompted to confirm if they would like to delete the user. You will also be given the option to delete all of the submissions associated with that user as well. If you select not to delete the submissions, only the account will be deleted, and a record of their submissions will still be kept and viewable. 

## Submissions
From the **Submissions** tab, an admin can view a list of all the completed survey assessments. Each submission is associated with the users profile and identified by a project name and the date/time of submission. This table also displays any submissions that do not have an associated user (i.e. surveys completed by a user that was not logged in). This table is also paginated, and can be filtered like the **Users** table.

You can view the results of the assessment by clicking *View Responses*, which will redirect you to the results page populated with that submissions data. You can also delete the individual response by clicking the red _trash icon_, and confirming you would like to delete the submission.

## Trusted AI Providers
The **Trusted AI Providers** tab allows you to manage the list Trusted AI Providers that will be displayed to the user on the Results Page. Management consists of the following tasks: _adding, editing,_ and _deleting_

### Adding
A new provider resource can be added by clicking the _+_ icon inthe right corner of the table header. This will display a pop up window with the fields _Title_< _Description_ and _Source_, where you can enter the relevant information. If the resource you are trying to add is already in the list of Trusted AI Providers, the window will notify you of this, and will not add the new resource.

### Editing
An existing provider resource can be edited by clicking the _Edit_ button, which will display a pop up window that is populated with the existing provider information. The information can be edited, and changes will be saved to the database, and reflected in the Results page for the user.

### Deleting
To delete an existing provider resource, click the _Edit_ button again, and then click the _Delete_ button in the bottom left corner of the pop up window, and confirm the deletion. 

## Trusted AI Resources
The **Trusted AI Resources** tab allows you to manage the list Trusted AI Resources that will be displayed to the user on the Results Page. Management consists of the following tasks: _adding, editing,_ and _deleting_

### Adding
A new AI resource can be added by clicking the _+_ icon inthe right corner of the table header. This will display a pop up window with the fields _Title_< _Description_ and _Source_, where you can enter the relevant information. If the resource you are trying to add is already in the list of Trusted AI Resources, the window will notify you of this, and will not add the new resource.

### Editing
An existing AI resource can be edited by clicking the _Edit_ button, which will display a pop up window that is populated with the existing resource information. The information can be edited, and changes will be saved to the database, and reflected in the Results page for the user.

### Deleting
To delete an existing AI resource, click the _Edit_ button again, and then click the _Delete_ button in the bottom left corner of the pop up window, and confirm the deletion.

## Analytics
From the **Analytics** tab, the admin is presented the following site analytics from Google Analytics: Number of Sessions, Location of Session, Average Session Duration. Further analytics can be accessed through your valid google account at (https://accounts.google.com/)[https://accounts.google.com/]
