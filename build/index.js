"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adBookingSystem_1 = require("./adBookingSystem");
const adBudget = 100000;
const streams = ['stream1', 'stream2'];
const thresholdPercentage = 5;
const adSystem = new adBookingSystem_1.AdBookingSystem(streams, adBudget, thresholdPercentage);
adSystem.runCampaign();
