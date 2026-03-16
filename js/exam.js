let questions=[]
let current=0
let answers={}
let chart=null



async function loadSet(){

let res=await fetch("./question/set"+window.currentSet+".json")
questions=await res.json()

showQuestion()

}



function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText=
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML=
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)

drawGraph(q.hanzi)

updateProgress()

}



function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked=answers[current]==i?"checked":""

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



function updateProgress(){

let p=(current+1)/questions.length*100
document.getElementById("progress").style.width=p+"%"

}



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


/* responsive size */

canvas.width = canvas.parentElement.clientWidth
canvas.height = 200


if(chart){
chart.destroy()
chart=null
}


/* CLEAN TEXT */

text=text
.replace(/\*/g,"")
.replace(/²/g,"^2")
.replace(/\s+/g," ")




/* =============================
   DETECT POINTS (SOAL 14)
============================= */

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



/* =============================
   DETECT HYPERBOLA (SOAL 15)
============================= */

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



/* =============================
   DRAW LABEL FOKUS
============================= */

setTimeout(()=>{

let ctx=chart.ctx
let xScale=chart.scales.x
let yScale=chart.scales.y

ctx.fillStyle="black"
ctx.font="12px Arial"

let px=xScale.getPixelForValue(c)
let py=yScale.getPixelForValue(0)

ctx.fillText("("+c+",0)",px+6,py-6)

let px2=xScale.getPixelForValue(-c)

ctx.fillText("("+(-c)+",0)",px2-35,py-6)

},200)

}



loadSet()
