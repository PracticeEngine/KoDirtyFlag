import { dirtyFlag2 } from "./dirtyFlag2.js";
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
    name("John");
    assert.ok(name["isDirty"]() === false, "Original value re-entered Now Clean");
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
    name("John");
    assert.ok(name["isDirty"]() === false, "Original value re-entered Now Clean");
    df.dispose();
});
QUnit.test("Extend With Key, existing dirtyFlag2 instance, test dirtyFlag2 functionality", function (assert) {
    var name;
    var address;
    var df = new dirtyFlag2("Tests1");
    name = ko.observable("Joe Smith").extend({ dirtyFlag: { key: "Tests1.name" } });
    address = ko.observable("1 High Street").extend({ dirtyFlag: { key: "Tests1.address" } });
    assert.ok(name["isDirty"]() === false, "Initialised as clean");
    name("John");
    assert.ok(df.isDirty() === true, "Updated Now Dirty");
    df.reset();
    assert.ok(df.isDirty() === false, "Reset OK");
    assert.ok(name() === "John", "Value Unchanged OK");
    name("Mark");
    assert.ok(df.isDirty() === true, "Updated again Now Dirty");
    name("John");
    assert.ok(df.isDirty() === false, "Original value re-entered Now Clean");
    name("Mark");
    assert.ok(df.isDirty() === true, "Updated again Now Dirty");
    df.reset("Tests1.address");
    assert.ok(df.isDirty() === true, "Reset another, still Dirty");
    df.reset("Tests1.name", "Paul");
    assert.ok(df.isDirty() === true, "Reset OK");
    assert.ok(name() === "Paul", "Value Changed OK");
    assert.throws(function () {
        df.reset("another");
    }, "Throws if resetting unknown root key");
    assert.throws(function () {
        df.reset("Tests.another");
    }, "Throws if resetting unknown leaf key");
    df.dispose();
    assert.throws(function () {
        df.dispose();
    }, "Throws if double disposal");
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
    names["reset"]();
    assert.ok(names["isDirty"]() === false, "Reset OK");
    //assert.ok(name() === "John", "Value Unchanged OK");
    names(["Joe Smith"]);
    assert.ok(names["isDirty"]() === true, "Updated again Now Dirty");
    names.push("John");
    assert.ok(names["isDirty"]() === false, "Array updated to match previously clean content, now clean.");
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxDQUFDO0lBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUUsNkRBQTZELENBQUMsQ0FBQztBQUMzRyxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRpcnR5RmxhZzIgfSBmcm9tIFwiLi9kaXJ0eUZsYWcyLmpzXCI7XHJcblxyXG5RVW5pdC50ZXN0KFwiU2ltcGxlIGV4dGVuZCB0ZXN0XCIsIGZ1bmN0aW9uIChhc3NlcnQpIHtcclxuICAgIHZhciBuYW1lOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPjtcclxuICAgIG5hbWUgPSBrby5vYnNlcnZhYmxlKFwiSm9lIFNtaXRoXCIpLmV4dGVuZCh7IGRpcnR5RmxhZzoge30gfSk7XHJcblxyXG4gICAgYXNzZXJ0Lm9rKG5hbWVbXCJpc0RpcnR5XCJdKCkgPT09IGZhbHNlLCBcIkluaXRpYWxpc2VkIGFzIGNsZWFuXCIpO1xyXG5cclxuICAgIG5hbWUoXCJKb2huXCIpO1xyXG4gICAgYXNzZXJ0Lm9rKG5hbWVbXCJpc0RpcnR5XCJdKCkgPT09IHRydWUsIFwiVXBkYXRlZCBOb3cgRGlydHlcIik7XHJcbiAgICBuYW1lW1wicmVzZXRcIl0oKTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJSZXNldCBPS1wiKTtcclxuICAgIGFzc2VydC5vayhuYW1lKCkgPT09IFwiSm9oblwiLCBcIlZhbHVlIFVuY2hhbmdlZCBPS1wiKTtcclxuICAgIG5hbWUoXCJNYXJrXCIpO1xyXG4gICAgYXNzZXJ0Lm9rKG5hbWVbXCJpc0RpcnR5XCJdKCkgPT09IHRydWUsIFwiVXBkYXRlZCBhZ2FpbiBOb3cgRGlydHlcIik7XHJcbiAgICBuYW1lKFwiSm9oblwiKTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJPcmlnaW5hbCB2YWx1ZSByZS1lbnRlcmVkIE5vdyBDbGVhblwiKTtcclxufSk7XHJcblxyXG5RVW5pdC50ZXN0KFwiU2ltcGxlIGV4dGVuZCB3aXRoIG9iamVjdFwiLCBmdW5jdGlvbiAoYXNzZXJ0KSB7XHJcbiAgICB2YXIgbmFtZTogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD47XHJcbiAgICBhc3NlcnQudGhyb3dzKFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IGtvLm9ic2VydmFibGUoe30pLmV4dGVuZCh7IGRpcnR5RmxhZzoge30gfSk7XHJcbiAgICAgICAgfSwgXCJFeGNlcHRpb24gZXh0ZW5kaW5nIG9iamVjdCBvYnNlcnZhYmxlXCJcclxuICAgICk7XHJcbn0pO1xyXG5RVW5pdC50ZXN0KFwiRXh0ZW5kIFdpdGggZW1wdHkgS2V5XCIsIGZ1bmN0aW9uIChhc3NlcnQpIHtcclxuICAgIHZhciBuYW1lOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPjtcclxuICAgIGFzc2VydC50aHJvd3MoXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtvLm9ic2VydmFibGUoXCJKb2UgU21pdGhcIikuZXh0ZW5kKHsgZGlydHlGbGFnOiB7IGtleTogXCJcIiB9IH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJFeGNlcHRpb24gdGhyb3duIGlmIGV4dGVuZGluZyB3aXRoIGVtcHR5IGtleVwiXHJcbiAgICApO1xyXG59KTtcclxuXHJcblFVbml0LnRlc3QoXCJFeHRlbmQgV2l0aCBLZXksIGJ1dCBubyBkaXJ0eUZsYWcyIGluc3RhbmNlXCIsIGZ1bmN0aW9uIChhc3NlcnQpIHtcclxuICAgIHZhciBuYW1lOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPjtcclxuICAgIGFzc2VydC50aHJvd3MoXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtvLm9ic2VydmFibGUoXCJKb2UgU21pdGhcIikuZXh0ZW5kKHsgZGlydHlGbGFnOiB7IGtleTogXCJUZXN0czEubmFtZVwiIH0gfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkV4Y2VwdGlvbiB0aHJvd24gaWYgZXh0ZW5kaW5nIHdpdGgga2V5IHRoYXQgZG9lcyBub3QgaGF2ZSBtYXRjaGluZyBkaXJ0eUZsYWcyXCJcclxuICAgICk7XHJcbn0pO1xyXG5cclxuUVVuaXQudGVzdChcIkV4dGVuZCBXaXRoIEtleSwgZXhpc3RpbmcgZGlydHlGbGFnMiBpbnN0YW5jZSwgdGVzdCBzaW1wbGUgZnVuY3Rpb25hbGl0eVwiLCBmdW5jdGlvbiAoYXNzZXJ0KSB7XHJcbiAgICB2YXIgbmFtZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgICB2YXIgZGYgPSBuZXcgZGlydHlGbGFnMihcIlRlc3RzXCIpO1xyXG4gICAgbmFtZSA9IGtvLm9ic2VydmFibGUoXCJKb2UgU21pdGhcIikuZXh0ZW5kKHsgZGlydHlGbGFnOiB7IGtleTogXCJUZXN0cy5uYW1lXCIgfSB9KTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJJbml0aWFsaXNlZCBhcyBjbGVhblwiKTtcclxuXHJcbiAgICBuYW1lKFwiSm9oblwiKTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSB0cnVlLCBcIlVwZGF0ZWQgTm93IERpcnR5XCIpO1xyXG4gICAgbmFtZVtcInJlc2V0XCJdKCk7XHJcbiAgICBhc3NlcnQub2sobmFtZVtcImlzRGlydHlcIl0oKSA9PT0gZmFsc2UsIFwiUmVzZXQgT0tcIik7XHJcbiAgICBhc3NlcnQub2sobmFtZSgpID09PSBcIkpvaG5cIiwgXCJWYWx1ZSBVbmNoYW5nZWQgT0tcIik7XHJcbiAgICBuYW1lKFwiTWFya1wiKTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSB0cnVlLCBcIlVwZGF0ZWQgYWdhaW4gTm93IERpcnR5XCIpO1xyXG4gICAgbmFtZShcIkpvaG5cIik7XHJcbiAgICBhc3NlcnQub2sobmFtZVtcImlzRGlydHlcIl0oKSA9PT0gZmFsc2UsIFwiT3JpZ2luYWwgdmFsdWUgcmUtZW50ZXJlZCBOb3cgQ2xlYW5cIik7XHJcbiAgICBkZi5kaXNwb3NlKCk7XHJcbn0pO1xyXG5cclxuUVVuaXQudGVzdChcIkV4dGVuZCBXaXRoIEtleSwgZXhpc3RpbmcgZGlydHlGbGFnMiBpbnN0YW5jZSwgdGVzdCBkaXJ0eUZsYWcyIGZ1bmN0aW9uYWxpdHlcIiwgZnVuY3Rpb24gKGFzc2VydCkge1xyXG4gICAgdmFyIG5hbWU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gICAgdmFyIGFkZHJlc3M6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gICAgdmFyIGRmID0gbmV3IGRpcnR5RmxhZzIoXCJUZXN0czFcIik7XHJcbiAgICBuYW1lID0ga28ub2JzZXJ2YWJsZShcIkpvZSBTbWl0aFwiKS5leHRlbmQoeyBkaXJ0eUZsYWc6IHsga2V5OiBcIlRlc3RzMS5uYW1lXCIgfSB9KTtcclxuICAgIGFkZHJlc3MgPSBrby5vYnNlcnZhYmxlKFwiMSBIaWdoIFN0cmVldFwiKS5leHRlbmQoeyBkaXJ0eUZsYWc6IHsga2V5OiBcIlRlc3RzMS5hZGRyZXNzXCIgfSB9KTtcclxuICAgIGFzc2VydC5vayhuYW1lW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJJbml0aWFsaXNlZCBhcyBjbGVhblwiKTtcclxuXHJcbiAgICBuYW1lKFwiSm9oblwiKTtcclxuICAgIGFzc2VydC5vayhkZi5pc0RpcnR5KCkgPT09IHRydWUsIFwiVXBkYXRlZCBOb3cgRGlydHlcIik7XHJcbiAgICBkZi5yZXNldCgpO1xyXG4gICAgYXNzZXJ0Lm9rKGRmLmlzRGlydHkoKSA9PT0gZmFsc2UsIFwiUmVzZXQgT0tcIik7XHJcbiAgICBhc3NlcnQub2sobmFtZSgpID09PSBcIkpvaG5cIiwgXCJWYWx1ZSBVbmNoYW5nZWQgT0tcIik7XHJcbiAgICBuYW1lKFwiTWFya1wiKTtcclxuICAgIGFzc2VydC5vayhkZi5pc0RpcnR5KCkgPT09IHRydWUsIFwiVXBkYXRlZCBhZ2FpbiBOb3cgRGlydHlcIik7XHJcbiAgICBuYW1lKFwiSm9oblwiKTtcclxuICAgIGFzc2VydC5vayhkZi5pc0RpcnR5KCkgPT09IGZhbHNlLCBcIk9yaWdpbmFsIHZhbHVlIHJlLWVudGVyZWQgTm93IENsZWFuXCIpO1xyXG4gICAgbmFtZShcIk1hcmtcIik7XHJcbiAgICBhc3NlcnQub2soZGYuaXNEaXJ0eSgpID09PSB0cnVlLCBcIlVwZGF0ZWQgYWdhaW4gTm93IERpcnR5XCIpO1xyXG4gICAgZGYucmVzZXQoXCJUZXN0czEuYWRkcmVzc1wiKTtcclxuICAgIGFzc2VydC5vayhkZi5pc0RpcnR5KCkgPT09IHRydWUsIFwiUmVzZXQgYW5vdGhlciwgc3RpbGwgRGlydHlcIik7XHJcbiAgICBkZi5yZXNldChcIlRlc3RzMS5uYW1lXCIsIFwiUGF1bFwiKTtcclxuICAgIGFzc2VydC5vayhkZi5pc0RpcnR5KCkgPT09IHRydWUsIFwiUmVzZXQgT0tcIik7XHJcbiAgICBhc3NlcnQub2sobmFtZSgpID09PSBcIlBhdWxcIiwgXCJWYWx1ZSBDaGFuZ2VkIE9LXCIpO1xyXG4gICAgYXNzZXJ0LnRocm93cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGYucmVzZXQoXCJhbm90aGVyXCIpO1xyXG4gICAgfSwgXCJUaHJvd3MgaWYgcmVzZXR0aW5nIHVua25vd24gcm9vdCBrZXlcIik7XHJcbiAgICBhc3NlcnQudGhyb3dzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkZi5yZXNldChcIlRlc3RzLmFub3RoZXJcIik7XHJcbiAgICB9LCBcIlRocm93cyBpZiByZXNldHRpbmcgdW5rbm93biBsZWFmIGtleVwiKTtcclxuICAgIGRmLmRpc3Bvc2UoKTtcclxuXHJcbiAgICBhc3NlcnQudGhyb3dzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkZi5kaXNwb3NlKCk7XHJcbiAgICB9LCBcIlRocm93cyBpZiBkb3VibGUgZGlzcG9zYWxcIik7XHJcbn0pO1xyXG5cclxuUVVuaXQudGVzdChcIkV4dGVuZCBXaXRoIEtleSwgZXhpc3RpbmcgZGlydHlGbGFnMiBpbnN0YW5jZSwgZHVwbGljYXRlIGtleVwiLCBmdW5jdGlvbiAoYXNzZXJ0KSB7XHJcbiAgICB2YXIgbmFtZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgICB2YXIgZGYgPSBuZXcgZGlydHlGbGFnMihcIlRlc3RzMlwiKTtcclxuICAgIG5hbWUgPSBrby5vYnNlcnZhYmxlKFwiSm9lIFNtaXRoXCIpLmV4dGVuZCh7IGRpcnR5RmxhZzogeyBrZXk6IFwiVGVzdHMyLm5hbWVcIiB9IH0pO1xyXG4gICAgYXNzZXJ0LnRocm93cyhcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lMiA9IGtvLm9ic2VydmFibGUoXCJKb2UgU21pdGhcIikuZXh0ZW5kKHsgZGlydHlGbGFnOiB7IGtleTogXCJUZXN0czIubmFtZVwiIH0gfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInRyeWluZyB0byByZS1yZWdpc3RlciBrZXlcIlxyXG4gICAgKTtcclxuICAgIGRmLmRpc3Bvc2UoKTtcclxufSk7XHJcblxyXG4vLy9BcnJheSBvYnNlcnZhYmxlIHRlc3RzXHJcblxyXG5RVW5pdC50ZXN0KFwiU2ltcGxlIGFycmF5IGV4dGVuZCB0ZXN0XCIsIGZ1bmN0aW9uIChhc3NlcnQpIHtcclxuICAgIHZhciBuYW1lczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8c3RyaW5nPjtcclxuICAgIG5hbWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtcIkpvZSBTbWl0aFwiXSkuZXh0ZW5kKHsgZGlydHlGbGFnOiB7fSB9KTtcclxuXHJcbiAgICBhc3NlcnQub2sobmFtZXNbXCJpc0RpcnR5XCJdKCkgPT09IGZhbHNlLCBcIkluaXRpYWxpc2VkIGFzIGNsZWFuXCIpO1xyXG5cclxuICAgIG5hbWVzLnB1c2goXCJKb2huXCIpO1xyXG4gICAgYXNzZXJ0Lm9rKG5hbWVzW1wiaXNEaXJ0eVwiXSgpID09PSB0cnVlLCBcIlVwZGF0ZWQgTm93IERpcnR5XCIpO1xyXG4gICAgbmFtZXNbXCJyZXNldFwiXSgpO1xyXG4gICAgYXNzZXJ0Lm9rKG5hbWVzW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJSZXNldCBPS1wiKTtcclxuICAgIC8vYXNzZXJ0Lm9rKG5hbWUoKSA9PT0gXCJKb2huXCIsIFwiVmFsdWUgVW5jaGFuZ2VkIE9LXCIpO1xyXG4gICAgbmFtZXMoW1wiSm9lIFNtaXRoXCJdKTtcclxuICAgIGFzc2VydC5vayhuYW1lc1tcImlzRGlydHlcIl0oKSA9PT0gdHJ1ZSwgXCJVcGRhdGVkIGFnYWluIE5vdyBEaXJ0eVwiKTtcclxuICAgIG5hbWVzLnB1c2goXCJKb2huXCIpO1xyXG4gICAgYXNzZXJ0Lm9rKG5hbWVzW1wiaXNEaXJ0eVwiXSgpID09PSBmYWxzZSwgXCJBcnJheSB1cGRhdGVkIHRvIG1hdGNoIHByZXZpb3VzbHkgY2xlYW4gY29udGVudCwgbm93IGNsZWFuLlwiKTtcclxufSk7XHJcbiJdfQ==
