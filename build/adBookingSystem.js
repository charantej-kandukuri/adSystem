"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdBookingSystem = void 0;
class AdBookingSystem {
    get budgetAllocation() {
        return this._budgetAllocation;
    }
    get budgetThreshold() {
        return this._budgetThreshold;
    }
    set budgetThreshold(val) {
        this._budgetThreshold = val;
    }
    constructor(streamTypes, adBudget, thresholdPercentage) {
        this.streamTypes = streamTypes;
        this.adBudget = adBudget;
        this.thresholdPercentage = thresholdPercentage;
        this._budgetAllocation = {};
        this._budgetThreshold = 0;
    }
    initializeBudgetAllocation(adBudget) {
        this.streamTypes.forEach((s) => {
            this._budgetAllocation[s] = adBudget / this.streamTypes.length;
        });
        console.log('Initial Budget Allocation:', this.budgetAllocation);
        this.resetThereshold();
    }
    getRemainingBalance() {
        return Object.values(this.budgetAllocation).reduce((acc, item) => acc + item, 0);
    }
    rebalanceBudget() {
        const remainingBudget = this.getRemainingBalance();
        this.streamTypes.forEach((s) => {
            this.budgetAllocation[s] = remainingBudget / this.streamTypes.length;
        });
        this.resetThereshold();
    }
    percentageCalulator(amt, percentage) {
        return amt * percentage / 100;
    }
    resetThereshold() {
        this.budgetThreshold = this.percentageCalulator(this.budgetAllocation[this.streamTypes[0]], this.thresholdPercentage);
    }
    consumeRandomly() {
        this.streamTypes.forEach((streamType) => {
            let randomUtilization = Math.random() * (5000 - 2000) + 2000; // Randomly consume between 2K and 5K
            if (this.budgetAllocation[streamType] < randomUtilization) {
                randomUtilization = this.budgetAllocation[streamType];
            }
            this.budgetAllocation[streamType] -= randomUtilization;
        });
    }
    runCampaign() {
        console.info('Campaign Started ...');
        this.initializeBudgetAllocation(this.adBudget);
        while (true) {
            console.info('budgetAllocation ::::::::', this.budgetAllocation);
            // cond 1. If both have balance of zero or less, exit program.
            let balanceRemaining = this.getRemainingBalance();
            if (balanceRemaining <= 0) {
                console.log('Both streams exhausted. Exiting program.');
                break;
            }
            // cond 2. Check if alteast one of them have balance of less than 5%, rebalance both streams to have equal balance
            let liveStreams = Object.values(this.budgetAllocation).filter((item) => item < this.budgetThreshold).length;
            if (liveStreams > 0 && liveStreams < this.streamTypes.length) {
                console.log('Rebalance when atleast one stream balance is less than budgetThreshold');
                this.rebalanceBudget();
            }
            this.consumeRandomly();
        }
        console.log('Final Budget Allocation:', this.budgetAllocation);
    }
}
exports.AdBookingSystem = AdBookingSystem;
const adSystem = new AdBookingSystem(['stream1', 'stream2'], 100000, 5);
console.log(adSystem);
