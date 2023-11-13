"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adBookingSystem_1 = require("../adBookingSystem");
describe('AdBookingSystem', () => {
    let adSystem;
    beforeEach(() => {
        let adBudget = 100000;
        let streams = ['stream1', 'stream2'];
        let thresholdPercentage = 5;
        adSystem = new adBookingSystem_1.AdBookingSystem(streams, adBudget, thresholdPercentage);
    });
    it('should share the budget evenly bw services', () => {
        adSystem.initializeBudgetAllocation(100000);
        const expectedBudgetAllocation = { stream1: 50000, stream2: 50000 };
        expect(adSystem.budgetAllocation).toEqual(expectedBudgetAllocation);
    });
    it('should return the percent of the givent amount', () => {
        expect(adSystem.percentageCalulator(100, 1)).toBe(1);
    });
    it('should run the ad campaign and maintain proper balance', () => {
        const logSpy = jest.spyOn(global.console, 'log');
        adSystem.initializeBudgetAllocation(100000);
        adSystem.runCampaign();
        expect(logSpy).toHaveBeenCalledWith('Initial Budget Allocation:', expect.any(Object));
        expect(logSpy).toHaveBeenCalledWith('Final Budget Allocation:', expect.any(Object));
        logSpy.mockRestore();
    });
    describe('Rebalancing', () => {
        it('should exit the program when all stream balance are less than or equal to 0', () => {
            const logSpy = jest.spyOn(global.console, 'log');
            adSystem.budgetAllocation['stream1'] = 0;
            adSystem.budgetAllocation['stream2'] = 0;
            adSystem.runCampaign();
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith('Both streams exhausted. Exiting program.');
            logSpy.mockRestore();
        });
        it('should continue to run the program when all stream balance are more than 5%', () => {
            const logSpy = jest.spyOn(global.console, 'log');
            adSystem.budgetAllocation['stream1'] = adSystem.budgetThreshold + 1;
            adSystem.budgetAllocation['stream2'] = adSystem.budgetThreshold + 1;
            adSystem.runCampaign();
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith('Both streams exhausted. Exiting program.');
            expect(logSpy).toHaveBeenCalledWith('Final Budget Allocation:', expect.any(Object));
            logSpy.mockRestore();
        });
        it('should continue to run the program when all stream balance are less than 5%', () => {
            const logSpy = jest.spyOn(global.console, 'log');
            adSystem.budgetAllocation['stream1'] = adSystem.budgetThreshold - 1;
            adSystem.budgetAllocation['stream2'] = adSystem.budgetThreshold - 1;
            adSystem.runCampaign();
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith('Final Budget Allocation:', expect.any(Object));
            logSpy.mockRestore();
        });
        it('should rebalance when atleast one stream balance is less than 5% but not all', () => {
            const logSpy = jest.spyOn(global.console, 'log');
            adSystem.budgetThreshold = 5;
            adSystem.budgetAllocation['stream1'] = adSystem.budgetThreshold - 1;
            adSystem.budgetAllocation['stream2'] = adSystem.budgetThreshold + 1;
            adSystem.runCampaign();
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith('Rebalance when atleast one stream balance is less than 5%');
            logSpy.mockRestore();
        });
        it('should reset the threshold values on rebalancing', () => {
            adSystem.budgetAllocation['stream1'] = 0;
            adSystem.budgetAllocation['stream2'] = 1000;
            adSystem.rebalanceBudget(); // each stream wil get 500
            expect(adSystem.budgetThreshold).toBe(25); // 5 percent of 500 is 25
        });
    });
});
