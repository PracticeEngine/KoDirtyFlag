var dirtyReg = ko.observableArray([]);
var dirtyFlag2 = /** @class */ (function () {
    function dirtyFlag2(key) {
        if (key.length < 1)
            throw "Key must have at least one character e.g. VM or VM.TAB1";
        this.key = key;
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
    return dirtyFlag2;
}());
var nonValueTypes = ["undefined", "null"];
var deepValueTypes = ["object"];
ko.extenders['dirtyFlag'] = function (obs, options) {
    obs['clean'] = ko.observable(obs());
    obs['isDirty'] = ko.pureComputed(function () {
        if (nonValueTypes.indexOf(typeof obs()) >= 0 && nonValueTypes.indexOf(typeof obs['clean']()) >= 0)
            return false;
        if (deepValueTypes.indexOf(typeof obs()) >= 0 || deepValueTypes.indexOf(typeof obs['clean']()) >= 0)
            throw "Objects cannot be used in dirtyFlag";
        return obs() !== obs['clean']();
    });
    obs['reset'] = function (cleanValue) {
        obs['clean'](typeof cleanValue != "undefined" ? cleanValue : obs());
    };
    if (options && options.key) {
        if (options.key.length < 1)
            throw "Key must have at least one character e.g. VM.FIELD1 or VM.TAB1.FIELD1";
        var match = ko.utils.arrayFirst(dirtyReg(), function (item) {
            return item.key === options.key;
        });
        if (match)
            throw "Another item with dirtyFlag key of '" + options.key + "' is already being tracked.";
        dirtyReg.push({ key: options.key, obs: obs });
    }
    return obs;
};
//# sourceMappingURL=dirtyFlag2.js.map