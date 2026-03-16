let questions=[]
let current=0
let answers={}
let chart=null

let timer=null
let seconds=0


async function loadSet(n){

let res=await fetch("./questions/set"+n+".json")

questions=await res.json()

startTimer()

showQuestion()

}


function startTimer(){

let m=parseInt(document.getElementById("examTime").value)

seconds=m*60

if(timer) clearInterval(timer)

timer=setInterval(function(){

seconds--

let min=Math.floor(seconds/60)
let sec=seconds%60

if(sec<10) sec="0"+sec

document.getElementById("timer").innerText="Time: "+min+":"+sec

if(seconds<=0){

clearInterval(timer)

submitExam()

}

},1000)

}



function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText=
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML=
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)

renderDiagram(q.hanzi)

updateProgress()

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
</label>
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


// =================
// TWO POINTS
// =================

let p=text.match(/P\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*Q\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/)

if(p){

let x1=parseFloat(p[1])
let y1=parseFloat(p[2])
let x2=parseFloat(p[3])
let y2=parseFloat(p[4])

let minX=Math.min(x1,x2)-1
let maxX=Math.max(x1,x2)+1
let minY=Math.min(y1,y2)-1
let maxY=Math.max(y1,y2)+1

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
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}},
scales:{
x:{min:minX,max:maxX},
y:{min:minY,max:maxY}
}
}

})

return

}


// =================
// LINE y = ax + b
// =================

let line=text.match(/y\s*=\s*(-?\d*)x\s*([+-]\s*\d+)?/)

if(line){

let a=parseFloat(line[1]||1)
let b=parseFloat(line[2]||0)

let pts=[]

for(let x=-10;x<=10;x++){

pts.push({
x:x,
y:a*x+b
})

}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:pts,
showLine:true,
pointRadius:0
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}},
scales:{
x:{min:-10,max:10},
y:{min:-10,max:10}
}
}
})

return

}


// =================
// PARABOLA
// =================

let para=text.match(/y\s*=\s*(-?\d*)x²\s*([+-]\s*\d+)?x?\s*([+-]\s*\d+)?/)

if(para){

let a=parseFloat(para[1]||1)
let b=parseFloat(para[2]||0)
let c=parseFloat(para[3]||0)

let pts=[]

for(let x=-10;x<=10;x+=0.2){

pts.push({
x:x,
y:a*x*x+b*x+c
})

}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:pts,
showLine:true,
pointRadius:0
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}}
}
})

return

}


// =================
// CIRCLE
// =================

let circle=text.match(/x²\s*\+\s*y²\s*=\s*(\d+)/)

if(circle){

let r=Math.sqrt(parseFloat(circle[1]))

let pts=[]

for(let t=0;t<360;t+=5){

let rad=t*Math.PI/180

pts.push({
x:r*Math.cos(rad),
y:r*Math.sin(rad)
})

}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:pts,
showLine:true,
pointRadius:0
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}}
}
})

return

}


canvas.style.display="none"

}



loadSet(1)
