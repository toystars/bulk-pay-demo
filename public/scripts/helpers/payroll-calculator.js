/*
 * Function to handle individual employee payment calculation
 * */
var PayRollCalculation = function (employee, payGradeTypes, employeeTaxRule, employeePensionRule) {


  var convertPayTypes = function (payTypes) {
    _.each(payTypes, function (payType) {
      payType.monthlyValue = payType.value / 12;
    });
    return payTypes;
  };

  /*
  * Clean up parameters and sort employee-modified
  * pay components and employee-exempted components
  * */

  var employeeExpenses = employee.expenses || [];
  var expenses = [];
  _.each(employeeExpenses, function (expense) {
    expenses.push({
      editablePerEmployee: "No",
      frequency: "Monthly",
      isBase: false,
      taxable: "Yes",
      title: expense.type,
      type: "Expense",
      value: expense.amount * 12,
      expenseObject: expense
    });
  });
  var employeeLoans = employee.loans || [];
  var loans = [];
  _.each(employeeLoans, function (loan) {
    var loanObject = new LoanCalculator(loan).evaluate();
    loans.push({
      editablePerEmployee: "No",
      frequency: "Monthly",
      isBase: false,
      taxable: "Yes",
      title: loan.purpose,
      type: "Repayment",
      value: loanObject.emi * 12,
      loanObject: _.extend(loanObject, { id: loan._id })
    });
  });


  var concatenatedPayTypes = payGradeTypes.concat(employee.customPayTypes, loans, expenses);
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
      if (type.type === 'Deduction' || type.type === 'Repayment') {
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
    var repayments = [];
    var expenses = [];
    _.each(payTypes, function (type) {
      switch (type.type) {
        case 'Wage':
          wages.push({
            value: type.value,
            code: type.code,
            title: type.title,
            type: type.type,
            frequency: type.frequency
          });
          break;
        case 'Benefit':
          benefits.push({
            value: type.value,
            code: type.code,
            title: type.title,
            type: type.type,
            frequency: type.frequency
          });
          break;
        case 'Expense':
          expenses.push({
            value: type.value,
            code: type.code,
            title: type.title,
            type: type.type,
            expense: type.expenseObject,
            frequency: type.frequency
          });
          break;
        case 'Repayment':
          repayments.push({
            value: type.value,
            code: type.code,
            title: type.title,
            type: 'Deduction',
            loanObject: type.loanObject,
            frequency: type.frequency
          });
          break;
        case 'Deduction':
          deductions.push({
            value: type.value,
            code: type.code,
            title: type.title,
            type: type.type,
            frequency: type.frequency
          });
          break;
      }
    });
    deductions.unshift({
      value: calculateTax(),
      code: 'PAYE',
      type: 'Deduction',
      title: 'PAYE Tax',
      frequency: 'Monthly'
    }, {
      value: calculatePensionRelief(),
      code: 'Pension',
      type: 'Deduction',
      title: 'Pension',
      frequency: 'Monthly'
    });
    return {
      wages: wages,
      benefits: benefits,
      deductions: deductions,
      repayments: repayments,
      expenses: expenses
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

  var currentPayTypes = getPayTypes();
  convertPayTypes(currentPayTypes.wages.concat(currentPayTypes.benefits, currentPayTypes.deductions, currentPayTypes.repayments, currentPayTypes.expenses))

  var calculate = function () {
    return {
      grossIncome: calculateGrossPay() / 12,
      percentageGrossIncomeRelief: {
        rate: taxRule.grossIncomeRelief,
        value: calculatePercentageTaxRelief()
      },
      consolidatedRelief: calculateFlatTaxRelief(),
      pensionRelief: calculatePensionRelief(),
      pension: calculatePensionRelief() / 12,
      totalTaxableIncome: calculateTaxableIncome(),
      tax: calculateTax() / 12,
      totalDeductions: calculateTotalDeductions() / 12,
      netPay: (calculateGrossPay() - calculateTotalDeductions()) / 12,
      otherDeductions: calculateOtherDeductions(),
      nonTaxablePayments: getOtherNonTaxableTypes(),
      payBreakDown: currentPayTypes
    };
  };

  return {
    calculate: calculate
  };
};
