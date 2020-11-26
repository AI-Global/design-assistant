# Responsible Design Assistant React Project Structure

## Front End

#### App.js
The is the home page of the App and renders the Welcome text, the Login button, and a table of the the (logged in) users previous survey submissions throught the ```UserSubmissions.js``` view. If you want to update and modify the welcome page, you can do so here in the main ```<div>...</div>```.

### Views 

#### Admin.js
Renders the administration panel for users with valid admin credentials. It renders the ```QuestionTable.js``` component for the Survey Management functionality.

### DesignAssistantSurvey.js
This is the actual survey component of the App. It leverages the [SurveyJS](https://surveyjs.io/) library to render the questions stored in the mongo database. The component gets the questions json from the backend through the ```/questions``` get request, and loads them into the SurveyJS ```model```. If the user is logged in and continues an existing survey, the previous responses are loaded into the model by setting ```model.data``` to the previous submissions JSON. 


When a logged in user clicks the _Save_ button, the component makes a post request to the ```/submissions``` endpoint, which stores the submissions JSON (```this.model.data```) into the database.

They survey can be completed by clicking the _Finish_ button, which then calls the save function automatically, which will again make a post request to ```/submissions``` to save the reponses. If the user is not logged in, the submissions are still saved, but they will not have an user_id associated with it.

#### DimensionScore.js
Renders a HTML Table row for a dimension which calculates the score of the questions answered for a specific dimension and displays it in a HTML table row. The calculated scores are also pushed to ```Results.js``` and used to render the ```ResponsiveRadar``` chart.

#### Login.js
Renders a ```Modal``` for user to enter email and password to log into an existing account. Upon submission, it sends form values to the backend through a post request to  ```/users/auth``` to be validated against the database, and sends back authorization token and user information. When the user is logged in, it renders the information.

#### ReportCard.js
Renders a Table for the report card. Table provides a list of the questions answered, the user's responses and the recommendations provided by AI Global for a specific dimension.

#### Results.js
Processes the users answers to the survey and renders the results to the user in various ways. It receives the questions as ```json``` prop and results as ```surveyResults``` prop from ```App.js``` when the user finishes the survey. It displays the results through the ```DimensionScore.js``` and ```ReportCard.js``` views, and a ```ResponsiveRadar``` chart.

#### Signup.js
Renders a ```Modal``` for user to enter email and password to create an account. A valid account is stored into the ```users``` database through a post request to ```/users/create```.

#### TrustedAIProviders.js
Renders a Table that displays the trusted AI providers that are stored in the database. Receives a list of providers from the database via the ```/trustedAIProviders``` get request.

#### TrustedAIresources.js
Renders a Table that displays the trusted AI resources that are stored in the database. Receives a list of resources from the database via the ```/trustedAIResources``` get request.

#### UserSettings.js
Upon login of a user, renders a ```Dropdown``` for various user settings such as a ```Modal``` to modify the user's email address, username, or password. Upon submission of these modal forms, a post request is sent respectively to ```/users/updateEmail```, ```/users/updateUsername```, or ```/users/updatePassword```. The dropdown also allows the user to Logout which expires the authorization token of the user. Finally, the UserSettings ```Dropdown``` allows the user to access the administration panel if user has a ```Role``` of Admin.

#### UserSubmissions.js
This renders a table of a logged in users previously completed/saved survey submissions. If a user is logged in, the component makes a get request to ```/submissions/user/:user_id``` to get a JSON file from the database of all of that user's submissions.

If a submission is not completed, the user can click the _Resume Survey_ button, which passes that submission JSON into the ```DesignAssistantSurvey.js``` component, which will render the survey and load their previous answers into it. 

Submissions in the list can be deleted by clicking the _Trash Icon_, which sends a delete request to ```/submissions/delete/:submission_id``` to remove it from the database. 

Submissions in the list can be cloned by clicking the _Clone_ button, which clones the survey as into a new document in the submissions collection through the ```/submissions/``` post request.

#### ViewSubmissions.js


### Components

#### QuestionTable.js
Renders a table of all the questions in the database. Gets question and other metadata from a get request to ```/questions/all```, which returns them in pure JSON format (not formatted for SurveyJS). For each question, the function renders a ```QuestionRow```. Rows can be re-ordered by dragging and dropping with the mouse, or space bar and arrow keys. If a question is rearranged, the ```ChildModal.js``` component renders and prompts the admin if they would like to create a new parent-child relationship. If the question reordering is saved, question numbers are updated by the ```questions/:startNumber/:endNumber/``` put request, where ```startNumber``` is the dragged questions starting number, and ```endNumber``` is the the table index that it was dropped at.

#### QuestionRow.js
Creates a single row in the ```QuestionTable``` to display the basic information for each question: Number, Question, Dimension, and a button to allow for editing questions. Clicking the edit button renders the ```QuestionModal```

#### QuestionModal.js
Modal that displays all relevant question metadata, and allows for data to be edited and saved, or for the question to be deleted. If **Response Type** is *text/comment/dropdown*, **Responses, Score, Points, Weight** fields are not rendered or available for editing. If **Question Type** is *tombstone*, **Reference, Link** fields are not rendered or available for editing. 

Changes to a question is stored in the database by sending the data to the backend through the ```/questions/:question_id``` post request.

A new question is stored in the database by sending the data to the backend through the ```/questions/``` post request.

When a question is deleted (by clicking the delete button, and then confirming), it is removed from the database  by sending the data to the backend through the ```/questions/:question_id``` delete request.

#### ChildModal.js
Manages the creation of hierarchy questions. When a question is dragged and dropped below another in ```QuesionTable.js```, modal is triggered and admin can select whether or not to form the relationship (*option: yes*), simply re-order the questions (*option: no*), or *cancel* to return all questions to their original positions. If *no* is selected, modal closes and ```QuestionTable.js``` updates the question numbers in the database. If *yes* is selected, the admin can select which response(s) trigger the child question, and the data is saved to the database through ```/questions/:question_id``` put request. 
