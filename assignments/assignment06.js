        // --- global variables ---
      var loans = [
          {loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453},
          {loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453},          
          {loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453},         
          {loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453},          
          {loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453}
      ];

      // --- function: loadDoc() ---

      //function loadDoc() {
      $(document).ready(function() {


          // pre-fill defaults for first loan year
          var defaultYear = loans[0].loan_year;
          $("loan_year0" + 1).value = defaultYear++;
          var defaultLoanAmount = loans[0].loan_amount;
          $("loan_amt0" + 1).value = defaultLoanAmount.toFixed(2);
          var defaultInterestRate = loans[0].loan_int_rate;
          $("loan_int0" + 1).value = defaultInterestRate;
          var loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
          $("loan_bal0" + 1).innerHTML = toComma(loanWithInterest.toFixed(2));

          // pre-fill defaults for other loan years
           for (var i = 2; i < 6; i++) {
              $("#loan_year0" + i).value = defaultYear++;
              $("#loan_year0" + i).attr("disabled", "true");
              $("#loan_year0" + i).css({"background-color":"grey","color":"white"});
              $("#loan_year0" + i).css("color","white");
              $("#loan_amt0" + i).value = defaultLoanAmount.toFixed(2);
              $("#loan_int0" + i).value = defaultInterestRate;
              $("#loan_int0" + i).attr("disabled", "true");
              $("#loan_int0" + i).css({"background-color":"grey","color":"white"});
              $("#loan_int0" + i).css("background-color","grey");
              loanWithInterest = (loanWithInterest + defaultLoanAmount) * (1 + defaultInterestRate);
              $("#loan_bal0" + i).innerHTML = toComma(loanWithInterest.toFixed(2));
          } // end: "for" loop


          // all input fields: select contents on fucus
          $("input[type=text]").focus(function() {
              $(this).select();
              $(this).css("background-color", "yellow");
          });
          $("input[type=text]").blur(function() {
              $(this).css("background-color", "white");
            updateLoansArray();
          });

          // set focus to first year: messes up codepen
          // $("#loan_year01").focus();

          // end: function loadDoc()
      });

      function toComma(value) {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      let toMoney = (value) => {
         return `\$${toComma(value.toFixed(2))}`; 
      }

function updateLoansArray() {
  let regex = /[0-9]/;
  let keepery = false;
  let keeperi = false;
  if (regex.test(parseInt($("#loan_year01").val()))) {
    keepery=true;
  }
  if (regex.test(parseInt($("#loan_int01").val()))) {
    keeperi=true;
  }
if(keepery==true&&keeperi==true){
    loans[0].loan_year = parseInt($("#loan_year01").val());
    for(var i=1; i<5; i++) {
     loans[i].loan_year = loans[0].loan_year + i;
     $("#loan_year0"+ (i+1) ).val(loans[i].loan_year);
   }  
    
    let interest = parseFloat($("#loan_int01").val());
    for(let i=1; i<5; i++) {
     loans[i].loan_int_rate = interest;
     $(`#loan_int0${i}`).val(loans[i-1].loan_int_rate);
   }
}

  loans[0].loan_amount = parseInt($("#loan_amt01").val());
  
  document.getElementById("loan_bal01").innerHTML =($("#loan_amt01").val()*$("#int_amt01").val());
   
}