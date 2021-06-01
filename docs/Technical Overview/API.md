# Certification API documentation

## Questions Management

### GET /questions

Returns an object with a list of all survey questions in the database.
Questions are formatted as a list of surveyJS pages with 2 questions per page.

#### example

request:
```
GET /questions
```

response:
```json
{
   "pages":[
      {
         "navigationTitle":"Details",
         "name":"projectDetails1",
         "title":{
            "default":"Project Details",
            "fr":""
         },
         "elements":[
            {
               "title":{
                  "default":"Title of project",
                  "fr":""
               },
               "name":"5f85d5e4157a3b15fcc8e18d",
               "type":"text"
            }
            ...
         ]
      }
      ...
   ],
   "showQuestionNumbers":"on",
   "showProgressBar":"bottom",
   "firstPageIsStarted":"false",
   "showNavigationButtons":"false"
   "clearInvisibleValues": "onHidden"
}
```

### GET /questions/all

Returns an object with a list of all survey questions in the database. It also returns the dimensions, subdimension, and systemDimensions a question is tagged with.
Questions are not formatted for surveyJS.

#### example

request:
```
GET /questions/all
```

response:
```json
{
   "questions":[
      {
         "trigger":null,
         "domainApplicability":[
            
         ],
         "regionalApplicability":[
            
         ],
         "roles":[
            13
         ],
         "lifecycle":[
            6
         ],
         "rec_links":[
            
         ],
         "_id":"5fbc551fdf3b66962f48b103",
         "questionNumber":1,
         "__v":0,
         "alt_text":null,
         "child":false,
         "mandatory":true,
         "pointsAvailable":0,
         "prompt":null,
         "question":"Title of project",
         "questionType":"tombstone",
         "reference":null,
         "responseType":"text",
         "responses":[
            
         ],
         "trustIndexDimension":1,
         "weighting":0
      },
      ...
   ],
   "Dimensions": {
       1: {
        "dimensionID": 1, 
        "label": "T", 
        "name":"Project Details", 
        "page": "ProjectDetails"},
        ...
   },
    "subDimensions": {
        1: {
        "dimensionID": 2, 
        "subDimensionID": 1,
        "name":"Strategy (AI/Technology Experience)", 
        "maxRisk": 190,
        "maxMitigation": 0},
        ...
    },
    "systemDimensions": {
        1: {
            "systemID": 1,
            "name": "Data"
        }
        ....
    }


}
```

### GET /questions/{QUESTION_ID}

Returns the question associated with `QUESTION_ID`

#### example

request:
```
GET /questions/5f85d5e7157a3b15fcc8e468
```

response:
```json
{
    "title": {
        "default": "Are the terms of reference easy to understand by the intended audience?",
        "fr": ""
    },
    "name": "5f85d5e7157a3b15fcc8e468",
    "type": "checkbox",
    "subDimension": 2,
    "questionType": "organization",

    "recommendedLinks": {
        "default": "We recommend that the terms of reference should be clearly communicated to the intended audience. Purpose, objectives, context, and work plan are established and made clear.  ",
        "fr": ""
    },
    "score": {
        "dimension": "O",
        "choices": [
            "5f8a3fbfe4e29a55c3c18955" :0,
            "5f8a3fbfe4e29a55c3c18956": 10,
            "5f8a3fbfe4e29a55c3c18957": 15
        ],
        "max": 1
    }
    "choices": [
        {
            "value": "5f8a3fbfe4e29a55c3c18955",
            "text": {
                "default": "Yes",
                "fr": ""
            }
        },
        {
            "value": "5f8a3fbfe4e29a55c3c18956",
            "text": {
                "default": "Not sure",
                "fr": ""
            }
        },
        {
            "value": "5f8a3fbfe4e29a55c3c18957",
            "text": {
                "default": "No",
                "fr": ""
            }
        }
    ]
}
```

### POST /questions

Add a new question to the database

A question will have belong to one dimension, subDimension, and systemDimension

**questionType** : Options are tombstone, organization, risk, and mitigation

**responseType**: Options are text, comment, dropdown, radiogroup, checkbox, slider

#### example

request:
This example question has a parent question that can trigger it to appear in the survey.
```json
POST /questions

{
   "trigger": {
       "parent": "<id of parent question>",
       "responses": [
           "<id of parent questions' responses that  
           will trigger current question>"
       ],
       "parentQuestion": "Parent question text?"
   },
   "domainApplicability":[],
   "regionalApplicability":[],
   "roles":[],
   "lifecycle":[],
   "rec_links":[],
   "questionNumber":10,
   "alt_text":null,
   "mandatory":true,
   "pointsAvailable":1,
   "prompt":null,
   "question":"Test Question",
   "questionType":"organization",  
   "reference":null,
   "responseType":"radiogroup",
   "responses":[
        {
            "responseNumber": 0,
            "indicator": "Yes",
            "score": 10
        },
        {
            "responseNumber": 1,
            "indicator": "No",
            "score": 0
        }
   ],
   "trustIndexDimension":2,
   "weighting":1,
   "child": true,
   "subDimension": 2
}
```

response:
```json
{
   "trigger": {
       "parent": "<id of parent question>",
       "responses": [
           "<id of parent questions' responses that  
           will trigger current question>"
       ],
       "parentQuestion": "Parent question text?"
   }
    "domainApplicability": [],
    "regionalApplicability": [],
    "roles": [],
    "lifecycle": [],
    "rec_links": [],
    "_id": "5fbf91b74323703d62d24df3",
    "questionNumber": 10,
    "alt_text": null,
    "child": true,
    "mandatory": true,
    "pointsAvailable": 1,
    "prompt": null,
    "question": "Test Question",
    "questionType": "organization",
    "reference": null,
    "responseType": "radiogroup",
    "responses": [
        {
            "responseNumber": 0,
            "indicator": "Yes",
            "score": 10
        },
        {
            "responseNumber": 1,
            "indicator": "No",
            "score": 0
        }
    ],
    "trustIndexDimension": 2,
    "weighting": 1,
    "subDimension": 2,
    "__v": 0
}
```

## Trusted AI Providers Management

### GET /trustedAIProviders

Returns a list of all trusted AI providers in the database.

#### example

request:
```
GET /trustedAIProviders
```

response:
```json
[
    {
        "_id": "5f8960b47756296b5c6fb29f",
        "resource": "AI for K-12 Education Resources",
        "description": "A GitHub directory of K-12 educational AI materials",
        "source": "https://github.com/touretzkyds/ai4k12/wiki"
    },
    {
        "_id": "5f8960b47756296b5c6fb2a0",
        "resource": "The A-Z of AI",
        "description": "A guide that offers bit-sized explanations to help understand AI",
        "source": "https://atozofai.withgoogle.com/intl/en-GB/"
    },
    ...
]
```

## Analytics

### GET /analytics

Returns a list of all analytics in the database.

#### example

request:
```
GET /analytics
```

response:
```json
{
   "analytics":[
      {
         "_id":"5fb0fd26b738924e516932f5",
         "analyticName":"Sessions",
         "embed":"<iframe width=\"450\" height=\"371\" seamless frameborder=\"0\" scrolling=\"no\" src=\"https://docs.google.com/spreadsheets/d/e/2PACX-1vTEBLoeChbI1EO1jCLAEt20JoN-yAkOSafDf4mimsG_JeIFVMoJ0hCXg9J1WXRuwHyGMQx0c-xOn8EK/pubchart?oid=1875195725&amp;format=interactive\"></iframe>",
         "__v":0
      },
      {
         "_id":"5fb109a36764c2105583b476",
         "analyticName":"Geo",
         "embed":"<iframe width=\"465\" height=\"371\" seamless frameborder=\"0\" scrolling=\"no\" src=\"https://docs.google.com/spreadsheets/d/e/2PACX-1vTEBLoeChbI1EO1jCLAEt20JoN-yAkOSafDf4mimsG_JeIFVMoJ0hCXg9J1WXRuwHyGMQx0c-xOn8EK/pubchart?oid=658943918&amp;format=interactive\"></iframe>",
         "__v":0
      }
      ...
   ]
}
```

### POST /analytics

Add a new analytic to the database

#### example

request:
```
POST /analytics

{
    "analyticName": "New Analytic",
    "embed": "<iframe width='50' height='50' seamless frameborder='0' scrolling='no' src='...'></iframe>"
}
```

response:
```json
{
    "_id": "5fbf7885c62b8924f0fa1b31",
    "analyticName": "New Analytic",
    "embed": "<iframe width='50' height='50' seamless frameborder='0' scrolling='no' src='...'></iframe>",
    "__v": 0
}
```

## Dimensions

### GET /dimensions

Returns a list of all dimensions in the database.

#### example

request:
```
GET /dimensions
```

response:
```json
[
    {
        "_id": "5fbe13fd4b93713a34bf747d",
        "dimensionID": 1,
        "__v": 0,
        "label": "T",
        "name": "Project Details"
    },
    {
        "_id": "5fbe13fd4b93713a34bf747e",
        "dimensionID": 2,
        "__v": 0,
        "label": "RK",
        "name": "Risk"
    },
    ...
]
```

### GET /dimensions/names

Returns a list of all dimensions names.

#### example

request:
```
GET /dimensions/names
```

response:
```json
{
    "dimensions": [
        "Project Details",
        "Risk",
        "Accountability",
        "Bias and Fairness",
        "Explainability and Interpretability",
        "Robustness",
        "Data Quality"
    ]
}
```
## SubDimensions

### GET /subdimensions

Returns a list of all subdimensions in the database.

#### example

request:
```
GET /subdimensions
```

response:
```json
[
    {
        "_id": "5fbe13fd4b93713a34bf747d",
        "subDimensionID": 1,
        "dimensionID": 2,
        "__v": 0,
        "name": "Strategy (AI/Technology Experience)",
        "maxRisk": 190,
        "maxMitigation": 0
    },
    {
        "_id": "60545b136eb2823cd98155cf",
        "subDimensionID": 2,
        "dimensionID": 2,
        "__v": 0,
        "name": "Governance",
        "maxRisk": 190,
        "maxMitigation": 0

    },
    ...
]
```

## SystemDimensions

### GET /systemdimensions

Returns a list of all system dimensions in the database.

#### example

request:
```
GET /systemdimensions
```

response:
```json
[
    {
        "_id": "5fbe13fd4b93713a34bf747d",
        "name": "Data",
        "systemID": 1
    },
    {
        "_id": "60545b136eb2823cd98155cf",
        "name": "Processes",
        "systemID": 2
    },
    {
        "_id": "60a6b31d65e83a5217b38922",
        "name": "Models",
        "systemID": 3
    }
    ...
]
```

## Metadata

### GET /metadata

Returns a list of metadata that includes roles, domains, regions, and lifecycles.

#### example

request:
```
GET /metadata
```

response:
```json
{
    "domain": [
        {
            "_id": "5fbc3a98df3b66962f3a88e7",
            "domainID": 1,
            "__v": 0,
            "name": "Health"
        },
         ...
    ],
    "lifecycle": [
        {
            "_id": "5fbc3a98df3b66962f3a884f",
            "lifecycleID": 1,
            "__v": 0,
            "name": "Plan and Design"
        },
         ...
    ],
     "region": [
        {
            "_id": "5fbc3a97df3b66962f3a87b5",
            "regionID": 1,
            "__v": 0,
            "name": "Africa"
        },
        ...
    ],
    "roles": [
        {
            "_id": "5fbc3a96df3b66962f3a869f",
            "roleID": 1,
            "__v": 0,
            "name": "Product Owner / Business Owner"
        },
         ...
    ]
}
```


## Users

### GET /user 

Returns a list of all users in the database.

#### example

request:
```
GET /users
```

response:
```json
[
    {
        "role":"admin",
        "_id":"5fadea7e2bb08880f012cf5c",
        "orgs":[],
        "email":"mlnguyen@ualberta.ca",
        "username":"mlnguyen@ualberta.ca",
        "__v":0,
        "organization":"University of Alberta"
    },
    {
        "role":"superadmin",
        "_id":"5fb02188cbd4a712416a331c",
        "orgs":[],
        "email":"dronan@ualberta.ca",
        "username":"dronan@ualberta.ca",
        "__v":0
    }
    ...
]
```

### GET /user/{USER_ID}

Returns the user associated with `USER_ID`

### example

request:
```
GET /users/5fbdb1a135c3b617d06e498f
```

response:
```json
{
    "role": "member",
    "_id": "5fbdb1a135c3b617d06e498f",
    "email": "example@ai-global.org",
    "username": "example@ai-global.org",
    "organization": "AI Global",
    "__v": 0
}
```

### POST /create

Upon validation of the user's information against the database, adds a new user to the database

### example

request:
```
POST /users/create
{
	"username": "test",
	"email": "test@test",
	"password": "Test123!",
   "passwordConfirmation": "Test123!"
}
```

response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYmZhYmNkODdjZjc0M2E5ODc5NjZmNSIsImlhdCI6MTYwNjM5Njg3NywiZXhwIjoxNjA4OTg4ODc3fQ.1tAalZnDyTc0YKAtjf4SlnGTx0eJ0y9bPj3-RaF5xGc",
    "user": {
        "id": "5fbfabcd87cf743a987966f5",
        "username": "test",
        "email": "test@test"
    }
}
```

### POST /auth

Upon validation of the username and password against the database, returns an authorization token and the associated user

### example

request:
```
POST /users/auth
{
	"username": "test",
	"password": "Test123!"
}
```

response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYmZhYmNkODdjZjc0M2E5ODc5NjZmNSIsImlhdCI6MTYwNjM5NzAyMCwiZXhwIjoxNjA4OTg5MDIwfQ.vfi6-1nug_zy2J7k8eWDXw62TXmvgpLn9GSxk16-M3s",
    "user": {
        "id": "5fbfabcd87cf743a987966f5",
        "username": "test",
        "email": "test@test"
    }
}
```

### GET /users/user

returns user associated with the header x-auth-token

### example

request:
```
POST /users/user
{
   "headers": {
      "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYmZhYmNkODdjZjc0M2E5ODc5NjZmNSIsImlhdCI6MTYwNjM5NzAyMCwiZXhwIjoxNjA4OTg5MDIwfQ.vfi6-1nug_zy2J7k8eWDXw62TXmvgpLn9GSxk16-M3s"
   }
}
```

response:
```json
{
    "role": "member",
    "_id": "5fbfabcd87cf743a987966f5",
    "email": "test@test",
    "username": "test",
    "__v": 0
}
```


