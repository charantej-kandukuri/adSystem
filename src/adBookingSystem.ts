export class AdBookingSystem {
    private _budgetAllocation: Record<string, number>= {};
    private _budgetThreshold: number = 0;

    get budgetAllocation(): Record<string, number> {
        return this._budgetAllocation;
    }

    get budgetThreshold(): number {
        return this._budgetThreshold
    }

    set budgetThreshold(val: number) {
        this._budgetThreshold = val
    }

    constructor(public streamTypes: string[], public adBudget: number, public thresholdPercentage: number ){}
    
    initializeBudgetAllocation(adBudget: number): void {
        this.streamTypes.forEach((s : string): void => {
			this._budgetAllocation[s] = adBudget / this.streamTypes.length;
		});
		console.log('Initial Budget Allocation:', this.budgetAllocation);
		this.resetThereshold();
    }

    getRemainingBalance(): number {
        return Object.values(this.budgetAllocation).reduce((acc, item) => acc + item, 0);
    }

    rebalanceBudget(): void {
		const remainingBudget = this.getRemainingBalance()
		this.streamTypes.forEach((s) => {
			this.budgetAllocation[s] = remainingBudget / this.streamTypes.length;
		});
		this.resetThereshold();
	}

    percentageCalulator(amt:number, percentage:number): number {
		return amt * percentage / 100;
	}

    resetThereshold() {
		this.budgetThreshold = this.percentageCalulator(
			this.budgetAllocation[this.streamTypes[0]],
			this.thresholdPercentage
		);
	}

    consumeRandomly(): void {
		this.streamTypes.forEach((streamType: string) => {
			let randomUtilization = Math.random() * (5000 - 2000) + 2000; // Randomly consume between 2K and 5K
		
            if(this.budgetAllocation[streamType] < randomUtilization){
                randomUtilization = this.budgetAllocation[streamType]
            }
            this.budgetAllocation[streamType] -= randomUtilization;
		});
	}

    runCampaign(): void {
        console.log('Campaign Started ...')
        this.initializeBudgetAllocation(this.adBudget);
		while (true) {
			console.log('budgetAllocation ::::::::', this.budgetAllocation);
			// cond 1. If both have balance of zero or less, exit program.
			let balanceRemaining = Object.values(this.budgetAllocation).reduce((acc, item) => acc + item, 0);
			if (balanceRemaining <= 0) {
				console.log('Both streams exhausted. Exiting program.');
				break;
			}
            
			// cond 2. Check if alteast one of them have balance of less than 5%, rebalance both streams to have equal balance
			let liveStreams = Object.values(this.budgetAllocation).filter((item) => item < this.budgetThreshold).length;

			if (liveStreams > 0 && liveStreams < this.streamTypes.length) {
				console.log('Rebalance when atleast one stream balance is less than 5%');
				this.rebalanceBudget();
			}

			this.consumeRandomly();
		}

		console.log('Final Budget Allocation:', this.budgetAllocation);
	}

}

const adSystem = new AdBookingSystem(['stream1', 'stream2'], 100000, 5);

console.log(adSystem);