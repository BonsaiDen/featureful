//
//  FeatureTest
//  foobar
//
//  Created by Someone
//  Copyright by Nobody
//
#import <objc/runtime.h>
#import "Feature.h"

@interface FeatureTest ()

@property(nonatomic, strong) id foo;
@property(nonatomic, strong) Something *something;

@property(nonatomic, assign) Method foobar;
@property(nonatomic, assign) Method other

@end

// ### A Feature
@implementation FeatureTest

/*
 * A 
 * Feature 
 * Description.
 */

#pragma mark - Testing

- (void) helperMethodOne {

}

// ### A Scenario @foo @bar
- (void) test_something {

    // Setup
    Dependency *dep = [self.something bar:@(0)];
    NSDictionary *params = @{ MY_STATIC_VALUE : @(2) };

    // ### Given some condition
    expect(dep.value).to.equal(1234);

    // ### And given another condition
    // No Expression

    // ### When something is done
    expect(dep.value).to.equal(1234e1);

    // ### And when some other thing is done
    // No Expression

    // ### Then something happens
    expect(dep.value).to.equal("Test");

    // ### And then some other thing happens
    // No Expression
    
}

- (void) helperMethodTwo {

    - (void) test_invalid {
    }

}

/**
 * A doc comment
 */
- (void) test_empty {
    // Some comment
}

@end

