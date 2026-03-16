let questions = []
let current = 0
let answers = []

let params = new URLSearchParams(location.search)
let set = params.get("set") || 1

// load question set
fetch("questions/set"+set+".json")
.then(r => r.json())
.then(data => {
    questions = data
    load()
})

// load question
function load(){

    let q = questions[current]

    document.getElementById("title").innerText =
    "Question " + (current + 1)

    // soal + gambar
    let questionHTML = q.hanzi

    if(q.image){
        questionHTML +=
        "<br><img src='"+q.image+"' style='max-width:100%;height:auto;margin-top:10px'>"
    }

    document.getElementById("questionBox").innerHTML = questionHTML

    // pilihan jawaban
    let optionsHTML = ""

    q.options.forEach((o,i)=>{

        let checked = ""

        if(answers[current] == i){
            checked = "style='background:#ffe082'"
        }

        optionsHTML +=
        `<button ${checked} onclick="select(${i})">${o}</button><br>`

    })

    document.getElementById("options").innerHTML = optionsHTML

}

// pilih jawaban
function select(i){

    answers[current] = i

    load()

}

// next question
function next(){

    if(current < questions.length - 1){

        current++

        load()

    }

}

// previous question
function prev(){

    if(current > 0){

        current--

        load()

    }

}

// submit exam
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
    "\nScore : " + score
    )

}
