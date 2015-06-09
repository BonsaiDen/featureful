featureful
----------

Automatically verify your tests implementations against cucumber feature specs.


## Terminology

- __Feature__

 A *Feature* is the specification for one **Test**, in one or more actual feature files.

- __Test__

 A *Test* is the implementation of one specific **Feature** in one or more actual test files.

- __Spec__

 A Spec is the combination (matching) of exactly one **Feature** and its corresponding **Test**.

- __Matching__

 *Matching* is the process of parsing both actual feature and test files and using one of the available matching algorithms to assign them to their corresponding **Spec**.

> Note: A explained above, a Spec can actually consist of multiple Feature and Tests files, as long as the all reference (match) to the same exact Feature.


## Options

**featureful** provides the following options for configuration in order to match 
the needs of your environment:

- *Object* `features`: Configuration options for finding and parsing cucumber \*.feature files
    
    - *String* `pattern`: A glob pattern matching the locations of your feature files


- *Object* `tests` : Configuration options for finding and parsing your test files

    - *String* `pattern`: A glob pattern matching the locations of your strings

    - *String* `framework`: The Framework your tests use
      
      > **Built-in frameworks** 
      > 
      > We currently provide support for:
      > * `mocha`
      > * `junit` (WIP)
      > * `ocmock` (WIP)
      >
      > For examples please take a look at `/test/parser/framework`.
      
      > **Custom frameworks**
      >
      > You can also specify the path to your Node.js module that exports your custom Framework constructor.
      >
      > For details on how to implement your own framework parser, please take a look at `/lib/framework`.
      
- *Object* `specs`: Configurations for matching and ignoring specs

    - *Object* `matching`: Configuration on how to match **Features** and **Tests** up into **Specs**

        - *String|Function* `method`: The method to use for matching

         This can be either one of the builtin methods:
         
         * `title` *(the default)*: Will match Features and Tests based on their titles.
         
           This allows for multiple files per feature / test, but will **not** be able to nicely report typos in Feature / Test titles.
         
         * `path`: Will use the glob patterns defined for tests and features to match up the files.
         
           For example the patterns `feature/**/*.feature` and `test/**/*.test.js` would expect the file `feature/foo/bar/a.feature` to have its test implemented in `test/foo/bar/a.test.js` and the other way around.
     
           This does **not** support multiple files per feature / test, but can report typos in Feature / Test titles and requires little setup except for the initial directory structure.
     
         * `tag`: Will match Features and Tests based on their Tag annotations.

         Or a custom function in the form of `String: matcher(Test/Feature, PathDescriptor, Options)`, please refer to `/test/specs/match/custom` for implementation details.
        
        - *RegExp* `pattern`: A pattern for the built-in `tag` matching method.
        
        An example would be`/^spec\-(\d+)/`, where the capure group should be the unique identifier for the **Spec**.

### Example of a featureful options object

```javascript
{

    features: {
        pattern: 'features/**/*.feature'
    },

    tests: {
        pattern: 'tests/**/*.test.js',
        framework: 'mocha'
    },
    
    specs: {
        matching: 'path'
    }

}
```

## Command Line API

**featureful** provides a generic binary for use in all environments.

It can be installed by running:

`npm -g install featureful`


### Validator

The binary can be used to verify tests against features by pointing it to a 
valid node module that exports a featureful options object.

```
$ featureful test/config.js
```


### Feature File Parser

The binary can also be used for parsing `.feature` files into a JSON based AST 
which can be used for custom tooling needs.

```
$ featureful features/**/*.feature

[{
    "type": "FILE",
    "filename": "/test/parser/ast/features/valid/a.feature",
    "features": [{
        "type": "FEATURE",
        "tags": [
            "tagOne",
            "tagTwo"
        ],
        "title": "A Feature",
        "description": "A \ndescription \nof \nthe \nfeature.",
        "location": {
            "filename": "/test/parser/ast/features/valid/a.feature",
            "line": 2,
            "col": 0
        },
        "scenarios": [{
            "type": "SCENARIO",
            "tags": [
                "tagOne",
                "tagTwo"
            ],
            "title": "A Scenario",
            "location": {
                "filename": "/test/parser/ast/features/valid/a.feature",
                "line": 11,
                "col": 4
            },
            "given": [{
                "type": "GIVEN",
                "title": "Given some condition",
                "location": {
                    "filename": "/test/parser/ast/features/valid/a.feature",
                    "line": 12,
                    "col": 8
                }
            }],
            "when": [{
                "type": "WHEN",
                "title": "When something happens",
                "location": {
                    "filename": "/test/parser/ast/features/valid/a.feature",
                    "line": 13,
                    "col": 8
                }
            }],
            "then": [{
                "type": "THEN",
                "title": "Then some action is performed",
                "location": {
                    "filename": "/test/parser/ast/features/valid/a.feature",
                    "line": 14,
                    "col": 8
                }
            }],
            "examples": null
        }]
    }]
}, {
    "type": "FILE",
    "filename": "/test/parser/ast/features/valid/foo/b.feature",
    "features": [
    ]
}]
```

## Grunt Task

If you are already using Node.js *featureful* is available as a grunt task:

```javascript
grunt.initConfig({
    featureful: {
        targetName: {
            options: <featureful options object>
        }
    }
});

grunt.loadNpmTasks('featureful');
```

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


