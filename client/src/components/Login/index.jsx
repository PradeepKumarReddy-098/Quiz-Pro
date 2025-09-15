import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast } from "react-hot-toast";
import "./index.css";

function LoginSignupForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [registerEmail,setRegisterEmail] = useState('')
  const [registerPassword,setRegisterPassword] = useState('')
  const [isLoading,setIsloading] = useState(false)
  const navigate = useNavigate()


  const handleLogin = async(e) =>{
    e.preventDefault()
    setIsloading(true)
    if(!email){
        return toast.error("Email is required*")
    }
    if(!password || password.length<8){
        return toast.error("Password is required and password length should atleast 8 characters")
    }

    try{
        const request = await fetch('https://quiz-pro-backend-2.onrender.com/api/user/login',
            {method:'POST',headers:{"Content-Type":'application/json'},body:JSON.stringify({email,password})});
        const response = await request.json()
        if (response.success){
            toast.success(response.message)
            localStorage.setItem('Quizz-Pro',response.token)
            navigate('/')
        }else{
            toast.error(response.message)
        }
        setEmail('')
        setPassword('')
    }catch(error){
        console.log(error.message)
        toast.error("Can't login please try after sometime")
    }finally{
      setIsloading(false)
    }
  }

  const handleSignUp = async(e) => {
    e.preventDefault()
    setIsloading(true)
    try{
        if (!registerEmail || !registerPassword || !name){
        return toast.error('All fields are required')
    }
    if(registerPassword.length<8){
        return toast.error('Password should be atleast 8 characters')
    }

    const request = await fetch('https://quiz-pro-backend-2.onrender.com/api/user/register',
        {method:'POST',headers:{"Content-Type":'application/json'},body:JSON.stringify({name,email:registerEmail,password:registerPassword})}
    );
    const response = await request.json()
    //console.log(response)
    if(response.success){
        toast.success(response.message)
        toast(
  "Account Created Successfully.\n\n Please login to access the Quizz Pro game.\n\n",
  {
    duration: 6000,
  }
);
    }else{
        toast.error(response.message)
    }
    }catch(error){
        console.log(error.message)
        toast.error("Can't signup. Please try after sometime")
    }finally{
      setIsloading(true)
    }
  }

  return (
    <div className="login-signup-container">
    <div className="form-container">
        <h2>Welcome to QuizPro</h2>
      <h2 className="form-title">{isLogin?"Login":"Sign Up"}</h2>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-btn ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>
      {isLogin ? (
        <form className="form-content">
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit" onClick={handleLogin} disabled={isLoading}>
            {isLoading?"Loading...":"Login"}
          </button>
          <div className="form-footer">
            Not a member?{" "}
            <span
              className="toggle-link"
              onClick={() => setIsLogin(false)}
            >
              register now
            </span>
          </div>
        </form>
      ) : (
        <form className="form-content">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={registerEmail}
            onChange={(e)=>setRegisterEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={registerPassword}
            onChange={(e)=>setRegisterPassword(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit" onClick={handleSignUp} disabled={isLoading}>
            {isLoading?"Loading...":"Signup"}
          </button>
          <div className="form-footer">
            Already a member?{" "}
            <span
              className="toggle-link"
              onClick={() => setIsLogin(true)}
            >
              Login
            </span>
          </div>
        </form>
      )}
    </div>
    </div>
  );
}

export default LoginSignupForm;
