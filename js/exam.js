let questions=[]
let current=0
let answers={}
let chart=null

async function loadSet(n){

let res=await fetch("./questions/set"+n+".json")
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

drawDiagram(q.hanzi)

updateProgress()

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked=answers[current]==i?"checked":""

html+=`
<label>
<input type="radio" name="opt" value="${i}" ${checked}
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

alert("Score: "+score+"/"+questions.length)

}

function drawDiagram(text){

let canvas=document.getElementById("graph")

if(!canvas) return

if(chart) chart.destroy()

text=text.replace(/\*/g,"")


// cari koordinat

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
pointRadius:6
}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
})

return
}


// hiperbola

let hyper=text.match(/x²\/(\d+)\s*-\s*y²\/(\d+)/)

if(hyper){

let a=Math.sqrt(parseFloat(hyper[1]))
let b=Math.sqrt(parseFloat(hyper[2]))

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
maintainAspectRatio:false
}
})

}

}

loadSet(1)
