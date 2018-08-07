QUnit.test("Simple extend test", function (assert) {
    var name;
    name = ko.observable("Joe Smith").extend({ dirtyFlag: {} });
    assert.ok(name["isDirty"]() === false, "Initialised as clean");
    name("John");
    assert.ok(name["isDirty"]() === true, "Updated Now Dirty");
    name["reset"]();
    assert.ok(name["isDirty"]() === false, "Reset OK");
    assert.ok(name() === "John", "Value Unchanged OK");
    name("Mark");
    assert.ok(name["isDirty"]() === true, "Updated again Now Dirty");
});
QUnit.test("Simple extend with object", function (assert) {
    var name;
    assert.throws(function () {
        name = ko.observable({}).extend({ dirtyFlag: {} });
    }, "Exception extending object observable");
});
QUnit.test("Extend With empty Key", function (assert) {
    var name;
    assert.throws(function () {
        var name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "" } });
    }, "Exception thrown if extending with empty key");
});
QUnit.test("Extend With Key, but no dirtyFlag2 instance", function (assert) {
    var name;
    assert.throws(function () {
        var name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "Tests1.name" } });
    }, "Exception thrown if extending with key that does not have matching dirtyFlag2");
});
QUnit.test("Extend With Key, existing dirtyFlag2 instance, test simple functionality", function (assert) {
    var name;
    var df = new dirtyFlag2("Tests");
    name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "Tests.name" } });
    assert.ok(name["isDirty"]() === false, "Initialised as clean");
    name("John");
    assert.ok(name["isDirty"]() === true, "Updated Now Dirty");
    name["reset"]();
    assert.ok(name["isDirty"]() === false, "Reset OK");
    assert.ok(name() === "John", "Value Unchanged OK");
    name("Mark");
    assert.ok(name["isDirty"]() === true, "Updated again Now Dirty");
    df.dispose();
});
QUnit.test("Extend With Key, existing dirtyFlag2 instance, duplicate key", function (assert) {
    var name;
    var df = new dirtyFlag2("Tests2");
    name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "Tests2.name" } });
    assert.throws(function () {
        var name2 = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "Tests2.name" } });
    }, "trying to re-register key");
    df.dispose();
});
///Array observable tests
QUnit.test("Simple array extend test", function (assert) {
    var names;
    names = ko.observableArray(["Joe Smith"]).extend({ dirtyFlag: {} });
    assert.ok(names["isDirty"]() === false, "Initialised as clean");
    names.push("John");
    assert.ok(names["isDirty"]() === true, "Updated Now Dirty");
    name["reset"]();
    assert.ok(names["isDirty"]() === false, "Reset OK");
    //assert.ok(name() === "John", "Value Unchanged OK");
    names(["Mark"]);
    assert.ok(name["isDirty"]() === true, "Updated again Now Dirty");
});
//# sourceMappingURL=tests.js.map