process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require("mongoose");
let config = require('../../config/config');

let server = require('../../server/server');
let should = chai.should();

let User = require('../../models/user.model');

mongoose.connect(config.db);

chai.use(chaiHttp);

let urls = {
    register: '/api/v1/register',
    login: '/api/v1/login',
    forgotPassword: '/api/v1/forgot-password',
    resetPassword: '/api/v1/reset-password/'
};

describe('Authentication', () => {
    /* AFTER ALL TEST REMOVE ALL USER */
    after((done) => {
        User.remove({}, (err) => {
            done();
        })
    });

    describe('POST /register', () => {
        it('Should return error if not correct params are supplied', (done) => {
            let user = {
                email: 'test@test.com'
            };
            chai.request(server)
                .post(urls.register)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('errors').to.be.a('object');
                    res.body.errors.should.have.property('password').eql('Field password is required');
                    done();
                })
        });

        it('Should return error if invalid email address was supplied', (done) => {
            let user = {
                email: 'test@gm',
                password: 'test'
            };
            chai.request(server)
                .post(urls.register)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('errors').to.be.a('object');
                    res.body.errors.should.have.property('email').eql('Please fill a valid email address');
                    done();
                })
        });

        it('Should create a new user', (done) => {
            let user = {
                email: 'test@test.com',
                password: 'test'
            };
            chai.request(server)
                .post(urls.register)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Successfully created new user.');
                    User.find((err, users) => {
                        users.should.be.a('array');
                        users.length.should.be.eql(1);
                        done();
                    })
                })
        });
    });

    describe('POST /login', () => {
        before(done => {
            new User({email: 'test@test.com', password: 'test'}).save(err => {
                done();
            });
        });
        it('Should return error if no user with specific email was registered', (done) => {
            let user = {
                email: 'test@wrong.com',
                password: 'test'
            };
            chai.request(server)
                .post(urls.login)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed, User not found');
                    done();
                })
        });

        it('Should return error if password is invalid', (done) => {
            let data = {
                email: 'test@test.com',
                password: 'wrong'
            };
            chai.request(server)
                .post(urls.login)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed');
                    done();
                })
        });

        it('Should return JWT Token if credentials are valid', (done) => {
            let user = {email: 'test@test.com', password: 'test'};
            chai.request(server)
                .post(urls.login)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('token');
                    done();
                })
        })
    });

    describe('POST /forgot-password', () => {

        before(done => {
            new User({email: 'test@test.com', password: 'test'}).save(err => {
                done();
            });
        });

        it('Should return errors if no address email was provided', (done) => {
            let user = {};
            chai.request(server)
                .post(urls.forgotPassword)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('No account with that email address exists');
                    done();
                })
        });

        it('Should return errors if address email didn\'t match with user in db', (done) => {
            let user = {email: 'test@wrong.com'};
            chai.request(server)
                .post(urls.forgotPassword)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('No account with that email address exists');
                    done();
                })
        });

        it('Should return token for resetting password', (done) => {
            let user = {email: 'test@test.com', password: 'test'};
            chai.request(server)
                .post(urls.forgotPassword)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('resetPasswordToken').to.be.a('string');
                    token = res.body.resetPasswordToken;
                    done();
                })
        })
    });

    describe('POST /reset-password/:token', () => {

        before(done => {
            new User({email: 'test@test.com', password: 'test'}).save(err => {
                done();
            });
        });

        it('Should return error if reset token is invalid', (done) => {
            let data = {};
            chai.request(server)
                .post(urls.resetPassword + 'wrongtoken')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Password reset token is invalid or has expired');
                    done();
                })
        });

        it('Should return errors if password and confirm password are different', (done) => {
            let user = {password: 'newPassword', confirmPassword: 'otherPassword'};
            chai.request(server)
                .post(urls.forgotPassword)
                .send({email: 'test@test.com'})
                .end((err, res) => {
                    chai.request(server)
                        .post(urls.resetPassword + res.body.resetPasswordToken)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('message').eql('Passwords must be identical');
                            done();
                        })
                });
        });

        it('Should change user\'s password', (done) => {
            let user = {password: 'newPassword', confirmPassword: 'newPassword'};
            chai.request(server)
                .post(urls.forgotPassword)
                .send({email: 'test@test.com'})
                .end((err, res) => {
                    chai.request(server)
                        .post(urls.resetPassword + res.body.resetPasswordToken)
                        .send(user)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('message').eql('Password successfully update');
                            done();
                        })
                });
        });

    });

});