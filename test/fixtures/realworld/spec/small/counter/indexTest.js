"use strict";
// declare function require(moduleName: string): any;
// import * as calc from '../../index'
// import '../../index';
var chai_1 = require('chai');
// import calc = require('../../index');
// import Counter from 'counter';
// import Counter from '../../../src/counter';
// import counterClass = require('../../index');
// import Counter from 'src/counter';
// import Counter from '../../../src/counter';
var counter_1 = require('src/counter');
// import * as Helper from '../../helper';
// var baseUrl = '../../../';
// var Counter = require(baseUrl + 'src/counter');
// var Counter = require('../../../src/counter');
// var Counter = new Helper({baseURL: '../'}).import('src/counter');
// Counter.then((Counter) => {
//     console.log("eiei");
//     console.log(Counter.counter(0, {type: "INCREMENT"}));
// });
// console.log(typeof Counter);
// var config = new Helper({baseURL: '../'}); // relative from helper file
// var Counter = config.import('src/counter');
// require('../../helper');
// console.log(typeof Counter);
// console.log(Helper.import('src/counter'));
describe('Counter', function () {
    var subject;
    beforeEach(function () {
        subject = new counter_1.default();
        // subject = new Counter();
    });
    it('should INCREMENT', function (done) {
        chai_1.expect(subject.counter(0, { type: "INCREMENT" })).to.eq(1);
        chai_1.expect(subject.counter(1, { type: "INCREMENT" })).to.eq(2);
        done();
    });
    it('should DECREMENT', function (done) {
        chai_1.expect(subject.counter(1, { type: "DECREMENT" })).to.eq(0);
        chai_1.expect(subject.counter(0, { type: "DECREMENT" })).to.eq(-1);
        done();
    });
    it('should return state if not INCREMENT or DECREMENT', function (done) {
        chai_1.expect(subject.counter(1, { type: "SOMETING_ELSE" })).to.eq(1);
        done();
    });
    it('should return 0 if state is undefined', function (done) {
        chai_1.expect(subject.counter(undefined, {})).to.eq(0);
        done();
    });
});
