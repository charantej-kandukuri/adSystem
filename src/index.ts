import { AdBookingSystem } from "./adBookingSystem";


const adBudget = 100000;
const streams = ['stream1', 'stream2'];
const thresholdPercentage = 5;
const adSystem = new AdBookingSystem(streams, adBudget, thresholdPercentage);
adSystem.runCampaign();