        // --- global variables ---
      var loans = [
          {loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453},
          {loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453},          
          {loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453},         
          {loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453},          
          {loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453}
      ];

      // --- function: loadDoc() ---
     $(document).ready(function() {

         // pre-fill defaults for first loan year which has since been modified to work using jquery
         var defaultYear = loans[0].loan_year;
         $("#loan_year0" + 1).val(defaultYear++); //swapped document.getElementById
         var defaultLoanAmount = loans[0].loan_amount;
         $("#loan_amt0" + 1).val(defaultLoanAmount.toFixed(2)); //swapped document.getElementById 
         var defaultInterestRate = loans[0].loan_int_rate;
         $("#loan_int0" + 1).val(defaultInterestRate); //swapped document.getElementById
         var loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
         $("#loan_bal0" + 1).text(toMoney(loanWithInterest)); //swapped document.getElementById 

         // pre-fill defaults for other loan years which has been modified to function with jquery
         for (let i = 2; i < 6; i++) {
             $(`#loan_year0${i}`).val(defaultYear++); 
             $(`#loan_year0${i}`).attr("disabled", "true"); //set all year values
             $(`#loan_year0${i}`).css({
                 "backgroundColor": "grey",
                 "color": "white"
             }); //disabled gray background w/ white text
             $(`#loan_amt0${i}`).val(defaultLoanAmount.toFixed(2)); //apply 10,000 value
             $(`#loan_int0${i}`).val(defaultInterestRate); //apply default interest 
             $(`#loan_int0${i}`).attr("disabled", "true"); //disable loan_int0
             $(`#loan_int0${i}`).css({
                 "backgroundColor": "grey",
                 "color": "white"
             }); //set values gray background w/ white text
             loanWithInterest = (loanWithInterest + defaultLoanAmount) * (1 + defaultInterestRate);
             $("#loan_bal0" + i).text(toMoney(loanWithInterest)); //swapped the document.getElementById 
         } // end: "for" loop

         $("input[type=text]").focus(function() {
             $(this).select();
             $(this).css("background-color", "yellow");
         });
         $("input[type=text]").blur(function() {
             $(this).css("background-color", "white");
             updateLoansArray();
         }); 

     }); // end: function loadDoc()

     // -------------------------------------------------------

     function toComma(value) {
         return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     }

     let toMoney = (value) => {
         return `\$${toComma(value.toFixed(2))}`;
     }
     let savedata = () => { //savedata
         localStorage.setItem(`as06`, JSON.stringify(loans)); //save all data 
     }

     let loaddata = () => { //loadata
         if (localStorage.getItem(`as06`) != null) { //on-device data
             loans = JSON.parse(localStorage.getItem(`as06`)); //apply values from the saved data to loans
             updateForm(); //apply values 
         } else { 
             alert("Error: no saved values"); //alert lack of data
         }
     }

     function updateLoansArray() {
         let yearcontroller = /^(19|20)\d{2}$/; //within 1899 and 2099
         let amountcontroller = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/; //number and above 1 dollar
         let integercontroller = /^(0|)+(.[0-9]{1,5})?$/; //number is below 1
         let tracker = true; 

         if (!yearcontroller.test($(`#loan_year01`).val())) { //year field
             tracker = false; 
             alert("There is an error in the year field"); //prompt user
         }

         for (i = 1; i < 6; i++) { //amount field
             if (!amountcontroller.test($(`#loan_amt0${i}`).val())) { 
                 tracker = false; 
                 alert("There is an error in the amount field in box: " + i); //prompt user 
             }
         }

         if (!integercontroller.test($(`#loan_int01`).val())) { //loan field 
             tracker = false; //set to false
             alert("There is an error in the interest rate field"); //prompt user
         }

         if (tracker) { 
             loans[0].loan_year = parseInt($("#loan_year01").val()); //pass the year value
             for (var i = 1; i < 5; i++) { //loop input field
                 loans[i].loan_year = loans[0].loan_year + i; //apply value to loans 
             }

             for (i = 1; i < 6; i++) { //loop entirety 
                 let amount = parseFloat($(`#loan_amt0${i}`).val()).toFixed(2); //float value as decimal value 
                 loans[i - 1].loan_amount = amount; //save value to loans array
             }

             let interestrate = parseFloat($("#loan_int01").val()); //generate interest rate value
             for (i = 0; i < 5; i++) { //loop for interest rate
                 loans[i].loan_int_rate = interestrate; //save interest rate to loans
             }

             updateForm(); //apply values

         }

     }

     let updateForm = () => {
         loanWithInterest = 0; //loanwithinterest
         let totalloan = 0; //totalloan value
         for (i = 1; i < 6; i++) { //loop entire field
             $(`#loan_year0${i}`).val(loans[i - 1].loan_year); 
             let loaned = loans[i - 1].loan_amount; //loaned variable
             $(`#loan_amt0${i}`).val(loaned); //pull loaned amount
             totalloan += parseFloat(loaned); //accumulate total amount loaned
             $(`#loan_int0${i}`).val(loans[i - 1].loan_int_rate); //pull integer value
             loanWithInterest = (loanWithInterest + parseFloat(loaned)) * (1 + loans[0].loan_int_rate); //calculate the total loaned
             $("#loan_bal0" + i).text(toMoney(loanWithInterest)); //apply loanwithinterest
         }
         let totalamountowed = loanWithInterest - totalloan;
         $(`#loan_int_accrued`).text(toMoney(totalamountowed)); 
     }


     var app = angular.module('appdata', []); //create and initialize app 

     app.controller('alldata', function($scope) { 
         $scope.payments = []; //find the payments

         $scope.populate = function() { //begin populate

             updateForm(); //update visible

             let endprice = loanWithInterest; //initialize endprice 
             let interestrate = loans[0].loan_int_rate; //initialize interestrate 
             let r = interestrate / 12; //create r 
             let n = 11; //create n 

             let pay = 12 * (endprice / ((((1 + r) ** (n * 12)) - 1) / (r * (1 + r) ** (n * 12)))); //calculate payment
             for (let i = 0; i < 10; i++) { //loop 10x
                 endprice -= pay //decrease endprice
                 let interested = endprice * (interestrate); //create and initialize int 
                 $scope.payments[i] = { //adjust payments values
                     "year": loans[4].loan_year + i + 1, //next year
                     "payed": toMoney(pay), //apply what is payed
                     "interestamount": toMoney(interested), //apply amount interested
                     "endbalance": toMoney(endprice += interested) //apply end price 
                 }
             }
             $scope.payments[10] = { //apply values
                 "year": loans[4].loan_year + 11, 
                 "payed": toMoney(endprice),
                 "interestamount": toMoney(0), 
                 "endbalance": toMoney(0) 
             }
         }
     });