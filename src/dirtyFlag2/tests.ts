QUnit.test("hello test", function (assert) {
    assert.ok(1 == 1, "Passed!");
});

QUnit.test("Simple extend test", function (assert) {
    var name: KnockoutObservable<string>;
    name = ko.observable("Joe Smith").extend({ dirtyFlag: "" });

    assert.ok(name["isDirty"]() === false, "Initialised as clean");

    name("John");
    assert.ok(name["isDirty"]() === true, "Updated Now Dirty");
    name["reset"]();
    assert.ok(name["isDirty"]() === false, "Reset OK");
    assert.ok(name() === "John", "Value Unchanged OK");
    name("Mark");
    assert.ok(name["isDirty"]() === true, "Updated again Now Dirty");
});
/*
QUnit.test("Extend With Key, but no dirtyFlag2 instance", function (assert) {
    var name: KnockoutObservable<string>;
    assert.throws(function() {
        var name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "name" } });
    },
    "Exception thrown if extending with key that does not have matching dirtyFlag2");
});
*/
QUnit.test("Extend With empty Key", function (assert) {
    var name: KnockoutObservable<string>;
    assert.throws(function () {
            var name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "" } });
        },

        "Exception thrown if extending with empty key"
    );
});