let questions=[]
let exam=[]
let answers={}
let current=0
let chart=null
let timeLeft=3600

// =====================
// LOAD ALL SETS
// =====================

async function loadExam(){

let all=[]

for(let i=1;i<=10;i++){

let res=await fetch("data/fixed_set"+i+".json")
let data=await res.json()

all=all.concat(data)

}

shuffle(all)

exam=all.slice(0,48)

showQuestion()
startTimer()

}

// =====================
// SHUFFLE
// =====================

function shuffle(arr){

for(let i=arr.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))
[arr[i],arr[j]]=[arr[j],arr[i]]

}

}

// =====================
// SHOW QUESTION
// =====================

function showQuestion(){

let q=exam[current]

document.getElementById("title").innerText=
"Question "+(current+1)+" / "+exam.length

document.getElementById("questionBox").innerHTML=q.hanzi

renderOptions(q)
renderDiagram(q.hanzi)

updateProgress()

}

// =====================
// OPTIONS
// =====================

function renderOptions(q){

let html=""

let opts=[...q.options]

shuffle(opts)

opts.forEach((o,i)=>{

let checked=answers[current]==o?"checked":""

html+=`
<label>
<input type="radio"
value="${o}"
${checked}
onchange="saveAnswer('${o}')">
${o}
</label><br>
`

})

document.getElementById("options").innerHTML=html

}

function saveAnswer(v){

answers[current]=v

}

// =====================
// NAVIGATION
// =====================

function next(){

if(current<exam.length-1){

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

// =====================
// PROGRESS BAR
// =====================

function updateProgress(){

let p=(current+1)/exam.length*100

document.getElementById("progress").style.width=p+"%"

}

// =====================
// TIMER
// =====================

function startTimer(){

setInterval(()=>{

timeLeft--

let m=Math.floor(timeLeft/60)
let s=timeLeft%60

document.getElementById("timer").innerText=
m+":"+("0"+s).slice(-2)

if(timeLeft<=0){

submitExam()

}

},1000)

}

// =====================
// SUBMIT
// =====================

function submitExam(){

let score=0

exam.forEach((q,i)=>{

if(answers[i]==q.options[q.answer]) score++

})

let percent=Math.round(score/exam.length*100)

alert("Score: "+percent+"%")

}

// =====================
// GRAPH ENGINE
// =====================

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

// DISTANCE GRAPH

let p=text.match(/P\((-?\d+),\s*(-?\d+)\).*Q\((-?\d+),\s*(-?\d+)\)/)

if(p){

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
showLine:true
}]
},
options:{
plugins:{legend:{display:false}},
scales:{x:{min:-10,max:10},y:{min:-10,max:10}}
}
})

return
}

// LINE

let line=text.match(/y\s*=\s*([-\d\.]+)x\s*([+\-]\s*\d+)?/)

if(line){

let m=parseFloat(line[1])
let b=parseFloat(line[2]||0)

let pts=[]

for(let x=-10;x<=10;x++)
pts.push({x:x,y:m*x+b})

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

return
}

// PARABOLA

let parabola=text.match(/y\s*=\s*([-\d]*)x²\s*([+\-]\s*\d+)?x?\s*([+\-]\s*\d+)?/)

if(parabola){

let a=parseFloat(parabola[1]||1)
let b=parseFloat(parabola[2]||0)
let c=parseFloat(parabola[3]||0)

let pts=[]

for(let x=-10;x<=10;x+=0.5)
pts.push({x:x,y:a*x*x+b*x+c})

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

return
}

// CIRCLE

let circle=text.match(/x²\s*\+\s*y²\s*=\s*(\d+)/)

if(circle){

let r=Math.sqrt(circle[1])

let pts=[]

for(let t=0;t<=360;t+=5){

let rad=t*Math.PI/180

pts.push({
x:r*Math.cos(rad),
y:r*Math.sin(rad)
})

}

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

return
}

// SIN COS

if(text.includes("sin")){

let pts=[]

for(let x=-10;x<=10;x+=0.1)
pts.push({x:x,y:Math.sin(x)})

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

}

if(text.includes("cos")){

let pts=[]

for(let x=-10;x<=10;x+=0.1)
pts.push({x:x,y:Math.cos(x)})

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

}

}

// START

loadExam()
