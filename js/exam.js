let questions=[]
let current=0
let answers={}
let chart=null


/* =============================
   GET SET FROM URL
============================= */

const params = new URLSearchParams(window.location.search)
window.currentSet = parseInt(params.get("set")) || 1



/* =============================
   CHECK ACCESS
============================= */

async function checkAccess(){

let { data:{ user } } = await window.db.auth.getUser()

if(!user){

alert("Please login first")
location.href="login.html"
return false

}

let { data } = await window.db
.from("users")
.select("premium")
.eq("email", user.email)
.single()


/* FREE SET */

if(window.currentSet==1){
return true
}


/* PREMIUM SET */

if(window.currentSet>1 && !data?.premium){

alert("This set is Premium")
location.href="store.html"
return false

}

return true

}



/* =============================
   LOAD QUESTIONS
============================= */

async function loadSet(){

let allowed = await checkAccess()

if(!allowed) return

let res = await fetch("./questions/set"+window.currentSet+".json")

questions = await res.json()

showQuestion()

}



/* =============================
   SHOW QUESTION
============================= */

function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText =
"Set "+window.currentSet+" | Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML =
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)
drawGraph(q.hanzi)
updateProgress()

}



/* =============================
   OPTIONS
============================= */

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked = answers[current]==i ? "checked" : ""

html+=`
<label>
<input type="radio"
name="opt"
value="${i}"
${checked}
onchange="answers[current]=${i}">
${o}
</label><br>
`

})

document.getElementById("options").innerHTML=html

}



/* =============================
   NAVIGATION
============================= */

function next(){

if(current<questions.length-1){
current++
showQuestion()
}

}

function prev(){

if(current>0){
current--
showQuestion()
}

}



/* =============================
   PROGRESS
============================= */

function updateProgress(){

let p=(current+1)/questions.length*100
document.getElementById("progress").style.width=p+"%"

}



/* =============================
   SUBMIT
============================= */

function submitExam(){

let score=0

questions.forEach((q,i)=>{
if(answers[i]==q.answer) score++
})

alert("Score: "+score+" / "+questions.length)

}



/* =============================
   GRAPH ENGINE
============================= */

function drawGraph(text){

let canvas=document.getElementById("graph")

if(!canvas) return

let ctx = canvas.getContext("2d")

canvas.width = canvas.parentElement.clientWidth
canvas.height = 200

if(chart){
chart.destroy()
chart=null
}

text=text
.replace(/\*/g,"")
.replace(/²/g,"^2")
.replace(/\s+/g," ")

let coords=[...text.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)]

if(coords.length>=2){

let x1=parseFloat(coords[0][1])
let y1=parseFloat(coords[0][2])

let x2=parseFloat(coords[1][1])
let y2=parseFloat(coords[1][2])

chart=new Chart(ctx,{
type:'scatter',

data:{
datasets:[{
data:[
{x:x1,y:y1},
{x:x2,y:y2}
],
showLine:true,
borderColor:"blue",
pointRadius:6
}]
},

options:{
plugins:{legend:{display:false}},
responsive:true,
maintainAspectRatio:false,
scales:{
x:{min:-5,max:5},
y:{min:-5,max:5}
}
}

})

}

}



/* =============================
   START
============================= */

window.addEventListener("load", ()=>{
loadSet()
})
