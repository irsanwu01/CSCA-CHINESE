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


// =======================
// DETECT POINT P AND Q
// =======================

let match=text.match(/P\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*Q\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/)

if(!match){

canvas.style.display="none"

return

}

canvas.style.display="block"

let x1=parseFloat(match[1])
let y1=parseFloat(match[2])
let x2=parseFloat(match[3])
let y2=parseFloat(match[4])


// AUTO SCALE

let minX=Math.min(x1,x2)-1
let maxX=Math.max(x1,x2)+1
let minY=Math.min(y1,y2)-1
let maxY=Math.max(y1,y2)+1


chart=new Chart(canvas,{

type:'scatter',

data:{
datasets:[
{
label:"Line",
data:[
{x:x1,y:y1},
{x:x2,y:y2}
],
showLine:true,
pointRadius:6
}
]
},

options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{display:false}
},
scales:{
x:{min:minX,max:maxX},
y:{min:minY,max:maxY}
}
}

})

}



loadSet(1)
