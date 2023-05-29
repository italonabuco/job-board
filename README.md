# GraphQL Job Board

This is a project used in the [GraphQL by Example](https://www.udemy.com/course/graphql-by-example/?referralCode=7ACEB04674F000BAC061) course.

It uses Apollo Server with Express, and GraphQL-Request and Apollo Client as GraphQL clients. The application is used to explain queries, mutations, custom object types, authentication, etc.

## Server

### Scripts

`npm start`

Runs server at http://localhost:4000.

Initialize Apollo Server at: http://localhost:4000/graphql

`npm run db:reset`

Resets database with initial prefilled data.

## Client

### Scripts

`npm start`

Runs application at http://localhost:3000/

## Database

For this project, It's using SQlite 3.
`./server/data/db.sqlite3` contains the data for this application

If you're not able to see the content inside it, you could install the following extension for VSCode: 

Name: SQLite Viewer
Id: qwtel.sqlite-viewer
Description: SQLite Viewer for VSCode
Version: 0.2.5
Publisher: Florian Klampfer
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer

#### Connection to the database

Please check `./server/db/connection.js`