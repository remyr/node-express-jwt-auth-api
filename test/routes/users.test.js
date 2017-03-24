process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require("mongoose");
let config = require('../../config/config');

let server = require('../../server/server');
let should = chai.should();

let User = require('../../models/user.model');

let authRoutes = (route) => {
    return it('Should return errors if no valid token was provided', (done) => {
        chai.request(server)
            .get(route)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Unauthorized');
                done();
            })
    });
};

const urls = {
    users: '/api/v1/user',
    changePassword: '/api/v1/user/change-password',
    login: '/api/v1/login',
};

describe('USERS', () => {

    let token = null;

    before(done => {
        new User({email: 'test@test.com', password: 'test', username: 'test'}).save(err => {
            chai.request(server)
                .post(urls.login)
                .send({email: 'test@test.com', password: 'test'})
                .end((err, res) => {
                    token = res.body.token;
                    done();
                })
        });
    });

    after((done) => {
        User.remove({}, (err) => {
            done();
        })
    });

    describe('GET /user', () => {

        authRoutes(urls.users);

        it('Should return user information', (done) => {
            chai.request(server)
                .get(urls.users)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user').to.be.a('object');
                    res.body.user.should.have.property('username').eql('test');
                    res.body.user.should.have.property('email').eql('test@test.com');
                    res.body.user.should.not.have.property('password');
                    done();
                })
        })

    });

    describe('PUT /user', () => {

        authRoutes(urls.users);

        it('Should update username', (done) => {
            let data = {username: 'testModify'};
            chai.request(server)
                .put(urls.users)
                .set('Authorization', token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user').to.be.a('object');
                    res.body.user.should.have.property('username').eql('testModify');
                    res.body.user.should.have.property('email').eql('test@test.com');
                    done();
                })
        });

    });

    describe('PUT /user/change-password', () => {

            authRoutes(urls.changePassword);

            it('Should return errors if passwords are not identical', (done) => {
                let data = {password: 'newPassword', confirmPassword: 'newWrongPassword'};
                chai.request(server)
                    .put(urls.changePassword)
                    .set('Authorization', token)
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('message').eql('Passwords must be identical');
                        done();
                    })
            });

            it('Should update password', (done) => {
                let data = {password: 'newPassword', confirmPassword: 'newPassword'};
                chai.request(server)
                    .put(urls.changePassword)
                    .set('Authorization', token)
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql('Password successfully update');
                        done();
                    })
            });

        })

});