async function register(){

let email=document.getElementById("email").value
let password=document.getElementById("password").value

let {data,error}=await window.db.auth.signUp({
email:email,
password:password
})

if(error){
alert(error.message)
return
}

alert("Register success")
window.location="login.html"

}



async function login(){

let email=document.getElementById("email").value
let password=document.getElementById("password").value

let {data,error}=await window.db.auth.signInWithPassword({
email:email,
password:password
})

if(error){
alert(error.message)
return
}

window.location="exam.html"

}



async function logout(){

await window.db.auth.signOut()

window.location="login.html"

}
