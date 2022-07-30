# Readshare

Readshare is a nodejs application built for sharing links across your team. Although we have messaging apps and
there is E-mail as well. However, sending an E-mail or a message just for a link seems a bit too much. Readshare
is a very simple web app to solve that very problem, just drop in the links you want to be shared across the team
and it is done.

Further, this is more of a learning exercise and my first project in nodejs so some of the design desions might seem
foolish and I would completely agree with you, if you were to point them out to me.

## Running the application
```app.js``` is the main file of this project and that is what you'd need to run. However, it will only run if you have a few things configured (look at config.txt).
### Resources Required
- MongoDB - The collection will be made automatically however you'd need the connection string.
- Kafka cluster (host, port, username, password) with a topic named "team-mail-invite"

### Startin the app
- First you'd need to install all the packages required for this project. Which you can do by running the following command once in the project repo.
```bash
npm install
```
Right now, they are a bit of a mess I will maybe clean them up someday.
- Once that is done you can run the following command to spin-up the appliaction
```bash
node app.js
```
or if you use nodemon
```bash
nodemon run dev
```

#### Notes
- The logout functionality is currently broken. It should be fixed once there is a new stable version on passport-js