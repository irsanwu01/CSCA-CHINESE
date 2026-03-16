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

autoDetectGraph(q.hanzi)

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

alert(
"Correct: "+correct+
"\nTotal: "+questions.length+
"\nScore: "+score+"%"
)

}





/* =========================
   EXAM TIMER
========================= */

let examTime=60*60

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
   AUTO GRAPH DETECTOR
========================= */

function autoDetectGraph(text){

const canvas=document.getElementById("graph")

let func=null

/* detect parabola */

if(text.includes("x²") || text.includes("x^2")){

func="x*x"

}

/* detect linear */

if(text.includes("3x")){

func="3*x"

}

/* detect sin */

if(text.includes("sin")){

func="Math.sin(x)"

}

/* detect cos */

if(text.includes("cos")){

func="Math.cos(x)"

}

if(!func){

canvas.style.display="none"
return

}

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
