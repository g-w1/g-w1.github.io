 pressed()
  function pressed(){let date = new Date();
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var secondDate = new Date(2019, 6, 22);
  var diffDays = Math.round(Math.abs((date - secondDate) / oneDay));
  var numberDone = Number(document.getElementById("input").value);
  var numberBurpees = ((diffDays * 25) +50 -numberDone);
  if (numberBurpees < 0){
  	numberBurpees = 0;
  }
  document.getElementById('output').innerHTML = numberBurpees;
    //just to show that jacob wrote this
  document.getElementById('output1').innerHTML = date;}