# Node-express-auth API

The node-express-auth API provided basic endpoints to register users, log in users and get a JWT token.<br/>
It also provide authentication middleware to handle authorization for routes.

### Dependencies ###

- NodeJS
- Express
- Passport
- Passport JWT
- Mongoose

## How to use ##

1. Configure your server

Create a `config_local.js` file or enter your settings directly in `config/config.js`
- Port: port where api should be served
- secret: secret key used to encrypt/decrypt JWT Token
- db: url of mongodb database

```javascript
const cfg = {
    port: 3000,
    secret: 'y0urSup3erS3cretKey',
    db: 'mongodb://localhost:27017/database_name'
};
```

2. Install dependencies

Install project's dependencies. You can use NPM or Yarn.
```sh
$ npm install
```
OR
```sh
$ yarn install
```

3. Run server

At this point you should launch your server. We included `nodemon` to handle auto-refresh.
```sh
$ npm run start
```



## API Endpoints ##

### Authentication Endpoints

functionality | method | endpoint
--- | --- | ---
[Register](#register) | POST | `/api/v1/register`
[Log in and Authenticate](#login) | POST | `/api/v1/login`

### User Enpoints

TODO


<a name="register"></a>
### Register
`POST /api/v1/register`

Allow user to create an account with an email and password. The user could also provide an username but the connexion is with email.
- Example input
```` JSON
POST /api/vi/register
{
	"email" : "some.user@mail.com",
	"password" : "mysecretpassword",
}
````
- Output
```` JSON
{
	"success" : true,
	"message" : "Successfully created new user.",
}
````

<a name="login"></a>
### Log in and Authenticate
`POST /api/v1/login`

Allow user to log in with email and password and get a JWT token that he should provide for all protected routes.
- Example input
```` JSON
POST /api/vi/login
{
	"email" : "some.user@mail.com",
	"password" : "mysecretpassword",
}
````
- Output
```` JSON
{
	"success" : true,
	"token" : "JWT sOme.JwT.t0k3n",
}
````