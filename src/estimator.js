import Big from 'big.js';

const infectionsByRequestedTime = (data, currentlyInfected) => {
  let infections = null;
  const period = Big(data.timeToElapse);
  let periodInDays;
  let unitPeriod;
  switch (data.periodType) {
    case 'weeks':
      periodInDays = period * 7;
      unitPeriod = Math.round(periodInDays / 3);
      infections = currentlyInfected * (2 ** unitPeriod);
      break;
    case 'months':
      periodInDays = period * 30;
      unitPeriod = Math.round(periodInDays / 3);
      infections = currentlyInfected * (2 ** unitPeriod);
      break;
    default:
      unitPeriod = Math.round(period / 3);
      infections = currentlyInfected * (2 ** unitPeriod);
      break;
  }
  return infections;
};

const severeCasesByRequestedTime = ((time) => Math.round(time * 0.15)
);

const casesForICUByRequestedTime = ((time) => time * 0.05
);

const casesForVentilatorsByRequestedTime = ((time) => time * 0.02
);

const dollarsInFlight = (data, infections) => {
  let totalDollars;
  let timeInDays;
  const { avgDailyIncomePopulation } = data.region;
  const { avgDailyIncomeInUSD } = data.region;
  switch (data.periodType) {
    case 'weeks':
      timeInDays = data.timeToElapse * 7;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
    case 'months':
      timeInDays = data.timeToElapse * 30;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
    default:
      timeInDays = data.timeToElapse;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
  }
  return totalDollars;
};

const hospitalBedsByRequestedTime = (data, severeCases) => {
  const availableBeds = data.totalHospitalBeds * 0.35;
  return availableBeds - severeCases;
};

const covid19ImpactEstimator = ((data) => {
  const impact = {};
  const severeImpact = {};
  const reportedCases = Big(data.reportedCases);

  impact.currentlyInfected = reportedCases * Big(10);
  severeImpact.currentlyInfected = reportedCases * Big(50);

  const iCurrentlyInfected = Big(impact.currentlyInfected);
  impact.infectionsByRequestedTime = infectionsByRequestedTime(data, iCurrentlyInfected);
  const siCurrentlyInfected = Big(severeImpact.currentlyInfected);
  severeImpact.infectionsByRequestedTime = infectionsByRequestedTime(data, siCurrentlyInfected);

  impact.severeCasesByRequestedTime = severeCasesByRequestedTime(impact.infectionsByRequestedTime);
  let infections = severeImpact.infectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime = severeCasesByRequestedTime(infections);

  const siSevereCases = severeImpact.severeCasesByRequestedTime;
  const iSevereCases = impact.severeCasesByRequestedTime;
  impact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime(data, iSevereCases);
  severeImpact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime(data, siSevereCases);

  impact.casesForICUByRequestedTime = casesForICUByRequestedTime(impact.infectionsByRequestedTime);
  infections = severeImpact.infectionsByRequestedTime;
  severeImpact.casesForICUByRequestedTime = casesForICUByRequestedTime(infections);

  infections = impact.infectionsByRequestedTime;
  impact.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(infections);
  infections = severeImpact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(infections);

  infections = impact.infectionsByRequestedTime;
  impact.dollarsInFlight = dollarsInFlight(data, infections);
  infections = severeImpact.infectionsByRequestedTime;
  severeImpact.dollarsInFlight = dollarsInFlight(data, infections);
  return { data, impact, severeImpact };
});

export default covid19ImpactEstimator;
