var dirtyKeyRoots = [];
var dirtyReg = ko.observableArray([]);
var dirtyFlag2 = /** @class */ (function () {
    function dirtyFlag2(key) {
        if (key.length < 1)
            throw "Key must have at least one character e.g. VM or VM.TAB1";
        this.key = key;
        dirtyKeyRoots.push(key);
        this.isDirty = ko.pureComputed(function () {
            var firstDirty = ko.utils.arrayFirst(dirtyReg(), function (reg) {
                return reg.key.indexOf(this.key) === 0 && reg.obs.isDirty();
            }, this);
            if (firstDirty) {
                return true;
            }
            return false;
        }, this);
    }
    /**
     * Resets all values tracked by the dirtyflag
     * @param key If Provided resets only the value that matches exactly
     * @param cleanValue If Provided sets the clean value
     */
    dirtyFlag2.prototype.reset = function (key, cleanValue) {
        if (key) {
            ko.utils.arrayFirst(dirtyReg(), function (reg) {
                return reg.key.localeCompare(key) === 0;
            }).obs.reset(cleanValue);
        }
        else {
            key = this.key;
            ko.utils.arrayForEach(dirtyReg(), function (reg) {
                if (reg.key.indexOf(key) === 0) {
                    reg.obs.reset();
                }
            });
        }
    };
    dirtyFlag2.prototype.dispose = function () {
        var key = this.key;
        dirtyKeyRoots.splice(dirtyKeyRoots.indexOf(key), 1);
        ko.utils.arrayForEach(dirtyReg(), function (reg) {
            if (reg.key.indexOf(key) === 0) {
                reg.obs.unregister();
            }
        });
    };
    return dirtyFlag2;
}());
export { dirtyFlag2 };
var nonValueTypes = ["undefined", "null"];
var deepValueTypes = ["object"];
/**
 * Compares 2 Arrays looking for anything that makes them not match (per dirtyFlag Rules)
 * @param arr1
 * @param arr2
 */
function dirtyArrayCompare(arr1, arr2) {
    // Arrays of different length are never clean
    if (arr1.length !== arr2.length)
        return false;
    // Assume true
    var matches = true;
    for (var a = 0, l = arr1.length; a < l; a++) {
        // Check each member of the arry
        if (nonValueTypes.indexOf(typeof arr1[a]) >= 0 && nonValueTypes.indexOf(typeof arr2[a]) >= 0)
            matches = false;
        if (deepValueTypes.indexOf(typeof arr1[a]) >= 0 || deepValueTypes.indexOf(typeof arr2[a]) >= 0)
            throw "Objects cannot be used in dirtyFlag";
        if (arr1[a] !== arr2[a])
            matches = false;
        // If anything is false, stop checking rest of array
        if (!matches)
            break;
    }
    // Return Array Compare Result
    return matches;
}
ko.extenders['dirtyFlag'] = function (obs, options) {
    var reg;
    if (Array.isArray(obs())) {
        obs['clean'] = ko.observableArray(obs().slice());
    }
    else {
        if (deepValueTypes.indexOf(typeof obs()) >= 0)
            throw "Objects cannot be used in dirtyFlag";
        obs['clean'] = ko.observable(obs());
    }
    obs['isDirty'] = ko.pureComputed(function () {
        if (nonValueTypes.indexOf(typeof obs()) >= 0 && nonValueTypes.indexOf(typeof obs['clean']()) >= 0)
            return false;
        if (Array.isArray(obs()) && Array.isArray(obs['clean']())) {
            return !dirtyArrayCompare(obs(), obs['clean']());
        }
        if (deepValueTypes.indexOf(typeof obs()) >= 0 || deepValueTypes.indexOf(typeof obs['clean']()) >= 0)
            throw "Objects cannot be used in dirtyFlag";
        return obs() !== obs['clean']();
    });
    obs['reset'] = function (cleanValue) {
        var newClean = typeof cleanValue != "undefined" ? cleanValue : obs();
        obs['clean'](Array.isArray(newClean) ? newClean.slice() : newClean);
    };
    obs['unregister'] = function () {
        if (reg) {
            dirtyReg.remove(reg);
        }
    };
    if (options && typeof options.key === "string") {
        if (options.key.length < 1)
            throw "Key must have at least one character e.g. VM.FIELD1 or VM.TAB1.FIELD1";
        var rootMatch = ko.utils.arrayFirst(dirtyKeyRoots, function (keyRoot) {
            return options.key.indexOf(keyRoot) >= 0;
        });
        if (!rootMatch)
            throw "There is no DirtyFlag tracking at a root of the key '" + options.key + "'";
        var match = ko.utils.arrayFirst(dirtyReg(), function (item) {
            return item.key === options.key;
        });
        if (match)
            throw "Another item with dirtyFlag key of '" + options.key + "' is already being tracked.";
        reg = { key: options.key, obs: obs };
        dirtyReg.push(reg);
    }
    return obs;
};
//# sourceMappingURL=dirtyFlag2.js.map