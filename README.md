featureful
----------

Automatically verify your tests implementations against cucumber feature specs.


## Grunt Task

If you are already using Node.js *featureful* is available as a grunt task:

```javascript
grunt.initConfig({

    featured: {

        ui: {
            options: {

                features: {
                    pattern: process.cwd() + '/feature/**/*.feature'
                },

                tests: {
                    pattern: process.cwd() + '/test/**/*.test.js',
                    prefix: '###' 
                },

                framework: 'mocha'

            }
        }

    }

});

grunt.loadNpmTasks('featureful');
```


## Command Line Feature File Parser

For users of all other languages there is also a command line utility also 
called `featureful`, installable via `npm install -g featureful`.

You can either use it to verify tests against features by pointing it to a 
valid node module that exports the same options as defined in the grunt task

```
$ featureful config.js
```

```javascript
// config.js
module.exports = {

    features: {
        ...
    },

    tests: {
        ...
    },

    framework: ...

};
```

You can also use it for parsing `.feature` files into a JSON based AST which can
be used for further tooling (e.g. automatic TestRail integration of your features.)

```
$ featureful features/**/*.feature
[
  {
    "type": "FILE",
    "filename": "features/do/some/thing.feature",
    "features": [
      {
        "type": "FEATURE",
        "tags": [],
        "title": "Thing",
        "description": "Does stuff",
        "location": {
          "filename": "features/do/some/thing.feature",
          "line": 1,
          "col": 0
        },
        "scenarios": [
          {
            "type": "SCENARIO",
            "tags": [],
            "title": "Foo",
            "location": {
              "filename": "features/do/some/thing.feature",
              "line": 6,
              "col": 4
            },
            "given": [
              {
                "type": "GIVEN",
                "title": "Stuff",
                "location": {
                  "filename": "features/do/some/thing.feature",
                  "line": 7,
                  "col": 8
                }
              }
            ],
            "when": [
              {
                "type": "WHEN",
                "title": "Kittens",
                "location": {
                  "filename": "features/do/some/thing.feature",
                  "line": 11,
                  "col": 8
                }
              }
            ],
            "then": [
              {
                "type": "THEN",
                "title": "Awesome",
                "location": {
                  "filename": "features/do/some/thing.feature",
                  "line": 13,
                  "col": 8
                }
              }
            ],
            "examples": null
          }
        ]
      }
    ]
  }
]
```


## TODO

- Index Comparisons 
- Keyword specifications for languages other than English and German
- Support for other Frameworks and Languages

    - JUnit
    - OCUnit


## Licensed under MIT

Copyright (c) 2015 Ivo Wetzel.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

