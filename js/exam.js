let questions = []
let current = 0
let answers = {}
let chart = null

async function loadQuestions(){

let all = []

for(let i=1;i<=10;i++){

let names = [
"./questions/set"+i+".json",
"./questions/set0"+i+".json"
]

let loaded=false

for(let file of names){

try{

let res = await fetch(file)

if(res.ok){

let data = await res.json()

all = all.concat(data)

loaded=true

console.log("loaded",file)

break

}

}catch(e){}

}

if(!loaded){

console.log("set not found",i)

}

}

questions = all

current = 0

showQuestion()

}

function showQuestion(){

if(questions.length==0) return

let q = questions[current]

document.getElementById("title").innerText =
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML = q.hanzi

renderOptions(q)

renderDiagram(q.hanzi)

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

function clearGraph(){

if(chart){

chart.destroy()
chart=null

}

}

function renderDiagram(text){

clearGraph()

const canvas = document.getElementById("graph")

if(!canvas) return

let p = text.match(/P\((-?\d+),\s*(-?\d+)\).*Q\((-?\d+),\s*(-?\d+)\)/)

if(p){

let x1 = parseFloat(p[1])
let y1 = parseFloat(p[2])
let x2 = parseFloat(p[3])
let y2 = parseFloat(p[4])

chart = new Chart(canvas,{

type:'scatter',

data:{
datasets:[{
data:[
{x:x1,y:y1},
{x:x2,y:y2}
],
showLine:true
}]
},

options:{
plugins:{legend:{display:false}},
scales:{
x:{min:-10,max:10},
y:{min:-10,max:10}
}
}

})

}

}

loadQuestions()
