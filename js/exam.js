let questions=[]
let current=0
let answers={}
let chart=null

async function loadSet(set){

let res=await fetch("data/fixed_set"+set+".json")
questions=await res.json()

current=0
showQuestion()

}

function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText =
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML=q.hanzi

renderOptions(q)
renderDiagram(q.hanzi)

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked=answers[current]==i?"checked":""

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

function submitExam(){

let score=0

questions.forEach((q,i)=>{
if(answers[i]==q.answer) score++
})

let percent=Math.round(score/questions.length*100)

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

const canvas=document.getElementById("graph")
if(!canvas) return

// =======================
// DETECT POINT DISTANCE
// =======================

let pMatch=text.match(/P\((-?\d+),\s*(-?\d+)\).*Q\((-?\d+),\s*(-?\d+)\)/)

if(pMatch){

let x1=parseFloat(pMatch[1])
let y1=parseFloat(pMatch[2])
let x2=parseFloat(pMatch[3])
let y2=parseFloat(pMatch[4])

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

// =======================
// PARABOLA
// =======================

let parabola=text.match(/y\s*=\s*([-\d]*)x²\s*([+\-]\s*\d+)?x?\s*([+\-]\s*\d+)?/)

if(parabola){

let a=parseFloat(parabola[1]||1)
let b=parseFloat(parabola[2]||0)
let c=parseFloat(parabola[3]||0)

let pts=[]

for(let x=-10;x<=10;x+=0.5){
pts.push({x:x,y:a*x*x+b*x+c})
}

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]},
options:{plugins:{legend:{display:false}}}
})

return
}

// =======================
// LINE
// =======================

let line=text.match(/y\s*=\s*([-\d\.]+)x\s*([+\-]\s*\d+)?/)

if(line){

let m=parseFloat(line[1])
let b=parseFloat(line[2]||0)

let pts=[]

for(let x=-10;x<=10;x++){
pts.push({x:x,y:m*x+b})
}

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

return
}

// =======================
// CIRCLE
// =======================

let circle=text.match(/x²\s*\+\s*y²\s*=\s*(\d+)/)

if(circle){

let r=Math.sqrt(parseFloat(circle[1]))

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
data:{datasets:[{data:pts,showLine:true}]},
options:{plugins:{legend:{display:false}}}
})

return
}

// =======================
// SIN GRAPH
// =======================

if(text.includes("sin")){

let pts=[]

for(let x=-10;x<=10;x+=0.1){
pts.push({x:x,y:Math.sin(x)})
}

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

return
}

// =======================
// COS GRAPH
// =======================

if(text.includes("cos")){

let pts=[]

for(let x=-10;x<=10;x+=0.1){
pts.push({x:x,y:Math.cos(x)})
}

chart=new Chart(canvas,{
type:'scatter',
data:{datasets:[{data:pts,showLine:true}]}
})

}

}

loadSet(1)
