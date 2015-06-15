Feature: A Feature

    @tagOne @tagTwo
    Scenario Outline: Scenario Outline for title <title>

        A 
        Scenario
        Description.

        Given the preset <preset>
        When the condition <condition>
        Then perform the action <action>

        Examples: 
            | title | preset | condition | action |
            | TA    | PA     | CA        | AA     |
            | TB    | PB     | CB        | AB     |
            
