let questions = []
let current = 0
let answers = {}
let chart = null

async function loadSet(n){

let file = "./questions/set"+n+".json"

console.log("loading",file)

let res = await fetch(file)

questions = await res.json()

current = 0

showQuestion()

}

function showQuestion(){

let q = questions[current]

document.getElementById("title").innerText =
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML = q.hanzi

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
</label><br>
`

})

document.getElementById("options").innerHTML = html

}

function saveAnswer(v){

answers[current] = v

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

let score = 0

questions.forEach((q,i)=>{

if(answers[i]==q.answer) score++

})

let percent = Math.round(score/questions.length*100)

alert("Score: "+percent+"%")

}

loadSet(1)
