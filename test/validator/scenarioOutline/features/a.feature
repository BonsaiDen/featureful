Feature: A Feature

    Scenario Outline: A Scenario <title>

        Given something <title>
            And some other <title>

        When <value> 
            And another <value>

        Then <action>
            And another <action>

        Examples:
            | title | value | action |
            | Foo   | 123   | Yes    |
            | Bar   | 456   | No     |

