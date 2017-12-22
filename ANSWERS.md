[Back to Topics](APIDOC.md)

## Answers

To answer a question, include the specified id in an authorized request as well as an optional text answer to the question.

#### Creating an Answer
#### `POST /lab_sessions/:lab_session_id/questions/:question_id/answer`

Request Parameters
```json
{
    "text": "This is an anwswer to a question",
}
```

If the JSON has valid values, the answer will be created.

Request Parameters:

| Answer Field | Description |
|-------|-------------|
| `text` | Optional. The text of the answer |
| `answerer` | Optional. The user who anwsered the question |

Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is an answer to a question",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships": {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Getting an Answer
#### `GET /lab_sessions/:lab_session_id/questions/:question_id/answer`

Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is an answer to a question",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships" : {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Editing an Answer
#### `PUT /lab_sessions/:lab_session_id/questions/:question_id/answer`
Request Parameters
```json
{
    "text": "This is a new, updated anwswer",
}
```

If the JSON has valid values, the answer will be updated.

Request Parameters:

| Answer Field | Description |
|-------|-------------|
| `text` | Optional. The text of the answer |
| `answerer_id` | Optional. The user who anwsered the question |


Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is a new, updated anwswer",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships" : {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Deleting an Answer
#### `DELETE /lab_sessions/:lab_session_id/questions/:question_id/answer`

Success Response Code 204 (No Content)
