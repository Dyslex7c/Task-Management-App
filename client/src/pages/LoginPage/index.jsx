import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    const navigate = useNavigate();
    const [pageType, setPageType] = useState("register");
    
    const [userData, setUserData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const register = async (values) => {
        const savedUserResponse = await fetch(
            "http://localhost:3001/api/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const savedUser = await savedUserResponse.json();
        
        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async (values) => {
        const loggedInResponse = await fetch(
            "http://localhost:3001/api/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const loggedIn = await loggedInResponse.json();
        
        if (loggedIn.user) {
            localStorage.setItem("token", loggedIn.token);
            const decoded = jwtDecode(loggedIn.token);
            localStorage.setItem("userid", decoded.id);
            navigate("/home");
        } else {
            console.log(loggedIn.msg);
        }
    };

    const handleFormSubmit = async () => {
        if (pageType === "login") await login(userData);
        if (pageType === "register") await register(userData);
    };
    
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", width: "300px" }}>
                <h2 style={{ textAlign: "center" }}>{pageType === "register" ? "Register" : "Login"}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {pageType === "register" && (
                        <>
                            <input
                                name="firstName"
                                placeholder='First Name'
                                onChange={handleInputChange}
                                style={{
                                    padding: "10px",
                                    fontSize: "16px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    width: "90%",
                                    transition: "border-color 0.3s",
                                }}
                            />
                            <input
                                name="lastName"
                                placeholder='Last Name'
                                onChange={handleInputChange}
                                style={{
                                    padding: "10px",
                                    fontSize: "16px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    width: "90%",
                                    transition: "border-color 0.3s",
                                }}
                            />
                        </>
                    )}
                    <input
                        name="email"
                        type='email'
                        placeholder='Email Address'
                        onChange={handleInputChange}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            width: "90%",
                            transition: "border-color 0.3s",
                        }}
                    />
                    <input
                        name="password"
                        type='password'
                        placeholder='Password'
                        onChange={handleInputChange}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            width: "90%",
                            transition: "border-color 0.3s",
                        }}
                    />
                </div>
                <button
                    type='submit'
                    onClick={handleFormSubmit}
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#0033ff",
                        color: "white",
                        border: 0,
                        borderRadius: "20px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                >
                    {pageType === "register" ? "Register" : "Login"}
                </button>
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    {pageType === "register" ? "Already have an account?" : "Don't have an account?"}
                    <span
                        onClick={() => setPageType(pageType === "register" ? "login" : "register")}
                        style={{ color: "#0033ff", cursor: "pointer", marginLeft: "5px" }}
                    >
                        {pageType === "register" ? "Login" : "Register"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
