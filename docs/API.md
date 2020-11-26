

# Responsible‌ ‌Design‌ ‌Assistant‌ API documentation

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

Returns an object with a list of all survey questions in the database.
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
   ]
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
    "recommendation": {
        "default": "We recommend that the terms of reference should be clearly communicated to the intended audience. Purpose, objectives, context, and work plan are established and made clear.  ",
        "fr": ""
    },
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

#### example

request:
```
POST /questions

{
   "trigger":null,
   "domainApplicability":[],
   "regionalApplicability":[],
   "roles":[],
   "lifecycle":[],
   "rec_links":[],
   "questionNumber":1,
   "alt_text":null,
   "child":false,
   "mandatory":true,
   "pointsAvailable":0,
   "prompt":null,
   "question":"Test Question",
   "questionType":"tombstone",
   "reference":null,
   "responseType":"text",
   "responses":[],
   "trustIndexDimension":1,
   "weighting":0
}
```

response:
```json
{
    "trigger": {
        "responses": []
    },
    "domainApplicability": [],
    "regionalApplicability": [],
    "roles": [],
    "lifecycle": [],
    "rec_links": [],
    "_id": "5fbf91b74323703d62d24df3",
    "questionNumber": 1,
    "alt_text": null,
    "child": false,
    "mandatory": true,
    "pointsAvailable": 0,
    "prompt": null,
    "question": "Test Question",
    "questionType": "tombstone",
    "reference": null,
    "responseType": "text",
    "responses": [],
    "trustIndexDimension": 1,
    "weighting": 0,
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
