"use strict";
var chai_1 = require('chai');
var actionTypes_1 = require('../../../src/counter/actionTypes');
describe('action types', function () {
    describe('INCREMENT', function () {
        it('should eq "INCREMENT"', function (done) {
            chai_1.expect(actionTypes_1.INCREMENT).to.eq("INCREMENT");
            done();
        });
    });
    describe('DECREMENT', function () {
        it('should eq "DECREMENT"', function (done) {
            chai_1.expect(actionTypes_1.DECREMENT).to.eq("DECREMENT");
            done();
        });
    });
});
