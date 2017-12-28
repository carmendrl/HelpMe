[Back to Topics](APIDOC.md)

## Tags

Tags are either global, meaning they are accessible everywhere, or they are local
to a course. When tagging a question, the tags must either be chosen from the global
tags, or from that course's tags. All tag operations must be done while signed in.

#### Listing global tags
#### `GET /tags`

Return object:

```json
{
  "data": [
    "Tag name",
    "Second tag name",
  ]
}
```

#### Listing a course's tags
#### `GET /courses/:course_id/tags`
```json
{
  "data": [
    "Course-specific tag",
    "Global tag",
  ]
}
```

#### Adding a tag to a specific question
#### `POST /lab_sessions/:lab_session_id/questions/:question_id/tags/`

Request Parameters
```json
{
    "tag": "Database Systems",
}
```

If the JSON has valid values, the lab session will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `tag` | The name of the tag being added. Required |

Return object:
```json
{
  "data": [
    "Tag name",
    "Second tag name",
    "Database Systems",
  ]
}
```

#### Removing a tag specific to a question
#### `POST /lab_sessions/:lab_session_id/questions/:question_id/tags/:tag`

If, for instance, we had the list of tags:
```
[
  "Tag name",
  "Second tag name",
  "Database Systems"
]
```
and we wanted to remove `Database Systems`, the url would be:
`lab_sessions/:lab_session_id/questions/:question_id/tags/Database%20Systems` (the `%20` being the URL encoding for spaces).

Return object:
```json
{
  "data": [
    "Tag name",
    "Second tag name",
  ]
}
```
