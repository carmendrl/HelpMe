[Back to Topics](APIDOC.md)

## Questions

A user must be a part of a session to manipulate any of the questions in that session.

#### Questions have four different statuses:
- Pending
- Claimed
- Assigned
- Answered

If there is an answer existing for a question, it will be "answered". This is
true even if there is someone who has "claimed" it.

If someone has been assigned, it will be "assigned". "Claimed", however, has precedence and if someone has claimed it, even if someone else has been assigned, it will be "claimed".

If someone has claimed it and there is still no answer, it will be "claimed".

Otherwise the status of the question will be "pending".

#### Creating a Question
#### `POST /lab_sessions/:lab_session_id/questions`

Request Parameters
```json
{
    "text": "Why is abbreviated such a long word?",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `text` | Required. The text of the question |

Return Object for Students

```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "Why is abbreviated such a long word?",
      "created-at": "2017-11-10T12:00:00Z",
      "status": "pending",
    },
  }
}
```

Return Object for Professors

This will include the asker of the question. When the professor creates the question, clearly he or she is the asker. Only professors will be able to see the asker.

```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "Why is abbreviated such a long word?",
      "created-at" : "2017-11-10T12:00:00Z",
      "status": "pending",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "professors",
          "id" : "52a11fe7-8394-48fc-bc42-8375555eed17",
        },
      },
    },
  },
}
```

#### Getting a Question
#### `GET /lab_sessions/:lab_session_id/questions/:question_id`

Return object for students
```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "How much wood can a woodchuck chuck?",
      "created-at": "2017-11-10T12:00:00Z",
      "status": "pending"
    },
  }
}
```

Return object for professors
```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "How much wood can a woodchuck chuck?",
      "created-at" : "2017-11-10T12:00:00Z",
      "status": "pending",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "students",
          "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
        },
      },
    },
  },
}
```

#### Updating a Question
#### `PUT /lab_sessions/:lab_session_id/questions/:question_id`

Request Parameters
```json
{
    "text": "How much wood can a woodchuck chuck?",
    "claimed_by_id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `text` | Required. The text of the question |
| `claimed_by_id` | Optional. The id of the person who has claimed the question |

Return Object for Students

```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "How much wood can a woodchuck chuck?",
      "created-at": "2017-11-10T12:00:00Z",
      "status": "pending"
    },
  }
}
```

Return Object for Professors

Notice that it was a student who asked this question, but the professor updated it. It still keeps the student as the original asker.

```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "How much wood can a woodchuck chuck?",
      "created-at" : "2017-11-10T12:00:00Z",
      "status": "claimed",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "students",
          "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
        },
      },
      "claimed-by" : {
        "data" : {
          "type" : "professors",
          "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
        },
      },
    },
  },
}
```

#### Listing Questions from a Lab Session
#### `GET lab_sessions/:lab_session_id/questions`

If requestor is a student response payload

```json
{
  "data" : [
    {
      "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
      "type" : "questions",
      "attributes" : {
        "text" : "What is a string?",
        "created-at" : "2017-11-10T12:00:00Z",
        "status": "claimed",
      },
    },
    {
      "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
      "type" : "questions",
      "attributes" : {
        "text" : "How do I call a method?",
        "created-at" : "2017-11-10T12:00:00Z"
      },
      "relationships" : {
        "claimed-by" : {
          "data" : {
            "type" : "professors",
            "id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
          },
        },
      },
    },
  ],
}
```

If requestor is a professor response payload

```json
{
  "data" : [
    {
      "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
      "type" : "questions",
      "attributes" : {
        "text" : "What is a string?",
        "created-at" : "2017-11-10T12:00:00Z",
        "status": "pending",
      },
      "relationships" : {
        "asker" : {
          "data" : {
            "type" : "students",
            "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
          },
        },
      },
    },
    {
      "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
      "type" : "questions",
      "attributes" : {
        "text" : "How do I call a method?",
        "created-at" : "2017-11-10T12:00:00Z",
        "status": "pending",
      },
      "relationships" : {
        "asker" : {
          "data" : {
            "type" : "students",
            "id" : "314df30b-078b-437c-84c1-edc3949d3ae2",
          },
        },
      },
    },
  ],
}
```

#### Deleting a Question
#### `DELETE /lab_sessions/:lab_session_id/questions/:question_id`

Success Response Code 204 (No Content)

#### Claiming a Question
#### `GET /lab_sessions/:lab_session_id/questions/:id/claim`

In order to claim a question, issue an authorized get request with the specified ids.

Return object is the question

#### Assigning a Question
### `POST /lab_sessions/:lab_session_id/questions/:id/assign`

Request Parameters
```json
{
    "user_id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
}
```

If the JSON has valid values, the question will be assigned. Additionally,
the person who is being assigned the question must be a professor or a TA.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `user_id` | Required. The id of the user that this question is being assigned to. |

Return object is the question.

#### Asking a question that has already been asked (Me too!)
### `POST /lab_sessions/:lab_session_id/questions/:question_id/askers`

This will add the signed in user to the question's list of askers

Return Object is the question

#### Removing someone from asking a question
### `DELETE /lab_sessions/:lab_session_id/questions/:question_id/askers`

If someone no longer has a question, this will remove them from the question.

Success Response Code 204 (No Content)
