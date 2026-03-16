let questions=[]
let current=0
let answers={}
let chart=null

const params = new URLSearchParams(window.location.search)
window.currentSet = parseInt(params.get("set")) || 1


async function checkAccess(){

let { data:{ user } } = await window.db.auth.getUser()

if(!user){
alert("Please login first")
location.href="login.html"
return false
}

let { data } = await window.db
.from("users")
.select("premium")
.eq("email", user.email)
.single()

if(window.currentSet==1) return true

if(window.currentSet>1 && !data?.premium){
alert("This set is Premium")
location.href="store.html"
return false
}

return true
}



async function loadSet(){

let allowed = await checkAccess()

if(!allowed) return

let res = await fetch("./questions/set"+window.currentSet+".json")

questions = await res.json()

showQuestion()

}



function showQuestion(){

let q=questions[current]

document.getElementById("title").innerText =
"Set "+window.currentSet+" | Question "+(current+1)+" / "+questions.length

document.getElementById("questionBox").innerHTML =
"<b>"+(current+1)+".</b> "+q.hanzi

renderOptions(q)
updateProgress()

}



function renderOptions(q){

let html=""

q.options.forEach((o,i)=>{

let checked = answers[current]==i ? "checked" : ""

html+=`
<label>
<input type="radio"
name="opt"
value="${i}"
${checked}
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



window.addEventListener("load", ()=>{
loadSet()
})
