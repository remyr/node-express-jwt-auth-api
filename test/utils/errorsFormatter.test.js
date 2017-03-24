process.env.NODE_ENV = 'test';

let chai = require('chai');
let should = chai.should;

let errorsParser = require('../../utils/errorsFormatter');

describe('Errors Formatter', () => {
    it('Should return formatted error object with single error field', (done) => {
        let errors = {
            "email": {
                "message": "Please fill a valid email address",
                "name": "ValidatorError",
                "properties": {
                    "type": "user defined",
                    "message": "Please fill a valid email address",
                    "path": "email",
                    "value": "test.test"
                },
                "kind": "user defined",
                "path": "email",
                "value": "test.test"
            }
        };
        let formattedErrors = errorsParser(errors);
        formattedErrors.should.be.a('object');
        formattedErrors.should.have.property('email').eql('Please fill a valid email address');
        done();
    });

    it('Should return formatted error object with multiple error field', (done) => {
        let errors = {
            "password": {
                "message": "Field password is required",
                "name": "ValidatorError",
                "properties": {
                    "type": "required",
                    "message": "Field password is required",
                    "path": "password"
                },
                "kind": "required",
                "path": "password"
            },
            "email": {
                "message": "Please fill a valid email address",
                "name": "ValidatorError",
                "properties": {
                    "type": "user defined",
                    "message": "Please fill a valid email address",
                    "path": "email",
                    "value": "test.test"
                },
                "kind": "user defined",
                "path": "email",
                "value": "test.test"
            }
        };
        let formattedErrors = errorsParser(errors);
        formattedErrors.should.be.a('object');
        formattedErrors.should.have.property('email').eql('Please fill a valid email address');
        formattedErrors.should.have.property('password').eql('Field password is required');
        done();
    })
});