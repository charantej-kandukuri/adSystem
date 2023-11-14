import  { AdBookingSystem } from  '../adBookingSystem';

describe('AdBookingSystem', () => {
    let adSystem: AdBookingSystem;

    beforeEach(() => {
      let adBudget = 100000
      let streams = ['stream1', 'stream2'];
      let thresholdPercentage = 5

      adSystem = new AdBookingSystem(streams, adBudget, thresholdPercentage)
    })

    it('should share the budget evenly bw services', () => {
      adSystem.initializeBudgetAllocation(adSystem.adBudget);
      const expectedBudgetAllocation = { stream1: 50000, stream2: 50000 };
      expect(adSystem.budgetAllocation).toEqual(expectedBudgetAllocation);
    });

    it('should return the remaining balance', () => {
      adSystem.budgetAllocation['stream1'] = 1;
      adSystem.budgetAllocation['stream2'] = 1;
      expect(adSystem.getRemainingBalance()).toBe(2);

    })

    it('should return the percent of the givent amount', () => {
      expect(adSystem.percentageCalulator(100, 1)).toBe(1);
    });

    it('should run the ad campaign and maintain proper balance', () => {
      const logSpy = jest.spyOn(global.console, 'log');
  
      adSystem.initializeBudgetAllocation(adSystem.adBudget);
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
  
      it('should rebalance when atleast one stream balance is less than threshold budget but not all', () => {
        adSystem.budgetThreshold = 1;
        adSystem.budgetAllocation['stream1'] = adSystem.budgetThreshold - 1;
        adSystem.budgetAllocation['stream2'] = adSystem.budgetThreshold + 1;
        adSystem.rebalanceBudget();

        const expectedBudgetAllocation = { stream1: 1, stream2: 1 };
        expect(adSystem.budgetAllocation).toEqual(expectedBudgetAllocation);
  
      });
  
      it('should reset the threshold values on rebalancing', () => {
        adSystem.budgetAllocation['stream1'] = 0;
        adSystem.budgetAllocation['stream2'] = 1000;
        adSystem.rebalanceBudget(); // each stream wil get 500
        expect(adSystem.budgetThreshold).toBe(25); // 5 percent of 500 is 25
      });
    });
});