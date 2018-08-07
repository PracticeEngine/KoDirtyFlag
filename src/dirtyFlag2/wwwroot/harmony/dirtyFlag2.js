var dirtyKeyRoots = [];
var dirtyReg = ko.observableArray([]);
export class dirtyFlag2 {
    constructor(key) {
        if (key.length < 1)
            throw "Key must have at least one character e.g. VM or VM.TAB1";
        this.key = key;
        dirtyKeyRoots.push(key);
        this.isDirty = ko.pureComputed(function () {
            let firstDirty = ko.utils.arrayFirst(dirtyReg(), function (reg) {
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
    reset(key, cleanValue) {
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
    }
    dispose() {
        var key = this.key;
        dirtyKeyRoots.splice(dirtyKeyRoots.indexOf(key), 1);
        ko.utils.arrayForEach(dirtyReg(), function (reg) {
            if (reg.key.indexOf(key) === 0) {
                reg.obs.unregister();
            }
        });
    }
}
const nonValueTypes = ["undefined", "null"];
const deepValueTypes = ["object"];
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
    let matches = true;
    for (let a = 0, l = arr1.length; a < l; a++) {
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
    let reg;
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
        let newClean = typeof cleanValue != "undefined" ? cleanValue : obs();
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
        let rootMatch = ko.utils.arrayFirst(dirtyKeyRoots, function (keyRoot) {
            return options.key.indexOf(keyRoot) >= 0;
        });
        if (!rootMatch)
            throw "There is no DirtyFlag tracking at a root of the key '" + options.key + "'";
        let match = ko.utils.arrayFirst(dirtyReg(), function (item) {
            return item.key === options.key;
        });
        if (match)
            throw "Another item with dirtyFlag key of '" + options.key + "' is already being tracked.";
        reg = { key: options.key, obs: obs };
        dirtyReg.push(reg);
    }
    return obs;
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QztLQUN0QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDIiwiZmlsZSI6ImRpcnR5RmxhZzIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIERpcnR5VHJhY2tlZE9icyA9IEtub2Nrb3V0T2JzZXJ2YWJsZTxhbnk+ICYgSURpcnR5SXRlbTtcclxuXHJcbmludGVyZmFjZSBJRGlydHlJdGVtIHtcclxuICAgIGNsZWFuOiBLbm9ja291dE9ic2VydmFibGU8YW55PjtcclxuICAgIGlzRGlydHk6IEtub2Nrb3V0Q29tcHV0ZWQ8Ym9vbGVhbj47XHJcbiAgICByZXNldDogKGNsZWFuVmFsdWU/OiBhbnkpID0+IHZvaWQ7XHJcbiAgICB1bnJlZ2lzdGVyOiAoKSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSURpcnR5UmVnIHtcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgb2JzOiBEaXJ0eVRyYWNrZWRPYnNcclxufVxyXG5cclxuaW50ZXJmYWNlIElEaXJ0eUZsYWdPcHRpb25zIHtcclxuICAgIGtleT86IHN0cmluZztcclxufVxyXG5cclxudmFyIGRpcnR5S2V5Um9vdHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxudmFyIGRpcnR5UmVnIDogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8SURpcnR5UmVnPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblxyXG5leHBvcnQgY2xhc3MgZGlydHlGbGFnMiB7XHJcbiAgICBwcml2YXRlIGtleTogc3RyaW5nO1xyXG4gICAgaXNEaXJ0eTogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gICAgY29uc3RydWN0b3Ioa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoa2V5Lmxlbmd0aCA8IDEpXHJcbiAgICAgICAgICAgIHRocm93IFwiS2V5IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgY2hhcmFjdGVyIGUuZy4gVk0gb3IgVk0uVEFCMVwiO1xyXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIGRpcnR5S2V5Um9vdHMucHVzaChrZXkpO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdERpcnR5ID0ga28udXRpbHMuYXJyYXlGaXJzdChkaXJ0eVJlZygpLCBmdW5jdGlvbiAocmVnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnLmtleS5pbmRleE9mKHRoaXMua2V5KSA9PT0gMCAmJiByZWcub2JzLmlzRGlydHkoKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChmaXJzdERpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldHMgYWxsIHZhbHVlcyB0cmFja2VkIGJ5IHRoZSBkaXJ0eWZsYWdcclxuICAgICAqIEBwYXJhbSBrZXkgSWYgUHJvdmlkZWQgcmVzZXRzIG9ubHkgdGhlIHZhbHVlIHRoYXQgbWF0Y2hlcyBleGFjdGx5XHJcbiAgICAgKiBAcGFyYW0gY2xlYW5WYWx1ZSBJZiBQcm92aWRlZCBzZXRzIHRoZSBjbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICByZXNldChrZXk/OiBzdHJpbmcsIGNsZWFuVmFsdWU/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rmlyc3QoZGlydHlSZWcoKSwgZnVuY3Rpb24gKHJlZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZy5rZXkubG9jYWxlQ29tcGFyZShrZXkpID09PSAwO1xyXG4gICAgICAgICAgICB9KS5vYnMucmVzZXQoY2xlYW5WYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAga2V5ID0gdGhpcy5rZXk7XHJcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChkaXJ0eVJlZygpLCBmdW5jdGlvbiAocmVnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnLmtleS5pbmRleE9mKGtleSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZWcub2JzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaXNwb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmtleTtcclxuICAgICAgICBkaXJ0eUtleVJvb3RzLnNwbGljZShkaXJ0eUtleVJvb3RzLmluZGV4T2Yoa2V5KSwgMSk7XHJcbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGRpcnR5UmVnKCksIGZ1bmN0aW9uIChyZWcpIHtcclxuICAgICAgICAgICAgaWYgKHJlZy5rZXkuaW5kZXhPZihrZXkpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZWcub2JzLnVucmVnaXN0ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBub25WYWx1ZVR5cGVzID0gW1widW5kZWZpbmVkXCIsIFwibnVsbFwiXTtcclxuY29uc3QgZGVlcFZhbHVlVHlwZXMgPSBbXCJvYmplY3RcIl07XHJcblxyXG4vKipcclxuICogQ29tcGFyZXMgMiBBcnJheXMgbG9va2luZyBmb3IgYW55dGhpbmcgdGhhdCBtYWtlcyB0aGVtIG5vdCBtYXRjaCAocGVyIGRpcnR5RmxhZyBSdWxlcylcclxuICogQHBhcmFtIGFycjFcclxuICogQHBhcmFtIGFycjJcclxuICovXHJcbmZ1bmN0aW9uIGRpcnR5QXJyYXlDb21wYXJlKGFycjE6IEFycmF5PGFueT4sIGFycjI6IEFycmF5PGFueT4pIDogYm9vbGVhbiB7XHJcbiAgICAvLyBBcnJheXMgb2YgZGlmZmVyZW50IGxlbmd0aCBhcmUgbmV2ZXIgY2xlYW5cclxuICAgIGlmIChhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gQXNzdW1lIHRydWVcclxuICAgIGxldCBtYXRjaGVzID0gdHJ1ZTtcclxuICAgIGZvciAobGV0IGEgPSAwLCBsID0gYXJyMS5sZW5ndGg7IGEgPCBsOyBhKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIG1lbWJlciBvZiB0aGUgYXJyeVxyXG4gICAgICAgIGlmIChub25WYWx1ZVR5cGVzLmluZGV4T2YodHlwZW9mIGFycjFbYV0pID49IDAgJiYgbm9uVmFsdWVUeXBlcy5pbmRleE9mKHR5cGVvZiBhcnIyW2FdKSA+PSAwKVxyXG4gICAgICAgICAgICBtYXRjaGVzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGRlZXBWYWx1ZVR5cGVzLmluZGV4T2YodHlwZW9mIGFycjFbYV0pID49IDAgfHwgZGVlcFZhbHVlVHlwZXMuaW5kZXhPZih0eXBlb2YgYXJyMlthXSkgPj0gMClcclxuICAgICAgICAgICAgdGhyb3cgXCJPYmplY3RzIGNhbm5vdCBiZSB1c2VkIGluIGRpcnR5RmxhZ1wiO1xyXG4gICAgICAgIGlmIChhcnIxW2FdICE9PSBhcnIyW2FdKVxyXG4gICAgICAgICAgICBtYXRjaGVzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gSWYgYW55dGhpbmcgaXMgZmFsc2UsIHN0b3AgY2hlY2tpbmcgcmVzdCBvZiBhcnJheVxyXG4gICAgICAgIGlmICghbWF0Y2hlcylcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm4gQXJyYXkgQ29tcGFyZSBSZXN1bHRcclxuICAgIHJldHVybiBtYXRjaGVzO1xyXG59XHJcblxyXG5rby5leHRlbmRlcnNbJ2RpcnR5RmxhZyddID0gZnVuY3Rpb24gKG9iczogS25vY2tvdXRPYnNlcnZhYmxlPGFueT4sIG9wdGlvbnM6IElEaXJ0eUZsYWdPcHRpb25zKSB7XHJcbiAgICBsZXQgcmVnOiBJRGlydHlSZWc7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYnMoKSkpIHtcclxuICAgICAgICBvYnNbJ2NsZWFuJ10gPSBrby5vYnNlcnZhYmxlQXJyYXkob2JzKCkuc2xpY2UoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkZWVwVmFsdWVUeXBlcy5pbmRleE9mKHR5cGVvZiBvYnMoKSkgPj0gMClcclxuICAgICAgICAgICAgdGhyb3cgXCJPYmplY3RzIGNhbm5vdCBiZSB1c2VkIGluIGRpcnR5RmxhZ1wiO1xyXG4gICAgICAgIG9ic1snY2xlYW4nXSA9IGtvLm9ic2VydmFibGUob2JzKCkpO1xyXG4gICAgfVxyXG4gICAgb2JzWydpc0RpcnR5J10gPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChub25WYWx1ZVR5cGVzLmluZGV4T2YodHlwZW9mIG9icygpKSA+PSAwICYmIG5vblZhbHVlVHlwZXMuaW5kZXhPZih0eXBlb2Ygb2JzWydjbGVhbiddKCkpID49IDApXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYnMoKSkgJiYgQXJyYXkuaXNBcnJheShvYnNbJ2NsZWFuJ10oKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFkaXJ0eUFycmF5Q29tcGFyZShvYnMoKSwgb2JzWydjbGVhbiddKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGVlcFZhbHVlVHlwZXMuaW5kZXhPZih0eXBlb2Ygb2JzKCkpID49IDAgfHwgZGVlcFZhbHVlVHlwZXMuaW5kZXhPZih0eXBlb2Ygb2JzWydjbGVhbiddKCkpID49IDApXHJcbiAgICAgICAgICAgIHRocm93IFwiT2JqZWN0cyBjYW5ub3QgYmUgdXNlZCBpbiBkaXJ0eUZsYWdcIjtcclxuICAgICAgICByZXR1cm4gb2JzKCkgIT09IG9ic1snY2xlYW4nXSgpO1xyXG4gICAgfSk7XHJcbiAgICBvYnNbJ3Jlc2V0J10gPSBmdW5jdGlvbiAoY2xlYW5WYWx1ZSkge1xyXG4gICAgICAgIGxldCBuZXdDbGVhbiA9IHR5cGVvZiBjbGVhblZhbHVlICE9IFwidW5kZWZpbmVkXCIgPyBjbGVhblZhbHVlIDogb2JzKCk7XHJcbiAgICAgICAgb2JzWydjbGVhbiddKEFycmF5LmlzQXJyYXkobmV3Q2xlYW4pID8gbmV3Q2xlYW4uc2xpY2UoKSA6IG5ld0NsZWFuKTtcclxuICAgIH07XHJcbiAgICBvYnNbJ3VucmVnaXN0ZXInXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAocmVnKSB7XHJcbiAgICAgICAgICAgIGRpcnR5UmVnLnJlbW92ZShyZWcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5rZXkgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBpZiAob3B0aW9ucy5rZXkubGVuZ3RoIDwgMSlcclxuICAgICAgICAgICAgdGhyb3cgXCJLZXkgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXIgZS5nLiBWTS5GSUVMRDEgb3IgVk0uVEFCMS5GSUVMRDFcIjtcclxuICAgICAgICBsZXQgcm9vdE1hdGNoID0ga28udXRpbHMuYXJyYXlGaXJzdChkaXJ0eUtleVJvb3RzLCBmdW5jdGlvbiAoa2V5Um9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5rZXkuaW5kZXhPZihrZXlSb290KSA+PSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghcm9vdE1hdGNoKVxyXG4gICAgICAgICAgICB0aHJvdyBcIlRoZXJlIGlzIG5vIERpcnR5RmxhZyB0cmFja2luZyBhdCBhIHJvb3Qgb2YgdGhlIGtleSAnXCIgKyBvcHRpb25zLmtleSArIFwiJ1wiO1xyXG4gICAgICAgIGxldCBtYXRjaCA9IGtvLnV0aWxzLmFycmF5Rmlyc3QoZGlydHlSZWcoKSwgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ua2V5ID09PSBvcHRpb25zLmtleTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAobWF0Y2gpXHJcbiAgICAgICAgICAgIHRocm93IFwiQW5vdGhlciBpdGVtIHdpdGggZGlydHlGbGFnIGtleSBvZiAnXCIgKyBvcHRpb25zLmtleSArIFwiJyBpcyBhbHJlYWR5IGJlaW5nIHRyYWNrZWQuXCI7XHJcbiAgICAgICAgcmVnID0geyBrZXk6IG9wdGlvbnMua2V5LCBvYnM6IDxEaXJ0eVRyYWNrZWRPYnM+b2JzIH07XHJcbiAgICAgICAgZGlydHlSZWcucHVzaChyZWcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9icztcclxufTsiXX0=
