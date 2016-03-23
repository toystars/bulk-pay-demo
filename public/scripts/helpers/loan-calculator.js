/*
 * Function to handle individual employee loan calculation
 * */
var LoanCalculator = function (loan) {

  var amount = loan.amount ? loan.amount : 0;
  var activeAmount = loan.activeAmount ? (amount === loan.activeAmount) ? amount : loan.activeAmount : 0;
  var rate = loan.rate ? ( loan.rate / 100 ) / 12 : 0;
  var duration = loan.term ? loan.term : 0;


  var calculateEMI = function () {
    var emi = ( amount * (Math.pow(1 + rate, duration)) * rate ) / ( (Math.pow(1 + rate, duration)) - 1 );
    return parseFloat(emi.toFixed(2));
  };

  var analyzeCurrentMonth = function () {
    var EMI = calculateEMI();
    var interest = parseFloat(getInterest().toFixed(2));
    var principal = parseFloat((EMI - interest).toFixed(2));
    return {
      EMI: EMI,
      interest: interest,
      principal: principal
    };
  };

  var getInterest = function () {
    return activeAmount * getPOI(rate) * 100;
  };

  var getPOI = function (rate) {
    return rate / 100;
  };

  var analyze = function () {
    return {
      emi: calculateEMI(),
      runAnalysis: analyzeCurrentMonth()
    };
  };

  return {
    evaluate: analyze
  };
};
