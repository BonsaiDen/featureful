Feature: A Feature

    @tagOne @tagTwo
    Scenario Outline: A Scenario Outline
        Given some condition
        When something happens
        Then some action is performed

        Examples:

        | title | value | other |
        | foo   | 123   | cat   |
        | bar   | 456   | dog   |

