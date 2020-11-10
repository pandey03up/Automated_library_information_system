import React,{useState} from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios';

import './Login.css';

const Login = (props) =>{
    const [email,set_email] = useState('')
    const [password,set_password] = useState('')
    const [message,set_message] = useState('')
    const [is_login,set_login] = useState(false)
    const [details,set_details] = useState()

    //login function
    const login = () =>{
        if(email.length === 0||password.length === 0){
            set_message('At least one field is empty')
            return
        }
        axios.get(`users/login/${email}/${password}`)
        .then(res => {
            if(res.data){
                set_details(res.data)
                set_login(true)
            }
            else{
            set_message('One of the fields is incorrect')
            set_email('')
            set_password('')
            }
        })
        .catch((err) => {
            err.message === "Request failed with status code 404" ? set_message("User dosen't exist") : set_message("")
            set_email("")
            set_password("")
        })
    }

    var render
    if(is_login && details){
        console.log(details)
        if(details.admin){
            render = <Redirect to = {{
                pathname : '/admin',
                state : details
            }} />
        }else{
            render = <Redirect to = {{
                pathname : '/books',
                state : details
            }} />
        }
    }

    return(
        <div style = {{width:window.innerWidth,height:window.innerHeight}}>
            {
                details ? render: 
            
                <div className = 'login_main_container'>
                    {
                        message === '' ? null : <span className = 'alert_message_login'>{message}</span>
                    }
                    <div className = 'login_info_container'>
                        <div className = 'input_container_login'>
                            <input className = 'input_area_login' 
                                value = {email.toLowerCase()}
                                type = 'email'
                                placeholder = 'College Email'
                                onChange = {(event)=> set_email(event.target.value)}
                            />
                        </div>
                        <div className = 'input_container_login'>
                            <input className = 'input_area_login' 
                                value = {password}
                                type = 'password'
                                placeholder = 'Password'
                                onChange = {(event)=> set_password(event.target.value)}
                            />
                        </div>
                        <div className = 'login'>
                            <button className = 'submit_login' onClick = {() => login()}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Login;