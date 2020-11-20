import React,{useState,useEffect} from 'react';
import axios from 'axios';

import './profile.css';

const Profile = (props) =>{
    useEffect(()=>{
        axios.get(`/users/${props.location.state.id}`)
        .then(res =>{
            set_user_info({...res.data})
            set_name(res.data.name)
            set_type(res.data.type)
            var books = []
            res.data.issuedBooks.map((book)=>{
                
                axios.get(`/admin/getOne/${book[0]}`)
                .then(res =>{
                    books = [...books,res.data]
                    set_issued_books([...books])
                })
            })

            var save_books = []
            res.data.reservedBooks.map((book)=>{
                axios.get(`/admin/getOne/${book}`)
                .then(res =>{
                    save_books = [...save_books,res.data]
                    console.log(save_books)
                    set_reserved_books([...save_books])
                })
            })
        })
    },[props])

    const [user_info,set_user_info] = useState()
    const [isUpdate,set_update] = useState(false)

    const [name,set_name] = useState()
    const [type,set_type] = useState()

    const [issuedBooks,set_issued_books] = useState([])
    const [reservedBooks , set_reserved_books] = useState([])

    const update = () =>{
        set_update(false)
        axios.get(`/users/${user_info.id}`)
        .then(res=>{
            const user = {
                ...res.data,
                name : name,
                type : type
            }
            axios.post(`/users/update`,user)
            .then(res=>{
                window.location.reload();
            })
        })
    }

    return(
        <div className = 'profile_main_container'>
            {
                !user_info ? <div> Loading...</div>:
                <div>
                    <div className = "head_logo">
                        <div className = 'head'>Library Management System</div>
                        <div className = 'head'>{user_info.name}</div>
                    </div>
                    <div id = 'individual_info'>
                        <div id='books_details'>
                            <div id = 'book_info_heading'>Books Details</div>
                            <div id = 'issued_books'>
                                <div className = 'section_heading'>Issued Books</div>
                                <table>
                                    <tr>
                                        <th>SNo.</th>
                                        <th>Book</th>
                                        <th>Author</th>
                                        <th>Publishor</th>
                                        <th>Secret No. </th>
                                    </tr>
                                    {   
                                        issuedBooks.map((book,index) => {
                                            return(
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{book.bookTitle}</td>
                                                    <td>{book.author}</td>
                                                    <td>{book.publication}</td>
                                                    <td>{book.id}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                            <div id = 'reserved_books'>
                                <div className = 'section_heading'>Reserved Books</div>
                                <table>
                                    <tr>
                                        <th>SNo.</th>
                                        <th>Book</th>
                                        <th>Author</th>
                                        <th>Publishor</th>
                                        <th>Secret No. </th>
                                    </tr>
                                    {
                                        reservedBooks.map((book,index) => {
                                            return(
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{book.bookTitle}</td>
                                                    <td>{book.author}</td>
                                                    <td>{book.publication}</td>
                                                    <td>{book.id}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                        </div>
                        <div id = 'user_details'>
                            <div id = 'user_info_heading'>User Information</div>
                            {
                                !isUpdate ? 
                                <div>
                                    <div className='info_container'>                    
                                        <span className = 'heading'>Name:</span>
                                        <span className = 'individual_info'>{user_info.name}</span><br />
                                    </div>
                                    <div>
                                        {
                                            user_info.type === "faculty" ? null : 
                                            <div className='info_container'>
                                                <span className = 'heading'>College ID:</span>
                                                <span className = 'individual_info'>{user_info.id}</span><br />
                                            </div>
                                        }
                                    </div>
                                    <div className='info_container'>
                                        <span className = 'heading'>Email:</span>
                                        <span className = 'individual_info'>{user_info.email}</span><br />
                                    </div>
                                    <div className='info_container'>
                                        <span className = 'heading'>Type:</span>
                                        <span className = 'individual_info'>{user_info.type}</span><br />
                                    </div>
                                    <div className = 'update'><button onClick = {() => set_update(true)} className = 'update_button'>Update Details</button></div>
                                </div>
                                :
                                <div>
                                    <div className='info_container'>                    
                                        <span className = 'heading'>Name:</span>
                                        <input className = 'area_for_apply'
                                            value = {name}
                                            placeholder = 'Book Number'
                                            onChange = {(event) => {set_name(event.target.value)}}
                                        />
                                    </div>
                                    <div className='info_container'>                    
                                        <span className = 'heading'>Type:</span>
                                        <select className = 'choice1' onChange = {(event)=> set_type(event.target.value)}>
                                            <option value = '--select'>--Select Category</option>
                                            <option value = 'undergraduate'>Under Graduate</option>
                                            <option value = 'postgraduate'>Post Graduate</option>
                                            <option value = 'researchscholar'>Research Scholar</option>
                                            <option value = 'faculty'>Faculty</option>
                                        </select>
                                    </div>
                                    <div className = 'update'><button onClick = {() => update()} className = 'update_button'>Update</button></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Profile