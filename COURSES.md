[Back to Topics](APIDOC.md)

## Courses

A Course Object

```json
{
  "data": {
    "id": "3b352f1f-909f-4349-9577-a8b57543a5ea",
    "type": "courses",
    "attributes" : {
      "title": "Database Systems",
      "subject": "CSCI",
      "number": "392",
      "semester": "201708",
    },
    "relationships": {
      "instructor": {
        "id": "7c721464-19ce-46e9-820e-23fdd7fba618",
        "type": "professors",
      },
    },
  },
}
```

#### Getting all of the courses
#### `GET /courses`

```json
{
  "data": [
    {
      "id": "3b352f1f-909f-4349-9577-a8b57543a5ea",
      "type": "courses",
      "attributes" : {
        "title": "Database Systems",
        "subject": "CSCI",
        "number": "392",
        "semester": "201708",
      },
      "relationships": {
        "instructor": {
          "id": "7c721464-19ce-46e9-820e-23fdd7fba618",
          "type": "professors",
        },
      },
    },
  ],
}
```

#### Creating a course
#### `POST /courses`

You can create a session by creating a JSON representation of one and sending a post request to `/courses`.

Request Parameters
```json
{
    "title": "Database Systems",
    "subject": "CSCI",
    "number": "392",
    "semester": "201708",
}
```

If the JSON has valid values, the lab session will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `title` | The title of the course. Required |
| `subject` | The subject of the course. Required |
| `number` | The number of the course. Required |
| `semester` | The semester the course will be taught in. Required. Must match the format of "201801". |

Returns a json representation of a lab session as specified at the top of this file.

#### Getting a course
#### `GET /courses/:id`

Returns a json representation of the lab session with the given id. Must be a professor to create a course.

#### Updating a course
#### `PUT /courses/:id`

Request Parameters
```json
{
    "title": "Database Systems",
    "subject": "CSCI",
    "number": "392",
    "semester": "201708",
}
```

If the JSON has valid values, the lab session will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `title` | The title of the course. Required |
| `subject` | The subject of the course. Required |
| `number` | The number of the course. Required |
| `semester` | The semester the course will be taught in. Required. Must match the format of "201801". |

Returns a json representation of a lab session as specified at the top of this file.

#### Deleting a course
#### `DELETE /courses/:id`

Must be a professor in order to delete a course.

#### Joining a course
#### `POST /courses/:id/students`

By signing in and posting to this url, a user will be added to the course with the given id.

Success Response Code 204 (No Content)

#### Leaving a course
#### `DELETE /courses/:course_id/students/:id`

A user with the given id will be removed from the course with the course id. The user will
not be removed unless the signed in user is a professor or the same user that is being
removed.

Success Response Code 204 (No Content)
