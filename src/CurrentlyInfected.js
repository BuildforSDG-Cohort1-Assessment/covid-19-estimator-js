 covid19ImpactEstimator = (data) => {
 	const input = data;
	return {
		data:{
			region:{
				name: Kenya
				avgAge: 31
				avgIncomeinUSD: 194
				avgDailyIncomePopulation: 412
			}
			period type: days
			timeToElapse:30
			reportCases: 1970
			population: 49000000
			totalHospitalBeds:518
		}
		estimated: {
		impact: {
			currentlyInfected:197 
			infectionsByRequestedTime: 1823
			severeCasesByRequestedTime:273
			hospitalBedsByRequestedTime:-1305
			casesForIcuBy RequestedTime:91
			casesForVentilatorsByRequestedTime:36
			dollarsInFlight:45
		},
		severeImpact: {
			currentlyInfected:197
			infectionsByRequestedTime:1823
			severeCasesByRequestedTime:273
			hospitalBedsByRequestedTime:-457
			casesForICUByRequestedTime:91
			casesForVentilatorsByRequestedTime:36
			dollarInFlight:45
		}
	
		}
}:

export default covid19ImpactEstimator;
