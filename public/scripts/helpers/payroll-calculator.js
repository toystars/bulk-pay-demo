/*
 * Function to handle individual employee payment calculation
 * */
var PayRollCalculation = function (employee, payGradeTypes, employeeTaxRule, employeePensionRule) {

  /*
  * Clean up parameters and sort employee-modified
  * pay components and employee-exempted components
  * */
  var concatenatedPayTypes = payGradeTypes.concat(employee.customPayTypes);
  var newPayTypes = [];
  _.each(concatenatedPayTypes, function (payType) {
    var type = _.find(employee.editablePayTypes, function (editablePayType) { return editablePayType.code === payType.code });
    if (type) {
      payType = type;
    }
    if (!_.find(employee.exemptedPayTypes, function (exType) { return exType.code === payType.code })) {
      newPayTypes.push(payType);
    }
  });

  console.log(newPayTypes);

  // initializing variables
  var payTypes = newPayTypes;
  var taxRule = employeeTaxRule;
  var pensionRule = employeePensionRule;

  var calculateGrossPay = function () {
    var grossPay = 0;
    _.each(payTypes, function (type) {
      if (type.type !== 'Deduction' && type.taxable === 'Yes') {
        grossPay += type.value;
      }
    });
    return grossPay;
  };

  var calculateOtherDeductions = function () {
    var deductions = 0;
    _.each(payTypes, function (type) {
      if (type.type === 'Deduction') {
        deductions += type.value;
      }
    });
    return deductions;
  };

  var getOtherNonTaxableTypes = function () {
    var sum = 0;
    _.each(payTypes, function (type) {
      if (type.taxable === 'No') {
        sum += type.value;
      }
    });
    return sum;
  };

  var calculateTaxableIncome = function () {
    return calculateGrossPay() - (calculateFlatTaxRelief() + calculatePercentageTaxRelief() + calculatePensionRelief() + getOtherNonTaxableTypes());
  };

  var calculatePercentageTaxRelief = function () {
    return taxRule.grossIncomeRelief * ( calculateGrossPay() / 100 );
  };

  var calculateFlatTaxRelief = function () {
    return (calculateGrossPay() > 20000000) ? calculateGrossPay() / 100 : 200000;
  };

  var calculatePensionRelief = function () {
    var sum = 0;
    _.each(pensionRule.payTypes, function (payTypeId) {
      var type = _.find(payTypes, function (element) { return element.payTypeId === payTypeId; });
      if (type) {
        sum += type.value;
      }
    });
    return pensionRule.employeeContributionRate * ( sum / 100 );
  };

  var getPayTypes = function () {
    var wages = [];
    var benefits = [];
    var deductions = [];
    _.each(payTypes, function (type) {
      switch (type.type) {
        case 'Wage':
          wages.push({
            value: type.value,
            code: type.code,
            title: type.title,
            frequency: type.frequency
          });
          break;
        case 'Benefit':
          benefits.push({
            value: type.value,
            code: type.code,
            title: type.title,
            frequency: type.frequency
          });
          break;
        case 'Deduction':
          deductions.push({
            value: type.value,
            code: type.code,
            title: type.title,
            frequency: type.frequency
          });
          break;
      }
    });
    deductions.unshift({
      value: calculateTax(),
      code: 'PAYE',
      title: 'PAYE Tax',
      frequency: 'Monthly'
    }, {
      value: calculatePensionRelief(),
      code: 'Pension',
      title: 'Pension',
      frequency: 'Monthly'
    });
    return {
      wages: wages,
      benefits: benefits,
      deductions: deductions
    };
  };

  var calculateTax = function () {
    var totalTaxable = calculateTaxableIncome();
    var tax = 0;
    var rules = taxRule.rules;
    for (var x = 0; x < rules.length; x++) {
      if (rules[x].range !== 'OVER') {
        if (totalTaxable > rules[x].upperLimitValue) {
          totalTaxable = totalTaxable - rules[x].upperLimitValue;
          tax += rules[x].rate * ( rules[x].upperLimitValue / 100 );
        } else {
          tax += rules[x].rate * ( totalTaxable / 100 );
          break;
        }
      } else {
        tax += rules[x].rate * ( totalTaxable / 100 );
      }

    }
    return tax;
  };

  var calculateTotalDeductions = function () {
    return calculatePensionRelief() + calculateTax() + calculateOtherDeductions();
  };

  var calculate = function () {
    return {
      grossIncome: calculateGrossPay(),
      percentageGrossIncomeRelief: {
        rate: taxRule.grossIncomeRelief,
        value: calculatePercentageTaxRelief()
      },
      consolidatedRelief: calculateFlatTaxRelief(),
      pensionRelief: calculatePensionRelief(),
      pension: calculatePensionRelief(),
      totalTaxableIncome: calculateTaxableIncome(),
      tax: calculateTax(),
      totalDeductions: calculateTotalDeductions(),
      netPay: calculateGrossPay() - calculateTotalDeductions(),
      otherDeductions: calculateOtherDeductions(),
      nonTaxablePayments: getOtherNonTaxableTypes(),
      payBreakDown: getPayTypes()
    };
  };

  return {
    calculate: calculate
  };
};
