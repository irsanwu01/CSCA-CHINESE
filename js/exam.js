let questions=[]
let current=0
let answers={}
let chart=null

let timer=null
let seconds=0



async function loadSet(){

let res=await fetch("./questions/set1.json")
questions=await res.json()

startTimer()
showQuestion()

}



function startTimer(){

let select=document.getElementById("examTime")
if(!select) return

seconds=parseInt(select.value)*60

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

drawGraph(q.hanzi)

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



function drawGraph(text){

let canvas=document.getElementById("graph")

canvas.width=canvas.parentElement.offsetWidth
canvas.height=260

if(chart){
chart.destroy()
chart=null
}

text=text.replace(/\*/g,"")



/* ===== DETECT TWO POINTS ===== */

let coords=[...text.matchAll(/\((-?\d+)\s*,\s*(-?\d+)\)/g)]

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
maintainAspectRatio:false
}
})

return
}



/* ===== DETECT HYPERBOLA ===== */

let hyper=text.match(/x.?2\/(\d+)\s*-\s*y.?2\/(\d+)/i)

if(!hyper) return

let a=Math.sqrt(parseFloat(hyper[1]))
let b=Math.sqrt(parseFloat(hyper[2]))
let c=Math.sqrt(a*a+b*b)

let rightTop=[]
let rightBottom=[]
let leftTop=[]
let leftBottom=[]

for(let x=a+0.05;x<=6;x+=0.05){

let y=b*Math.sqrt((x*x)/(a*a)-1)

rightTop.push({x:x,y:y})
rightBottom.push({x:x,y:-y})

leftTop.push({x:-x,y:y})
leftBottom.push({x:-x,y:-y})

}

chart=new Chart(canvas,{
type:'scatter',

data:{
datasets:[

{
data:rightTop,
showLine:true,
borderColor:"purple",
pointRadius:0
},

{
data:rightBottom,
showLine:true,
borderColor:"purple",
pointRadius:0
},

{
data:leftTop,
showLine:true,
borderColor:"purple",
pointRadius:0
},

{
data:leftBottom,
showLine:true,
borderColor:"purple",
pointRadius:0
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
x:{min:-6,max:6,ticks:{stepSize:1}},
y:{min:-6,max:6,ticks:{stepSize:1}}
}
}

})



setTimeout(function(){

let ctx=chart.ctx
let xScale=chart.scales.x
let yScale=chart.scales.y

ctx.fillStyle="black"
ctx.font="12px Arial"

let px=xScale.getPixelForValue(c)
let py=yScale.getPixelForValue(0)

ctx.fillText("("+c+",0)",px+5,py-5)

let px2=xScale.getPixelForValue(-c)

ctx.fillText("("+(-c)+",0)",px2-40,py-5)

},200)

}



loadSet()
