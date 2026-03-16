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

// ====== DETECT TWO POINTS ======

let p=text.match(/P\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*Q\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/)

if(p){

let x1=parseFloat(p[1])
let y1=parseFloat(p[2])
let x2=parseFloat(p[3])
let y2=parseFloat(p[4])

let dx=x2-x1
let dy=y2-y1

let dist=Math.sqrt(dx*dx+dy*dy).toFixed(2)

let minX=Math.min(x1,x2)-1
let maxX=Math.max(x1,x2)+1
let minY=Math.min(y1,y2)-1
let maxY=Math.max(y1,y2)+1


chart=new Chart(canvas,{

type:'scatter',

data:{
datasets:[

{
label:'Line',
data:[
{x:x1,y:y1},
{x:x2,y:y2}
],
showLine:true,
pointRadius:6
},

{
type:'scatter',
data:[
{
x:(x1+x2)/2,
y:(y1+y2)/2
}
],
pointRadius:0
}

]

},

options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{display:false},
tooltip:{enabled:false}
},
scales:{
x:{min:minX,max:maxX},
y:{min:minY,max:maxY}
}
}

})

return

}


// ====== DETECT CIRCLE ======

let circle=text.match(/x²\s*\+\s*y²\s*=\s*(\d+)/)

if(circle){

let r=Math.sqrt(parseFloat(circle[1]))

let points=[]

for(let t=0;t<360;t+=5){

let rad=t*Math.PI/180

points.push({
x:r*Math.cos(rad),
y:r*Math.sin(rad)
})

}

chart=new Chart(canvas,{

type:'scatter',

data:{
datasets:[{
data:points,
showLine:true,
pointRadius:0
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}},
scales:{
x:{min:-r-1,max:r+1},
y:{min:-r-1,max:r+1}
}
}

})

return

}


// ====== DETECT ELLIPSE ======

let ellipse=text.match(/x²\/(\d+)\s*\+\s*y²\/(\d+)/)

if(ellipse){

let a=Math.sqrt(parseFloat(ellipse[1]))
let b=Math.sqrt(parseFloat(ellipse[2]))

let pts=[]

for(let t=0;t<360;t+=5){

let rad=t*Math.PI/180

pts.push({
x:a*Math.cos(rad),
y:b*Math.sin(rad)
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
x:{min:-a-1,max:a+1},
y:{min:-b-1,max:b+1}
}
}
})

return

}


// ====== DETECT HYPERBOLA ======

let hyper=text.match(/x²\/(\d+)\s*-\s*y²\/(\d+)/)

if(hyper){

let a=Math.sqrt(parseFloat(hyper[1]))
let b=Math.sqrt(parseFloat(hyper[2]))

let pts=[]

for(let x=-5;x<=5;x+=0.1){

let y=Math.sqrt((x*x/a/a-1))*b

if(!isNaN(y)){

pts.push({x:x,y:y})
pts.push({x:x,y:-y})

}

}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:pts,
showLine:false,
pointRadius:1
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{legend:{display:false}},
scales:{
x:{min:-6,max:6},
y:{min:-6,max:6}
}
}
})

return

}


canvas.style.display="none"

}



loadSet(1)
