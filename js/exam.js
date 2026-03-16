let questions = []
let current = 0
let answers = []

const label = ["A","B","C","D"]

let params = new URLSearchParams(location.search)
let set = params.get("set") || 1

fetch("questions/set"+set+".json")
.then(r=>r.json())
.then(data=>{
questions = data.slice(0,48)
load()
})

function load(){

if(!questions.length) return

let q = questions[current]

document.getElementById("title").innerText =
"Question " + (current+1) + " / " + questions.length

let html = q.hanzi

if(q.image){

html += "<br><img src='"+q.image+"' style='max-width:420px;margin-top:10px'>"

}

document.getElementById("questionBox").innerHTML = html

let opt=""

q.options.forEach((o,i)=>{

let selected = ""

if(answers[current] == i){
selected = "style='background:#ffe082'"
}

opt += `<button ${selected} onclick="select(${i})">${label[i]}. ${o}</button><br>`

})

document.getElementById("options").innerHTML = opt

}

function select(i){

answers[current] = i

if(current < questions.length-1){

current++

load()

}else{

load()

}

}

function next(){

if(current < questions.length-1){

current++

load()

}

}

function prev(){

if(current > 0){

current--

load()

}

}

function submitExam(){

let correct = 0

questions.forEach((q,i)=>{

if(answers[i] == q.answer){
correct++
}

})

let score = Math.round((correct / questions.length) * 100)

alert(
"Correct : " + correct +
"\nTotal : " + questions.length +
"\nScore : " + score + "%"
)

}
