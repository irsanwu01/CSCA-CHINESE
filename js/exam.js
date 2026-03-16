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


// bersihkan format
text=text.replace(/\*/g,"")



// =====================
// DETECT COORDINATES
// =====================

let coords=[...text.matchAll(/\((-?\d+)\s*,\s*(-?\d+)\)/g)]

if(coords.length>=2){

let x1=+coords[0][1]
let y1=+coords[0][2]

let x2=+coords[1][1]
let y2=+coords[1][2]

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



// =====================
// DETECT HYPERBOLA
// =====================

let hyper=text.match(/x²\/(\d+)\s*-\s*y²\/(\d+)/)

if(hyper){

let a=Math.sqrt(+hyper[1])
let b=Math.sqrt(+hyper[2])

let pts=[]

for(let x=-6;x<=6;x+=0.1){

let y=Math.sqrt((x*x)/(a*a)-1)*b

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
