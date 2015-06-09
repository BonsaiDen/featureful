@tagOne @tagTwo
Feature: A Feature

    A 
    description 
    of 
    the 
    feature.

    @tagOne @tagTwo
    Scenario: A Scenario
        Given some condition
            And a doc string
                """
                A doc string text.

                With multiple lines.

                Of text.
                """

        When something happens
        Then some action is performed
            And a data table is parsed
                | color | hex     | index |
                | red   | #ff0000 | 0     |
                | green | #00ff00 | 1     | 
                | blue  | #0000ff | 2     |
            
