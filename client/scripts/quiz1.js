function check() {
  var c = 0;
  var q1 = document.quiz.question1.value;
  var q2 = document.quiz.question2.value;
  var q3 = document.quiz.question3.value;
  var q4 = document.quiz.question4.value;
  var q5 = document.quiz.question5.value;
  var q6 = document.quiz.question6.value;
  var q7 = document.quiz.question7.value;
  var q8 = document.quiz.question8.value;
  var q9 = document.quiz.question9.value;
  var q10 = document.quiz.question10.value;
  var result = document.getElementById("result");
  var quiz = document.getElementById("quiz");
  if (q1 == "Ghepardul") {
    c++;
  }
  if (q2 == "Nas") {
    c++;
  }
  if (q3 == "Vulturul Pleșuv") {
    c++;
  }
  if (q4 == "Fluture") {
    c++;
  }
  if (q5 == "Hipopotam") {
    c++;
  }
  if (q6 == "Clovn") {
    c++;
  }
  if (q7 == "3500") {
    c++;
  }
  if (q8 == "Vrăjitoare") {
    c++;
  }
  if (q9 == "Madagascar") {
    c++;
  }
  if (q10 == "Vidrele de mare") {
    c++;
  }
  quiz.style.display = "none";

  if (c <= 5) {
    result.textContent =
      "Din păcate nu ai reușit să obți premiul. Poate altădată ;)";
  } else {
    result.textContent =
      " Minunat! Ai obținut un voucher de 15% reducere la o cumpărătură la unul dintre magazinele noastre. ";
  }
}
