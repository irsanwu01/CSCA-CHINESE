let questions=[]
let current=0
let answers={}
let chart=null

/* =============================
GET SET FROM URL
============================= */

const params = new URLSearchParams(window.location.search)
window.currentSet = parseInt(params.get("set")) || 1

/* =============================
LOAD QUESTIONS
============================= */

async function loadSet(){

try{

let res = await fetch("./questions/set"+window.currentSet+".json")

questions = await res.json()

showQuestion()

}catch(e){

console.error("Load error:",e)

}

}

/* =============================
SHOW QUESTION
============================= */

function showQuestion(){

let q = questions[current]

document.getElementById("title").innerText =
"Set "+window.currentSet+" | Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML =
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)
updateProgress()
drawGraph(q.hanzi)

}

/* =============================
OPTIONS
============================= */

function renderOptions(q){
