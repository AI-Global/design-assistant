

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
   "showQuestionNumbers":"false",
   "showProgressBar":"bottom",
   "firstPageIsStarted":"false",
   "showNavigationButtons":"false"
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
