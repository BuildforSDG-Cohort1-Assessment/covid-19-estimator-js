const covid19ImpactEstimator = (data) => {
  const input = data;
  
  return {
    data:{
      input,
    impact: { // simple case scenario.
      currentlyInfected: reportedCases * 10,
      infectionsByRequestedTime: currentlyInfected * 1024
    },
    severeImpact: { // worst case scenario.
      currentlyInfected: reportedCases * 50,
      infectionsByRequestedTime: currentlyInfected * 1024
    }
  };
};

export default covid19ImpactEstimator;
