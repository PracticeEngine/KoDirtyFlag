# KoDirtyFlag
Knockout.js DirtyFlag 

## Basic Usage
To use this dirtyFlag implementation, do the following:

Simplest mode: in your ViewModel use the extender to track dirty on an observable:
```js
var vm = function() {
  this.name = ko.observable("").extend({dirtyFlag:{}});
  return this;
};
```

Then in your HTML:
```html
  <div class="form-group" data-bind="css:{'has-error':firstname.isDirty}">
     <label>First name:</label>
    <input data-bind="value:firstname" />
  </div>
```

The extender adds the isDirty property to your property. This will add the ```has-error``` class to the form-group when the field is dirty.

## Advanced Usage
Advanced mode: Just as before, but instead of initializing dirtyFlag with an empty string, provide a ```key``` property in the options.  The ```key``` property works by convention, allowing you to organize a hierarchy of items that are tracked, and can be presented in a logical way to match your the visualization of your page.
```js
var vm = function() {
  this.pageDirty = new dirtyFlag2("PAGE");
  this.contactDirty = new dirtyFlag2("PAGE:CONTACT");
  this.firstName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:FIRST"}});
  this.lastName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:LAST"}});
  return this;
};
```

Then in your HTML:
```html
<button type="button" data-bind="enabled:pageDirty.isDirty()">Save your Changes</button>
<span class="text-danger" data-bind="visible:contactDirty.isDirty()">You must enter a full name!</span>
<div class="form-group" data-bind="css:{'has-error':firstname.isDirty}">
    <label>First name:</label>
    <input data-bind="value:firstname" />
</div>
<div class="form-group" data-bind="css:{'has-error':lastname.isDirty}">
    <label>Last name:</label>
    <input data-bind="value:lastname" />
</div>
```

The extenders map to the dirtyFlags which have the same starting key values.  So PAGE is monitoring all values that begin with PAGE, and PAGE:CONTACT only monitors the items that begin under that.  This provides the ability to highlight any logical group of changes within the page.

## Resetting
To reset the dirty state of your page, just call ```reset();``` on any ```dirtyFlag2``` implementation.  It will immediately set the state to clean of all items extended which begin with the key.
```js
var vm = function() {
  this.pageDirty = new dirtyFlag2("PAGE");
  this.contactDirty = new dirtyFlag2("PAGE:CONTACT");
  ...
  this.pageDirty.reset();
  ...
};
```

## Advanced Resetting
In advanced scenarios, you can reset individual fields as well.  This can be done by calling reset and providing the key of the field you'd like to reset.
```js
var vm = function() {
  this.pageDirty = new dirtyFlag2("PAGE");
  this.contactDirty = new dirtyFlag2("PAGE:CONTACT");
  this.firstName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:FIRST"}});
  this.lastName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:LAST"}});
  ...
  this.contactDirty.reset("PAGE:CONTACT:LAST");
  ...
};
```

## Non-Clean Resetting
Another advanced scanrio that is supported, you can reset the value to a new clean Value, that is not necessarily the current value.  This requires that you pass the new clean value as the second parameter to the reset function.
```js
var vm = function() {
  this.pageDirty = new dirtyFlag2("PAGE");
  this.contactDirty = new dirtyFlag2("PAGE:CONTACT");
  this.firstName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:FIRST"}});
  this.lastName = ko.observable("").extend({dirtyFlag:{key:"PAGE:CONTACT:LAST"}});
  ...
  this.contactDirty.reset("PAGE:CONTACT:LAST", "Smith");
  ...
};
```
