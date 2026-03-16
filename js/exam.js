console.log("exam.js loaded")

let questions=[]
let current=0
let answers={}
let chart=null

async function loadQuestions(){

let all=[]

for(let i=1;i<=10;i++){

let files=[
`./questions/set${i}.json`,
`./questions/set0${i}.json`
]

for(let file of files){

try{

let res=await fetch(file)

if(!res.ok) continue

let data=await res.json()

console.log("Loaded:",file)

all=all.concat(data)

break

}catch(e){

console.log("Fail:",file)

}

}

}

questions=all

if(questions.length==0){

console.error("No questions loaded")
return

}

current=0
showQuestion()

}

function showQuestion(){

let q=questions[current]

document.getElementById("questionBox").innerHTML=q.hanzi

renderOptions(q)

updateProgress()

}

function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked=answers[current]==i?"checked":""

html+=`
<label>
<input type="radio"
value="${i}"
${checked}
onchange="saveAnswer(${i})">
${o}
</label><br>
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

let bar=document.getElementById("progress")

if(bar) bar.style.width=p+"%"

}

function submitExam(){

let score=0

questions.forEach((q,i)=>{

if(answers[i]==q.answer) score++

})

let percent=Math.round(score/questions.length*100)

alert("Score: "+percent+"%")

}

loadQuestions()
