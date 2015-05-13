Feature: Basic

    Scenario Outline: Handling the weather
        Given <weather> weather
        When <something> 
        Then <action>

        Examples:
            | weather | something      | action        |
            |  sunny  | the sun shines | enjoy the day |
            |  rainy  | it rains       | take cover    |

