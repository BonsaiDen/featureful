[![Dependency Status](https://david-dm.org/bonsaiden/featureful.png?theme=shields.io)](https://david-dm.org/bonsaiden/featureful)
[![Coverage Status](https://coveralls.io/repos/BonsaiDen/featureful/badge.svg)](https://coveralls.io/r/BonsaiDen/featureful)
[![Travis CI](https://travis-ci.org/BonsaiDen/featureful.svg)](https://travis-ci.org/BonsaiDen/featureful) 

[![NPM](https://nodei.co/npm/featureful.png?downloads=true&stars=true)](https://nodei.co/npm/featureful/)

featureful
----------

Automatic verification of your test implementations against cucumber features.

**featureful** makes it easy to keep your test implementations and feature 
descriptions in sync, by providing configurable, pattern based Spec matching 
and validation.

*featureful* supports a variety of testing frameworks and does not require any 
integration with your current test runner at all. 

It achieves this by performing the following three simple steps:

1. Find **Tests** and **Features**
2. Match Tests and Features into **Specs**
3. Compare and validate the Specs, reporting any errors


### Terminology

The following terminology will be used throughout the documentation:

- __Feature__

 A *Feature* is the specification for one **Test**, in one or more actual feature files.

- __Test__

 A *Test* is the implementation of one specific **Feature** in one or more actual test files.

- __Spec__

 A Spec is the combination (matching) of exactly one **Feature** and its corresponding **Test**.

- __Matching__

 *Matching* is the process of parsing both actual feature and test files and using one of the available matching algorithms to assign them to their corresponding **Spec**.

> Note: A explained above, a Spec can actually consist of multiple Feature and Tests files, as long as the all reference (match) to the same exact Feature.


## Command Line API

**featureful** provides a generic binary for use in all environments.

It can be installed by running:

```
npm -g install featureful
```


### Validator

The binary can be used to verify tests against features by pointing it to a 
valid node module that exports a featureful options object.

```
$ featureful test/config.js
```


### Reporter

In order to enhance a existing Junit compatible XML test report with meta information
from both Test and Feature files, pass its path as the second argument after 
the configuration file.

```
$ featureful test/config.js test/report/junit.xml
```


### Feature File Parser

The binary can also be used for parsing `.feature` files into a JSON based AST 
which can be used for custom tooling needs.

```
$ featureful features/**/*.feature
```


### AST Structure

__Files__

```
[{
    "type": "File"
    "filename": "/test/parser/ast/features/valid/a.feature",
    "features": Features

}, ...]
```

__Features__

```
[{
    "type": "Feature",
    "tags": [
        "tagOne",
        "tagTwo"
    ],
    "title": "A Feature",
    "description": "A\ndescription\nof\nthe \nfeature.",
    "location": {
        "filename": "/test/parser/ast/features/valid/a.feature",
        "line": 2,
        "col": 0
    },
    "scenarios": Scenarios
    
}, ...]
```

__Scenarios__

```
[{
    "type": "Scenario",
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
    "steps": Steps,
    "examples": Examples

}, ...]
```

__Steps__

```
[{
    "type": "Given|When|Then",
    "title": "Given|When|THen something happens",
    "argument": Argument
    "location": {
        "filename": "/test/parser/ast/features/valid/a.feature",
        "line": 13,
        "col": 8
    }
}]
```

__Examples__


__Arguments__


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

        > This can be either one of the builtin methods:
        > 
        > * `title` *(the default)*: Will match Features and Tests based on their titles.
        > 
        >   This allows for multiple files per feature / test, but will **not** be able to nicely report typos in Feature / Test titles.
        > 
        > * `path`: Will use the glob patterns defined for tests and features to match up the files.
        > 
        >   For example the patterns `feature/**/*.feature` and `test/**/*.test.js` would expect the file `feature/foo/bar/a.feature` to have its test implemented in `test/foo/bar/a.test.js` and the other way around.
     
        >   This does **not** support multiple files per feature / test, but can report typos in Feature / Test titles and requires little setup except for the initial directory structure.
     
        > * `tag`: Will match Features and Tests based on their Tag annotations.

        > Or a custom function in the form of `String: matcher(Test/Feature, PathDescriptor, Options)`, please refer to `/test/specs/match/custom` for implementation details.
        
        - *RegExp* `pattern`: A pattern for the built-in `tag` matching method.
        
        An example would be`/^spec\-(\d+)/`, where the capure group should be the unique identifier for the **Spec**.

   - *Object* `ignores`: Configuration on how to ignore **Features**, **Tests** and **Scenarios** 

        - *String|Function* `method`: The method to use for ignoring

        > This can be either one of the builtin methods:

        > * `tag`: Will ignores Features and Tests based on their Tag annotations.

        > Or a custom function in the form of `String: matcher(Test/Feature/Scenario, PathDescriptor, Options)`, please refer to `/test/specs/ignore/custom` for implementation details.

        - *RegExp* `pattern`: A pattern for the built-in `tag` matching method.

        An example would be`/^(ignore|hide)$/` will ignore everything which has either a `ignore` or `hide` tag.

- *Object* `reporter`: Configurations for XML report rewriting

    If this property is present **NO** validation will be performed, instead
    Tests and Features will be parsed and the specified XML file will be 
    rewritten with the previously retrieved tag information.

    - *String* `path`: Path to the Junit compatible XML report of a test run.


### Example of a featureful options object

```javascript
{

    features: {
        // Match all feature files under this glob pattern
        pattern: 'features/**/*.feature'
    },

    tests: {

        // Match all feature files under this glob pattern
        pattern: 'tests/**/*.test.js',

        // Tests are written in BDD style using Mocha
        framework: 'mocha'
    },
    
    specs: {
        // We want our Features and Tests to be combined 
        // into Specs based on their paths
        matching: 'path'
    },

    reporter: {
        // If present, this will perform no validation but instead will parse
        // features and tests and update the specified junit.xml report
        // with meta information
        path: '/tests/junit.xml'
    }

}
```


## Licensed under MIT

Copyright (c) 2015 Ivo Wetzel.

```
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
```
