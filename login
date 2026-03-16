<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Login</title>
</head>

<body>

<h2>Login</h2>

<input id="email" placeholder="Email"><br><br>
<input id="password" type="password" placeholder="Password"><br><br>

<button onclick="login()">Login</button>

<p>
No account?
<a href="register.html">Register</a>
</p>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script src="js/config.js"></script>
<script src="js/auth.js"></script>

</body>
</html>
