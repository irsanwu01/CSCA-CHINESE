let questions = []
let current = 0
let answers = {}
let chart = null

// TIMER
let examMinutes = 60
let remainingSeconds = examMinutes * 60
let timerInterval = null

async function loadSet(n){

let file = "./questions/set"+n+".json"

let res = await fetch(file)

questions = await res.json()

current = 0

startTimer()

showQuestion()

}

function startTimer(){

let select = document.getElementById("examTime")

if(select){
examMinutes = parseInt(select.value)
}

remainingSeconds = examMinutes * 60

if(timerInterval) clearInterval(timerInterval)

timerInterval = setInterval(updateTimer,1000)

}

function updateTimer(){

remainingSeconds--

let m = Math.floor(remainingSeconds/60)
let s = remainingSeconds % 60

if(s<10) s="0"+s

let el=document.getElementById("timer")

if(el){
el.innerText="Time: "+m+":"+s
}

if(remainingSeconds<=0){

clearInterval(timerInterval)

submitExam()

}

}

function showQuestion(){

let q = questions[current]

document.getElementById("title").innerText =
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML =
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)

renderDiagram(q.hanzi)

updateProgress()

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked = answers[current]==i ? "checked" : ""

html+=`
<label>
<input type="radio" name="opt"
value="${i}" ${checked}
onchange="saveAnswer(${i})">
${o}
</label><br>
`

})

document.getElementById("options").innerHTML=html

}

function saveAnswer(v){

answers[current]=v

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

let p=(current+1)/questions.length*100

document.getElementById("progress").style.width=p+"%"

}

function submitExam(){

let score=0

questions.forEach((q,i)=>{

if(answers[i]==q.answer) score++

})

let percent=Math.round(score/questions.length*100)

alert("Score: "+percent+"%")

}

// ========================
// GRAPH DIAGRAM SYSTEM
// ========================

function clearGraph(){

if(chart){

chart.destroy()

chart=null

}

}

function renderDiagram(text){

clearGraph()

let canvas=document.getElementById("graph")

if(!canvas) return

let p=text.match(/P\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*Q\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/)

if(!p){

canvas.style.display="none"

return

}

canvas.style.display="block"

let x1=parseFloat(p[1])
let y1=parseFloat(p[2])
let x2=parseFloat(p[3])
let y2=parseFloat(p[4])

chart=new Chart(canvas,{

type:'scatter',

data:{
datasets:[{
data:[
{x:x1,y:y1},
{x:x2,y:y2}
],
showLine:true,
pointRadius:6
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

loadSet(1)
