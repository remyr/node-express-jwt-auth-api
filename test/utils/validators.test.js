process.env.NODE_ENV = 'test';

let chai = require('chai');

let Validators = require('../../utils/validators');

describe('Validators', () => {
    describe('Email validator', () => {

        it('Should return false for test@tes email', (done) => {
            let email = 'test@tes';
            Validators.emailValidator(email).should.be.eql(false);
            done();
        });

        it('Should return true true for test@test.com email', (done) => {
            let email = 'test@test.com';
            Validators.emailValidator(email).should.be.eql(true);
            done();
        })
    })
});