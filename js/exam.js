let questions=[]
let current=0
let chart=null


async function loadSet(){

let res=await fetch("./questions/set1.json")
questions=await res.json()

showQuestion()

}


function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText=
"Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML=q.hanzi

renderOptions(q)

drawGraph(q.hanzi)

}


function renderOptions(q){

let html=""

q.options.forEach(o=>{
html+="<div>"+o+"</div>"
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



function drawGraph(text){

let canvas=document.getElementById("graph")

canvas.width=600
canvas.height=260

if(chart){
chart.destroy()
}


text=text.replace(/\*/g,"")



/* TWO POINTS */

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
scales:{
x:{min:-5,max:5},
y:{min:-5,max:5}
}
}
})

return
}



/* HYPERBOLA */

let hyper=text.match(/x.?2\/(\d+)\s*-\s*y.?2\/(\d+)/i)let hyper=text.match(/x[\^²2]?\/(\d+)\s*-\s*y[\^²2]?\/(\d+)/i)

if(!hyper) return

let a=Math.sqrt(hyper[1])
let b=Math.sqrt(hyper[2])

let data=[]

for(let x=a+0.05;x<=6;x+=0.05){

let y=b*Math.sqrt((x*x)/(a*a)-1)

data.push({x:x,y:y})
data.push({x:x,y:-y})
data.push({x:-x,y:y})
data.push({x:-x,y:-y})

}

chart=new Chart(canvas,{
type:'scatter',
data:{
datasets:[{
data:data,
showLine:false,
pointRadius:2,
backgroundColor:"purple"
}]
},
options:{
plugins:{legend:{display:false}},
scales:{
x:{min:-6,max:6},
y:{min:-6,max:6}
}
}
})

}



loadSet()
