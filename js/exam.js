let questions = []
let current = 0
let answers = {}
let chart = null

let timer = null
let seconds = 0


async function loadSet(){
  try{
    const res = await fetch("./questions/set1.json")
    questions = await res.json()
  }catch(e){
    console.log("Load error:", e)
    questions = []
  }

  startTimer()
  showQuestion()
}


function startTimer(){
  const select = document.getElementById("examTime")
  if(!select) return

  seconds = parseInt(select.value) * 60

  if(timer) clearInterval(timer)

  timer = setInterval(function(){

    seconds--

    const min = Math.floor(seconds/60)
    let sec = seconds % 60
    if(sec < 10) sec = "0"+sec

    const t = document.getElementById("timer")
    if(t) t.innerText = "Time: "+min+":"+sec

    if(seconds <= 0){
      clearInterval(timer)
      submitExam()
    }

  },1000)
}


function showQuestion(){
  if(questions.length === 0) return

  const q = questions[current]

  const title = document.getElementById("title")
  if(title) title.innerText = "Question "+(current+1)+" / "+questions.length

  const qbox = document.getElementById("questionBox")
  if(qbox) qbox.innerHTML = "<b>"+(current+1)+".</b> "+q.hanzi

  renderOptions(q)
  drawGraph(q.hanzi)
  updateProgress()
}


function renderOptions(q){
  let html = ""

  q.options.forEach((o,i)=>{
    const checked = answers[current]==i ? "checked" : ""

    html += `
    <label>
      <input type="radio" name="opt"
      value="${i}" ${checked}
      onchange="answers[current]=${i}">
      ${o}
    </label><br>`
  })

  const opt = document.getElementById("options")
  if(opt) opt.innerHTML = html
}


function next(){
  if(current < questions.length-1){
    current++
    showQuestion()
  }
}


function prev(){
  if(current > 0){
    current--
    showQuestion()
  }
}


function updateProgress(){
  const bar = document.getElementById("progress")
  if(!bar) return

  const p = (current+1)/questions.length*100
  bar.style.width = p + "%"
}


function submitExam(){
  let score = 0

  questions.forEach((q,i)=>{
    if(answers[i] == q.answer) score++
  })

  alert("Score: "+score+" / "+questions.length)
}


function drawGraph(text){

  const canvas = document.getElementById("graph")
  if(!canvas) return

  if(chart){
    chart.destroy()
    chart = null
  }

  text = text.replace(/\*/g,"")


  /* =====================
     DETECT TWO POINTS
  ===================== */

  const coords = [...text.matchAll(/\((-?\d+)\s*,\s*(-?\d+)\)/g)]

  if(coords.length >= 2){

    const x1 = parseFloat(coords[0][1])
    const y1 = parseFloat(coords[0][2])

    const x2 = parseFloat(coords[1][1])
    const y2 = parseFloat(coords[1][2])

    chart = new Chart(canvas,{
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



  /* =====================
     DETECT HYPERBOLA
  ===================== */

  const hyper = text.match(/x[\^²]2\/(\d+)\s*-\s*y[\^²]2\/(\d+)/)

  if(hyper){

    const a = Math.sqrt(parseFloat(hyper[1]))
    const b = Math.sqrt(parseFloat(hyper[2]))

    const rightTop=[]
    const rightBottom=[]
    const leftTop=[]
    const leftBottom=[]

    for(let x=a+0.01; x<=6; x+=0.05){

      const y = b*Math.sqrt((x*x)/(a*a)-1)

      rightTop.push({x:x,y:y})
      rightBottom.push({x:x,y:-y})

      leftTop.push({x:-x,y:y})
      leftBottom.push({x:-x,y:-y})
    }

    const c = Math.sqrt(a*a + b*b)

    chart = new Chart(canvas,{
      type:'scatter',
      data:{
        datasets:[

          {
            data:rightTop,
            showLine:true,
            borderColor:"purple",
            pointRadius:0,
            fill:false
          },

          {
            data:rightBottom,
            showLine:true,
            borderColor:"purple",
            pointRadius:0,
            fill:false
          },

          {
            data:leftTop,
            showLine:true,
            borderColor:"purple",
            pointRadius:0,
            fill:false
          },

          {
            data:leftBottom,
            showLine:true,
            borderColor:"purple",
            pointRadius:0,
            fill:false
          },

          {
            data:[
              {x:c,y:0},
              {x:-c,y:0}
            ],
            backgroundColor:"blue",
            pointRadius:6,
            showLine:false
          }

        ]
      },
      options:{
        plugins:{legend:{display:false}},
        responsive:true,
        maintainAspectRatio:false,
        scales:{
          x:{min:-6,max:6},
          y:{min:-6,max:6}
        }
      }
    })
  }
}


loadSet()
