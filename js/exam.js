let questions = []
let current = 0
let answers = {}
let chart = null

let timeLeft = 3600
let timerInterval

async function loadSet(n){

let file = "./questions/set"+n+".json"

let res = await fetch(file)

questions = await res.json()

current = 0

showQuestion()

startTimer()

}

function showQuestion(){

let q = questions[current]

document.getElementById("title").innerText =
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML =
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)

updateProgress()

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked = answers[current]==i ? "checked" : ""

html += `
<label>
<input type="radio" name="opt"
value="${i}" ${checked}
onchange="saveAnswer(${i})">
${o}
</label>
`

})

document.getElementById("options").innerHTML = html

}

function saveAnswer(v){

answers[current] = v

localStorage.setItem("answers",JSON.stringify(answers))

}

function next(){

if(current < questions.length-1){

current++

showQuestion()

}

}

function prev(){

if(current > 0){

current--

showQuestion()

}

}

function updateProgress(){

let p = (current+1)/questions.length*100

document.getElementById("progress").style.width = p+"%"

}

function submitExam(){

clearInterval(timerInterval)

let score = 0

questions.forEach((q,i)=>{

if(answers[i]==q.answer) score++

})

let percent = Math.round(score/questions.length*100)

alert("Score: "+percent+"%")

localStorage.removeItem("answers")

}

function startTimer(){

let minutes = document.getElementById("examTime").value

timeLeft = minutes * 60

timerInterval = setInterval(()=>{

timeLeft--

let m = Math.floor(timeLeft/60)
let s = timeLeft%60

document.getElementById("timer").innerText =
"Time: "+m+":"+(s<10?"0":"")+s

if(timeLeft<=0){

clearInterval(timerInterval)

alert("Time up!")

submitExam()

}

},1000)

}

loadSet(1)
