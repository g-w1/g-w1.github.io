function pressed() {
  let date = new Date();
  let oneDay = 24 * 60 * 60 * 1000;
  let secondDate = new Date(2019, 6, 22);
  let diffDays = Math.round(Math.abs((date - secondDate) / oneDay));
  let numberDone = Number(document.getElementById("input1").value);
  let numberBurpees = ((diffDays * 25) + 50 - numberDone);
  if (numberBurpees < 0) {
    numberBurpees = 0;
  }
  document.getElementById('output').innerHTML = numberBurpees;
  document.getElementById('output1').innerHTML = date;
}
pressed();
