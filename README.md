# Leaderboard API

## Demo

[http://ren-leaderboard-api.herokuapp.com/entries/](http://ren-leaderboard-api.herokuapp.com/entries/)

Use token `notasecrettoken` for the __Authorization__ header

# Entries

## Entry Creation [/entries/]

### Create Entry [POST]

  **Requires valid token**

  + Request (application/json)


    + Headers

            Authorization: Token secrettoken

    + Body

            {
                "name": "John Smith",
                "email": "john.smith@gmail.com",
                "score": 100
            }

  + Response 201 (application/json)

      + Body

            {
              "status": 201,
              "message": "Entry successfully created."
            }

      + Schema

            {
              "type": "object",
              "$schema": "http://json-schema.org/draft-04/schema#",
              "name": "Status Object",
              "description": "Schema for a server status object.",
              "properties": {
                "message": {
                  "type": "string"
                },
                "status": {
                  "type": "integer",
                  "value": 201
                }
              },
              "required": [
                "message",
                "status"
              ]
            }

## Entries [/entries/{?orderBy,direction}]

### Get Entries [GET]

**Requires valid token**

+ Parameters
    + orderBy (string, `score`) ... The field in which to order entries
        + Values
            + `score`
            + `email`
            + `name`
    + direction (string, `asc`) ... The direction in which to order entries
        + Values
            + `asc`
            + `desc`


+ Response 200 (application/json; charset=utf-8)

    + Headers

            X-Total-Count: 1

    + Body

            {
                "entries": [
                    {
                      "id": "cfae1ce3-0396-4772-b005-5d54db450c5c",
                      "uri": "/entries/cfae1ce3-0396-4772-b005-5d54db450c5c/",
                      "name": "John Smith",
                      "email": "john.smith@gmail.com",
                      "score": 100
                    },
                    {
                      "id": "96d666c3-c138-495e-9aa8-4cfed4a7d4bf",
                      "uri": "/entries/96d666c3-c138-495e-9aa8-4cfed4a7d4bf/",
                      "name": "Ren Simmons",
                      "email": "rsimmo412@gmail.com",
                      "score": 110
                    }
                ]
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "entries": {
                  "type": "array",
                  "items": [
                    {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "uri": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "email": {
                          "type": "string"
                        },
                        "score": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "id",
                        "uri",
                        "name",
                        "email",
                        "score",
                      ]
                    }
                  ]
                }
              },
              "required": [
                "entries"
              ]
            }

## Entry [/entries/{entryId}/]

+ Parameters
    + entryId (string, `96d666c3-c138-495e-9aa8-4cfed4a7d4bf`) ... The id of the entry

### Get Entry [GET]

  + Response 200 (application/json)

    + Body

              {
                  "id": "96d666c3-c138-495e-9aa8-4cfed4a7d4bf",
                  "uri": "/entries/96d666c3-c138-495e-9aa8-4cfed4a7d4bf/",
                  "name": "John Smith",
                  "email": "john.smith@gmail.com",
                  "score": 100,
                  "created": "2016-09-08T14:23:00.600Z"
              }

    + Schema

              {
                  "$schema": "http://json-schema.org/draft-04/schema#",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "uri": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    },
                    "email": {
                      "type": "string"
                    },
                    "score": {
                      "type": "number"
                    },
                    "created": {
                      "type": "number"
                    }
                  },
                  "additionalProperties": false,
                  "required": [
                    "id",
                    "uri",
                    "name",
                    "email",
                    "score",
                    "created"
                  ]
                }
