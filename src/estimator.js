const covid19ImpactEstimator = (data) => {
  
  return {
    data:{
      reportedCases;
    },
    impact: { // simple case scenario.
      currentlyInfected: reportedCases * 10,
      infectionsByRequestedTime: currentlyInfected * 1024
    },
    severeImpact: { // worst case scenario.
      currentlyInfected: reportedCases * 50,
      infectionsByRequestedTime: currentlyInfected * 1024
    }
  };;
};

export default covid19ImpactEstimator;
