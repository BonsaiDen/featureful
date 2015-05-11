// ### @testcase-1
describe('Login', function() {

    /*
     As a user
     I want to be able to log in
     so I can do awesome stuff!
     */

    // ### @testcase-24
    it('A user tries to login', function() {

        // ### Given a login form
        expect(element.all(by.css('form.login')).count()).to.eventually.equal(1);

        // ### And given a email field
        expect(element.all(by.css('form input[type="email"]')).count()).to.eventually.equal(1);

        // ### And given a password field
        expect(element.all(by.css('form input[type="password"]')).count()).to.eventually.equal(1);

        // ### And given a login button
        expect(element.all(by.css('form input[type="submit"]')).count()).to.eventually.equal(1);

        // ### When the user enters his email address
        element(by.css('form input[type="email"]')).sendKeys('foo@bar.de');

        // ### And when the user enters his password
        element(by.css('form input[type="password"]')).sendKeys('password');

        // ### And when the user hits the login button
        element(by.css('form input[type="submit"]')).click();

        // ### And then the screen flashes
        expect();

        // ### Then the login form disappears
        expect();

        // ### And then the user becomes logged in
        expect(element.all(by.css('nav .user .email')).getText()).to.eventually.equal('foo@bar.de');

        // ### And then the user is shown the normal UI
        expect();

    });

    it('A user tries to login with invalid credentials', function() {


    });

});

describe('Other', function() {

});

