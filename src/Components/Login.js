import React, { useState } from "react";
import NCLogo from "../logo/NCLogo.png";
import downIcon from "../logo/downIcon.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// import bcrypt from 'bcryptjs';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const firebaseConfig = {
    apiKey: "AIzaSyA9QV0wpyyAWR6D8TSeGUxrLbhxDKfoWdE",
    authDomain: "quizapp-6944e.firebaseapp.com",
    projectId: "quizapp-6944e",
    storageBucket: "quizapp-6944e.appspot.com",
    messagingSenderId: "205154776820",
    appId: "1:205154776820:web:8123eb3bcf93c344b810a1",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const handleLogin = async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const auth = getAuth(app);


  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       const user = result.user;
  //       const email = user.email;
  //       axios.post('http://localhost:5000/api/v1/login', { email: email })
  //         .then((response) => {
  //           const { token, user } = response.data;
  //           localStorage.setItem('token', token);
  //           localStorage.setItem('role', user.role);
  //           // check if the user has admin role
  //           if (user.role === 'admin') {
  //             navigate('/admin/home');
  //           }else if (user.role === 'user') { // add this condition
  //             navigate('/user/dashboard'); // navigate to user dashboard
  //           }
  //         })
  //         .catch(() => {
  //           setErrorMessage('Invalid email id');
  //         });
  //     })
  //     .catch(() => {
  //       setErrorMessage('Failed to login with Google');
  //     });

  // }
  signInWithPopup(auth, provider)
  .then(async (result) => {
    const token = await result.user.getIdToken();
    const email = result.user.email;

    axios
      .post(
        'http://localhost:5000/api/v1/login',
        { email: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { token, user, claims } = response.data;
        console.log(user,"user data")
        console.log("response",response.data)
        localStorage.setItem('token', token);
        localStorage.setItem('claims', claims);
        if (claims.admin)
        // if (user.role === 'admin')
        {
          navigate('/admin/home');
         

         }
          // else if(user.role==='user')
        else if(claims.user) {
          navigate('/user');
        }
      })
      .catch(() => {
        setErrorMessage('Invalid email id');
      });
  })
  .catch(() => {
    setErrorMessage('Failed to login with Google');
  });



    };

  return (
    <div>
      <div className=" flex flex-col justify-center items-center h-screen">
        <div className="flex justify-center items-center absolute top-10 ">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-gray-300 py-2 px-4 rounded-lg text-cyan-700 ">
              NATHCORP APTITUDE TEST
            </span>
          </h1>
        </div>

        <img
          src={NCLogo}
          alt="Logo"
          className="items-center rounded-full my-10 w-30 "
        />

        <p className="text-lg text-center my-8 flex items-center">
          To continue, Login with gmail id
          <img
            src={downIcon}
            className="mr-2 w-6 rounded-full ml-2"
            alt="img"
          ></img>
        </p>
        <div className="flex flex-col items-center">
          {errorMessage && (
            <div className="text-red-500 font-bold mb-4">{errorMessage}</div>
          )}

          <button
            className="bg-cyan-400 text-white border border-gray-400 rounded-md px-14 py-2 flex items-center"
            onClick={handleLogin}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="mr-2 w-6"
            />

            <p className="ml-2">Sign in with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
