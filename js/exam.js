let questions=[]
let current=0
let answers=[]

let params=new URLSearchParams(location.search)
let set=params.get("set") || 1

fetch("questions/set"+set+".json")
.then(r=>r.json())
.then(data=>{

questions=data.slice(0,48)

createNav()

load()

showLeaderboard()

})

function createNav(){

let html=""

for(let i=0;i<48;i++){

html+=`<button id="nav${i}" onclick="goto(${i})">${i+1}</button>`

}

document.getElementById("nav").innerHTML=html

}

function goto(i){

current=i
load()

}

function load(){

startQuestionTimer()

let q=questions[current]

document.getElementById("title").innerText=
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML=q.hanzi

if(q.function){
drawAutoGraph(q.function)
}
else if(q.visual){
drawVisual(q.visual)
}
else{
document.getElementById("graph").style.display="none"
}

document.getElementById("progress").style.width=
((current+1)/questions.length*100)+"%"

let html=""

q.options.forEach((o,i)=>{

let disabled=""

if(answers[current]!=null) disabled="disabled"

html+=`<button ${disabled} onclick="select(${i})">${o}</button><br>`

})

document.getElementById("options").innerHTML=html

}

function select(i){

if(answers[current]!=null) return

answers[current]=i

document.getElementById("nav"+current).classList.add("answered")

next()

}

function next(){

if(current<questions.length-1){

current++
load()

}

}

function prev(){

if(current>0){

current--
load()

}

}

function submitExam(){

let correct=0

questions.forEach((q,i)=>{

if(answers[i]==q.answer) correct++

})

let score=Math.round(correct/questions.length*100)

saveScore(score)

alert(
"Correct: "+correct+
"\nTotal: "+questions.length+
"\nScore: "+score+"%"
)

showLeaderboard()

}







/* =========================
   EXAM TIMER
========================= */

let examTime=60*60

function startExamTimer(){

setInterval(()=>{

let m=Math.floor(examTime/60)
let s=examTime%60

document.getElementById("timer").innerText=
"Exam Time: "+m+":"+(s<10?"0"+s:s)

examTime--

if(examTime<0){

alert("Time is up")

submitExam()

}

},1000)

}

startExamTimer()








/* =========================
   QUESTION TIMER
========================= */

let questionTime=0
let qTimer

function startQuestionTimer(){

questionTime=0

clearInterval(qTimer)

qTimer=setInterval(()=>{

questionTime++

document.getElementById("qTimer").innerText=
"Time on this question: "+questionTime+"s"

},1000)

}








/* =========================
   GRAPH ENGINE
========================= */

function drawAutoGraph(func){

const canvas=document.getElementById("graph")

canvas.style.display="block"

let xs=[]
let ys=[]

for(let x=-10;x<=10;x+=0.5){

xs.push(x)

let y

try{

y=eval(func.replace(/x/g,"("+x+")"))

}catch{

y=null

}

ys.push(y)

}

new Chart(canvas,{

type:"line",

data:{
labels:xs,
datasets:[{
data:ys,
borderColor:"blue",
borderWidth:2,
fill:false
}]
},

options:{
responsive:false,
plugins:{legend:{display:false}}
}

})

}








/* =========================
   VISUAL ENGINE
========================= */

function drawVisual(v){

const canvas=document.getElementById("graph")

canvas.style.display="block"

let xs=[]
let ys=[]

if(v.type=="circle"){

for(let t=0;t<=360;t++){

let rad=t*Math.PI/180

let x=v.center[0]+v.r*Math.cos(rad)
let y=v.center[1]+v.r*Math.sin(rad)

xs.push(x)
ys.push(y)

}

}

if(v.type=="triangle"){

xs=[v.points[0][0],v.points[1][0],v.points[2][0],v.points[0][0]]
ys=[v.points[0][1],v.points[1][1],v.points[2][1],v.points[0][1]]

}

if(v.type=="vector"){

xs=[0,v.v[0]]
ys=[0,v.v[1]]

}

new Chart(canvas,{

type:"line",

data:{
labels:xs,
datasets:[{
data:ys,
borderColor:"red",
borderWidth:2,
fill:false
}]
},

options:{
responsive:false,
plugins:{legend:{display:false}}
}

})

}








/* =========================
   LEADERBOARD
========================= */

function saveScore(score){

let board=JSON.parse(localStorage.getItem("leaderboard")||"[]")

board.push(score)

board.sort((a,b)=>b-a)

board=board.slice(0,5)

localStorage.setItem("leaderboard",JSON.stringify(board))

}

function showLeaderboard(){

let board=JSON.parse(localStorage.getItem("leaderboard")||"[]")

let html=""

board.forEach((s,i)=>{

html+=(i+1)+". "+s+"%<br>"

})

document.getElementById("leaderboard").innerHTML=html

}








/* =========================
   SHARE SCORE
========================= */

function shareScore(){

let correct=answers.filter((a,i)=>a==questions[i].answer).length

let score=Math.round(correct/questions.length*100)

let text="I scored "+score+"% on CSCA Prep! Try it: https://irsanwu01.github.io/CSCA-CHINESE"

window.open("https://wa.me/?text="+encodeURIComponent(text))

}








/* =========================
   ANTI REFRESH
========================= */

window.onbeforeunload=function(){

return "Exam in progress"

}
