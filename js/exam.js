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

setTimeout(()=>renderDiagram(q.hanzi),100)

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

html+=`
<label>
<input type="radio" name="opt">
${o}
</label>
`

})

document.getElementById("options").innerHTML=html

}

function renderDiagram(text){

console.log("diagram text:",text)

let canvas=document.getElementById("graph")

if(!canvas){
console.log("canvas not found")
return
}

if(chart){
chart.destroy()
}

text=text.replace(/\*/g,"")

// detect coordinates

let coords=[...text.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)]

if(coords.length>=2){

let x1=parseFloat(coords[0][1])
let y1=parseFloat(coords[0][2])
let x2=parseFloat(coords[1][1])
let y2=parseFloat(coords[1][2])

console.log("coords:",x1,y1,x2,y2)

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
scales:{
x:{min:-5,max:5},
y:{min:-5,max:5}
}
}
})

return
}

// detect hyperbola

let hyper=text.match(/x²\/(\d+)\s*-\s*y²\/(\d+)/)

if(hyper){

let a=Math.sqrt(parseFloat(hyper[1]))
let b=Math.sqrt(parseFloat(hyper[2]))

console.log("hyperbola:",a,b)

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
