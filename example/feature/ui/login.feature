@testcase-1
Feature: Login
    As a user
    I want to be able to log in
    so I can do awesome stuff!

    @testcase-24 
    Scenario: A user tries to login
        Given a login form
            And a email field
            And a password field
            And a login button

        When the user enters his email address
            And the user enters his password
            And the user hits the login button

        Then the login form disappears
            And the screen flashes
            And the user becomes logged in
            And the user is shown the normal UI

    Scenario: A user tries to login with invalid credentials


    Scenario: Another one

Feature: Other
