let questions = []
let current = 0
let answers = []

let params = new URLSearchParams(location.search)
let set = params.get("set") || 1

fetch("questions/set"+set+".json")
.then(r => r.json())
.then(data => {

questions = data
load()

})

function load(){

if(!questions.length) return

let q = questions[current]

document.getElementById("title").innerText =
"Question " + (current+1)

let html = q.hanzi

if(q.image){
html += "<br><img src='"+q.image+"' style='max-width:400px'>"
}

document.getElementById("questionBox").innerHTML = html

let opt=""

q.options.forEach((o,i)=>{

opt += `<button onclick="select(${i})">${o}</button><br>`

})

document.getElementById("options").innerHTML = opt

}

function select(i){
answers[current] = i
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
if(answers[i]==q.answer) correct++
})

alert("Score: "+correct+" / "+questions.length)

}
