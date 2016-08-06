"use strict";
var actionTypes_1 = require('./actionTypes');
var Counter = (function () {
    function Counter() {
    }
    Counter.prototype.counter = function (state, action) {
        if (state === void 0) { state = 0; }
        switch (action.type) {
            case actionTypes_1.INCREMENT:
                return state + 1;
            case actionTypes_1.DECREMENT:
                return state - 1;
            default:
                return state;
        }
    };
    return Counter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Counter;
// const store = createStore(new Counter().counter);
// console.log(store.getState());
// store.dispatch({ type: "INCREMENT" });
// console.log(store.getState());
///////////////////////////////////////////
