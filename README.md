# Real Time Chat App Project (Get a Room)

A project built to experiment with using socket.io to implement real-time, multi-person chatrooms. Built using Nodejs, Express, Reactjs and Socket.io. 

The initial version of the app was built based off of [this tutorial by Javascript Mastery](https://youtu.be/ZwFA3YMfkoc)

Additional features not originally included in the tutorial are included below in **bold**.

## Summary

The server side is simplistic and is not connected to any database. Rather, all information regarding users, chatrooms or messages are stored locally on the server. **Rooms along with their messages are deleted when all users have left, and users are deleted on socket disconnect**.

Rooms allow multiple users and on opening, **a random, 6-digit numberic passcode is generated and used to authenticate any users that attempt to join**. **Users may join multiple rooms**. Messages sent in a room are automatically sent to any users that **currently have the room as active in the client. Otherwise, a notification is registered instead.** **A user may leave a room without having to log out of the application**.

**Images may be sent as messages and previously sent images may be found in the room details modal. **

## Pre-requisites to run locally

- NodeJS and NPM

## Local setup

1. Clone the repo
2. cd into /client and run ```npm install``` to install all dependencies
3. run ```npm start``` to locally start the client on port 3000
4. cd into /server and run ```npm install``` to install all dependencies
5. run ```npm start``` to locally start the server on port 5000 (or the port defined in /server/.env

_Remember to set the appropriate environment variables. See .env.example in /client and /server for more info_

## Additional changes

Below are features, changes or additional tasks that would have been beneficial to implement.

- More cohesive sense of styling throughout the app
- Unit tests
- A more secure form of passcode authentication
- Inviting specific users to a room without the need for passcode authentication
