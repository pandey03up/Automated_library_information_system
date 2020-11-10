import React,{useState} from 'react';
import './Home.css';

import {Link} from 'react-router-dom'
import axios from 'axios';
import {Redirect} from 'react-router-dom'

const Home = () =>{
    const [category,set_category] = useState('')
    const [id,set_id] = useState('')
    const [password,set_password] = useState('')
    const [check_password,set_check_password] = useState('')
    const [type,set_type] = useState('')
    const [email,set_email] = useState('')
    const [name,set_name] = useState('')
    const [message,set_message] = useState('')
    const [user_created,set_user_created] = useState(false)

    //Create New User
    const createNewUser = () =>{
        const newUser = {
            "id" : category === 'faculty' ? email : id + '@iiit-bh.ac.in',
            "name" : name,
            "email" : category === 'faculty' ? email : id + '@iiit-bh.ac.in',
            "password" : password,
            "type" : category === 'faculty' ? category : type,
            "issuedBooks" : [],
            "reservedBooks" : []
        }
        if(name.length ===0|| password.length ===0||check_password.length ===0||newUser.id.length === 0||newUser.email.length===0){
            set_message('At least one field is empty')
            return
        }else if(password.length < 8){
            set_message("password length is less than 8")
            set_password('')
            set_check_password('')
            return
        }else if(password !== check_password){
            set_message("password didn't match")
            set_password('')
            set_check_password('')
            return
        }
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        };
        axios.post('/users/signup',newUser)
        .then(res=>{
            if(res.data === 'User already exists'){
                set_message('User already exists')
                return
            }
            set_user_created(true)
        })

    }

    const changeCategory = (value) =>{
        if(value === '--select'){
            set_category('')
        }
        else{
            set_category(value)
            set_email('')
            set_id('')
            set_check_password('')
            set_name('')
            set_password('')
            set_type('')
            set_message('')
        }
    }

    const selectType = (value) =>{
        if(value === '--select'){
            set_type('')
        }else{
            set_type(value)
        }
        
    }

    const register_student = <div className = 'register_any'>
        <div className = 'category_choice' onChange = {(event)=> selectType(event.target.value)}>
            <select className = 'choice1'>
                <option value = '--select'>--Select Type</option>
                <option value = 'undergraduate'>Under Graduate</option>
                <option value = 'postgraduate'>Post Graduate</option>
                <option value = 'researchscholar'>Research Scholar</option>
            </select>
        </div>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {id.toLowerCase()}
                placeholder = 'College ID'
                onChange = {(event)=> set_id(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {name}
                type = 'text'
                placeholder = 'Name'
                onChange = {(event)=> set_name(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {password}
                type = 'password'
                placeholder = 'Password (min 8 character)'
                onChange = {(event)=> set_password(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {check_password}
                type = 'password'
                placeholder = 'Re-Password'
                onChange = {(event)=> set_check_password(event.target.value)}
            />
        </div>
    </div>

    const register_faculity = <div className = 'register_any'>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {email.toLowerCase()}
                type = 'email'
                placeholder = 'College Email'
                onChange = {(event)=> set_email(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {name}
                type = 'text'
                placeholder = 'Name'
                onChange = {(event)=> set_name(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {password}
                type = 'password'
                placeholder = 'Password (min 8 character)'
                onChange = {(event)=> set_password(event.target.value)}
            />
        </div>
        <div className = 'input_section'>
            <input className = 'input_area' 
                value = {check_password}
                type = 'password'
                placeholder = 'Re-Password'
                onChange = {(event)=> set_check_password(event.target.value)}
            />
        </div>
    </div>
    
    return(
        <div style = {{width:window.innerWidth}}>
            {
                user_created ? <Redirect to = {{
                    pathname : '/books',
                    state : {
                        "id" : category === 'faculty' ? email : id + '@iiit-bh.ac.in',
                        "name" : name,
                        "email" : category === 'faculty' ? email : id + '@iiit-bh.ac.in',
                        "password" : password,
                        "type" : category === 'faculty' ? category : type,
                        "issuedBooks" : [],
                        "reservedBooks" : []
                    }
                }} />:
                <div className = 'home_container'>
                    <div className = "head_logo">
                        <div className = 'head'>Library Management System</div>
                        <div className = 'head'><Link to = '/auth'><button className = 'login_toggle'>Login</button></Link></div>
                    </div>
                    <div style = {{height:window.innerHeight}}>
                        <div className = 'about_register'>
                            <div className = 'about'>
                                <div className = 'quate'>Whenever you read a good book, somewhere in the world a door opens to allow in 
                                more light.
                                <div className='byWhome'>– Vera Nazarian</div>
                                </div>
                            </div>
                            <div className = 'register'>
                                <div className = 'title'>
                                    <h6>Register</h6>
                                </div>
                                <div className = 'register_process'>
                                    <div className = 'category_choice'>
                                        <select className = 'choice1' onChange = {(event)=> changeCategory(event.target.value)}>
                                            <option value = '--select'>--Select Category</option>
                                            <option value = 'student'>Student</option>
                                            <option value = 'faculty'>Faculty</option>
                                        </select>
                                    </div>
                                    
                                    {
                                        category === '' ? null : category === 'faculty' ? register_faculity : register_student
                                    }
                                    {
                                        category === '' ? null : <div className = 'submit'>
                                            <button className = 'sign_up'
                                                onClick = {() => createNewUser()}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Home