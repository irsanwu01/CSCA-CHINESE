let questions=[]
let current=0
let answers={}
let chart=null


/* =============================
   GET SET FROM URL
============================= */

const params = new URLSearchParams(window.location.search)

let setParam = parseInt(params.get("set")) || 1

window.currentSet = setParam


/* =============================
   CHECK USER ACCESS
============================= */

async function checkAccess(){

let { data:{ user } } = await db.auth.getUser()

if(!user){

alert("Please login first")

location.href="login.html"

return false

}

let { data } = await db
.from("users")
.select("premium")
.eq("email", user.email)
.single()

if(window.currentSet>1 && !data?.premium){

alert("Set "+window.currentSet+" is Premium")

location.href="store.html"

return false

}

return true

}


/* =============================
   LOAD QUESTION SET
============================= */

async function loadSet(){

let allowed = await checkAccess()

if(!allowed) return

try{

let res = await fetch("./questions/set"+window.currentSet+".json")

if(!res.ok){

throw new Error("Question file missing")

}

questions = await res.json()

showQuestion()

}catch(e){

console.error(e)

document.getElementById("questionBox").innerHTML=
"<b>Error loading questions</b>"

}

}


/* =============================
   SHOW QUESTION
============================= */

function showQuestion(){

let q = questions[current]

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

let checked = answers[current]==i ? "checked":""

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
   PROGRESS BAR
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

chart=new Chart(canvas,{
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

return

}


/* HYPERBOLA DETECTION */

let hyper=text.match(/x\^?2\/(\d+)\s*-\s*y\^?2\/(\d+)/i)

if(!hyper) return

let a=Math.sqrt(parseFloat(hyper[1]))
let b=Math.sqrt(parseFloat(hyper[2]))
let c=Math.sqrt(a*a+b*b)

let right=[]
let left=[]

for(let x=a+0.05;x<=6;x+=0.05){

let y=b*Math.sqrt((x*x)/(a*a)-1)

right.push({x:x,y:y})
right.push({x:x,y:-y})

left.push({x:-x,y:y})
left.push({x:-x,y:-y})

}

chart=new Chart(canvas,{
type:'scatter',

data:{
datasets:[

{
data:right,
backgroundColor:"purple",
pointRadius:2
},

{
data:left,
backgroundColor:"purple",
pointRadius:2
},

{
data:[
{x:c,y:0},
{x:-c,y:0}
],
backgroundColor:"blue",
pointRadius:6
}

]

},

options:{
plugins:{legend:{display:false}},
responsive:true,
maintainAspectRatio:false,
scales:{
x:{min:-6,max:6},
y:{min:-6,max:6}
}
}

})

}


/* =============================
   START EXAM
============================= */

loadSet()
