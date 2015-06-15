Feature: A Feature

    @tagOne @tagTwo
    Scenario Outline: Scenario Outline for title <title>

        A 
        Scenario
        Description.

        Given the number <value>

        Examples: A negative Example
            | title | value | 
            | Foo   | -1    | 
            | Bar   | -2    | 
            
        Examples: A positive Example
            | title | value | 
            | Foo   | 1     | 
            | Bar   | 2     | 

