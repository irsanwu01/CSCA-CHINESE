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
// DETECT TRIANGLE
// =================

let tri=text.match(/A\(([-\d]+),([-\d]+)\).*B\(([-\d]+),([-\d]+)\).*C\(([-\d]+),([-\d]+)\)/)

if(tri){

let A={x:+tri[1],y:+tri[2]}
let B={x:+tri[3],y:+tri[4]}
let C={x:+tri[5],y:+tri[6]}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:[A,B,C,A],
showLine:true,
pointRadius:6
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
// DETECT VECTOR
// =================

let vec=text.match(/向量\s*\(([-\d]+),([-\d]+)\)/)

if(vec){

let x=+vec[1]
let y=+vec[2]

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:[
{x:0,y:0},
{x:x,y:y}
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
x:{min:-10,max:10},
y:{min:-10,max:10}
}
}
})

return

}



// =================
// TWO POINTS
// =================

let pq=text.match(/P\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*Q\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/)

if(pq){

let P={x:+pq[1],y:+pq[2]}
let Q={x:+pq[3],y:+pq[4]}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:[P,Q],
showLine:true,
pointRadius:6
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
// LINE y = ax + b
// =================

let line=text.match(/y\s*=\s*(-?\d*)x\s*([+-]\s*\d+)?/)

if(line){

let a=parseFloat(line[1]||1)
let b=parseFloat(line[2]||0)

let pts=[]

for(let x=-10;x<=10;x++){

pts.push({x:x,y:a*x+b})

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
maintainAspectRatio:false
}
})

return

}



// =================
// PARABOLA
// =================

let para=text.match(/y\s*=\s*(-?\d*)x²/)

if(para){

let pts=[]

for(let x=-10;x<=10;x+=0.2){

pts.push({x:x,y:x*x})

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
maintainAspectRatio:false
}
})

return

}



canvas.style.display="none"

}



loadSet(1)
