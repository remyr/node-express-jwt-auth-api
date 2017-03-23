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
[Forgot password](#forgot_password) | POST | `/api/v1/forgot-password`
[Reset password](#reset_password) | POST | `/api/v1/reset-password/:reset_token`

### User Enpoints

functionality | method | endpoint
--- | --- | ---
[Current user information](#current_user) | GET | `/api/v1/user`
[Modify current user](#modify_user) | PUT | `/api/v1/user`
[Change password](#change_password) | PUT | `/api/v1/user/change-password`


<a name="register"></a>
#### Register
`POST /api/v1/register`

Allow user to create an account with an email and password. The user could also provide an username but the connexion is with email.

*Input*
```` JSON
POST /api/vi/register
{
	"email" : "some.user@mail.com",
	"password" : "mysecretpassword",
}
````
*Output*
```` JSON
{
	"success" : true,
	"message" : "Successfully created new user.",
}
````

<a name="login"></a>
#### Log in and Authenticate
`POST /api/v1/login`

Allow user to log in with email and password and get a JWT token that he should provide for all protected routes.

*Input*
```` JSON
POST /api/vi/login
{
	"email" : "some.user@mail.com",
	"password" : "mysecretpassword",
}
````
*Output*
```` JSON
{
	"success" : true,
	"token" : "JWT sOme.JwT.t0k3n",
}
````

<a name="forgot_password"></a>
#### Forgot password
`POST /api/v1/forgot-password`

Allow user to reset his password. With this endpoint the server generate an unique hash that should be provided in `/api/v1/reset-password` endpoint.
The hash link is only valid 1 hour. After that, the user should re-ask the server to reset his password. 
###### *(TODO: send email with hash in link and add config to send email)*

*Input*
```` JSON
POST /api/v1/forgot-password
{
	"email" : "some.user@mail.com",
}
````
*Output*
```` JSON
{
	"success" : true,
	"resetPasswordToken" : "random_hash",
}
````


<a name="reset_password"></a>
#### Reset password
`POST /api/v1/reset-password/:reset_token`

Allow user to reset his password and provide a new one.
##### Params:
##### *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; reset_token : hash generate by `/api/v1/forgot-password`*

*Input*
```` JSON
POST /api/v1/reset-password/:reset_token
{
	"password" : "newPassword",
	"confirmPassword" : "newPassword",
}
````
*Output*
```` JSON
{
	"success" : true,
	"message" : "Password successfully update",
}
````

<a name="current_user"></a>
#### Current user information
`GET /api/v1/user`

Get information of user connected by JWT token

*Output*
```` JSON
{
	"_id" : "random id generated by mongo",
	"email" : "som@email.com",
	"username" : "Username",
}
````

<a name="modify_user"></a>
#### Modify current user
`PUT /api/v1/user`

Modify all field of user connected by JWT token expected password.

###### *(TODO: send email to confirm new email, and add configuration)* 

*Input*
```` JSON
PUT /api/v1/user
{
	"email" : "new@email.com",
	"username" : "newUSername",
}
````
*Output*
```` JSON
{
	"success" : true,
	"user" : {email: "new@email.com", username: "newUsername"},
}
````

<a name="change_password"></a>
#### Change password
`PUT /api/v1/user/change-password`

Allow connected user to change his password. 

*Input*
```` JSON
PUT /api/v1/user
{
	"password" : "newPassword",
	"confirmPassword" : "newPassword",
}
````
*Output*
```` JSON
{
	"success" : true,
	"message" : "Password successfully update",
}
````

## TESTS ##

Just run the following command
```sh
$ npm run test
```

## TODOS ##
 
- send email after registration
- add config for email parameters 
- add config to enable/disable email sending