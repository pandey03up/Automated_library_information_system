import React,{useState} from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'

import './Admin.css';

const Admin = (props) =>{
    const [user_info,set_user_info] = useState({
        ...props.location.state
    })
    const [is_logout,set_logout] = useState(false);
    const [message,set_message] = useState('')
    const [assignment_message,set_assignment_message] = useState('')

    //Books Assignment
    const [book_manipulation,set_book_manipulation] = useState('addBook')
    const [book_assignment,set_book_assignment] = useState('issueBook')
    const [studentId,set_studentId] = useState('')
    const [book_number,set_book_number] = useState('')
    const [date,set_date] = useState([])

    //Books Manipulation
    const [book_title,set_book_title] = useState('')
    const [book_author,set_book_author] = useState('')
    const [book_publication,set_book_publication] = useState('')
    const [isbn,set_isbn] = useState('')
    const [new_book_number,set_new_book_number] = useState('')

    //user detail
    const [user,set_user] = useState()

    //Book details container
    const [book_details,set_book_details] = useState();

    //Add book function
    const add_Book = () =>{
        const newBook = {
            'id' : new_book_number,
            'bookTitle' : book_title,
            'author' : book_author,
            'publication' : book_publication,
            'bookNumber' : new_book_number,
            'isbn' : isbn
        }
        axios.post('/admin/addBook',newBook)
        .then(res=>{
            set_message(res.data)
            set_book_author('')
            set_new_book_number('')
            set_book_publication('')
            set_book_title('')
            set_isbn('')
            return
        })
        .catch(err=>{
            console.log()
        })
    }

    //delete boom function
    const delete_Book = () =>{
        axios.delete(`/admin/delete/${book_number}`)
        .then(res=>{
            set_message(res.data)
            set_book_number('')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    //display book function
    const display_book_function = () =>{
        axios.get(`/admin/getOne/${new_book_number}`)
        .then(res=>{
            if(res.data){
                set_book_details({...res.data})
                set_message('')
                set_new_book_number('')
            }
            else{
                set_message('book number is not valid')
                set_new_book_number('')
                set_book_details()
            }
        })
    }

    //Book updation function
    const update_book_function = () =>{
        const newBook = {
            'id' : new_book_number,
            'bookTitle' : book_title,
            'author' : book_author,
            'publication' : book_publication,
            'bookNumber' : new_book_number,
            'isbn' : isbn
        }
        axios.post('/admin/update',newBook)
        .then(res => {
            set_message(res.data)
            set_book_author('')
            set_new_book_number('')
            set_book_publication('')
            set_book_title('')
            set_isbn('')
            return
        })
    }

    //issue book function
    const issue_book = () =>{
        var book
        var user
        axios.get(`/admin/getOne/${book_number}`)
        .then(res=>{
            if(res.data){
                if(res.data.assigned === true){
                    set_assignment_message('book already assigned')
                    set_studentId("")
                    set_book_number("")
                    return
                }
                book = res.data
                const id = studentId + '@iiit-bh.ac.in'
                axios.get(`/users/${id}`)
                .then(res => {
                    if(res.data){
                        user = res.data
                        //book update
                        axios.post('/admin/addBook',{...book,assigned : true,assignedTo:id})
                        .then(res => {
                            console.log('book updated')
                        })
                        
                        //user Update
                        user.issuedBooks.push([
                            book_number,date,0
                        ])
                        axios.post('/users/update',{...user})
                        .then(res =>{
                            set_assignment_message('Book Assigned')
                            set_book_number("")
                                set_studentId('')
                                set_date("")
                        })
                    }else{
                        set_assignment_message("user dosen't exist")
                        set_studentId("")
                        set_book_number("")
                        return
                    }
                })
            }
            else{
                set_assignment_message('book number is incorrect')
                set_studentId("")
                set_book_number("")
                return
            }
        })
    }

    //verify member
    const verification_function = () =>{
        set_user()
        const id = studentId.includes('@iiit-bh.ac.in') ? studentId : studentId + '@iiit-bh.ac.in'
        axios.get(`/users/${id}`)
        .then(res =>{
            res.data ? set_user(res.data) : set_assignment_message('user not found')
            set_studentId('')
        })
    }

    //return book function
    const return_book = () =>{
        var user
        var book
        const id = studentId.includes('@iiit-bh.ac.in') ? studentId : studentId + '@iiit-bh.ac.in'
        axios.get(`/users/${id}`)
        .then(res =>{
            if(res.data){
                user = res.data
                var i = -1
                res.data.issuedBooks.map((book,index) =>{
                    if(book[0] === book_number){
                        i = index
                        return
                    }
                })
                if(i >= 0){
                    axios.get(`/admin/getOne/${book_number}`)
                    .then(res=>{
                        if(res.data){
                            book = res.data
                            book.assigned = false
                            book.assignedTo = ""
                            
                            //book submit
                            axios.post('/admin/addBook',book)
                            .then(res=>{
                                console.log('book submitted')
                            })

                            //user update
                            var fine = user.issuedBooks[i][2] + user.totalFine
                            user.issuedBooks.splice(i,1)
                            axios.post('/users/update',{...user,totalFine : fine})
                            .then(res =>{
                                set_assignment_message('Book returned and due fines = '+ fine)
                                set_book_number("")
                                set_studentId('')
                            })
                        }else{
                            set_assignment_message('book not found')
                        }
                    })
                }else{
                    set_assignment_message(`book is not assigned to ${studentId}`)
                }
            }else{
                set_assignment_message('user not found')
            }
        })
    }

    //pay the fine
    const pay_fine_function = () =>{
        const id = studentId.includes('@iiit-bh.ac.in') ? studentId : studentId + '@iiit-bh.ac.in'
        axios.get(`/users/${id}`)
        .then(res =>{
            if(res.data){
                var fine = res.data.totalFine
                
                axios.post('/users/update',{...res.data,totalFine : 0})
                .then(res =>{
                    set_assignment_message('pay Rupees '+ fine )
                    set_studentId('')
                })
            }else{
                set_assignment_message('user not found')
            }
        })
    }

    //Book Searching Type
    const [search_by,set_search_by] = useState('--searchBy')

    // issue section
    const issue = <div className = 'issue_form'>
        {
            assignment_message === '' ? null : <span className = 'alert_message'>{assignment_message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {studentId}
                placeholder = 'Student ID'
                onChange = {(event) => {set_studentId(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_number}
                placeholder = 'Book No.'
                onChange = {(event) => set_book_number(event.target.value)}
            />
        </div>
        <div className = 'input_section_issue'> 
            <input className = 'area_for_apply'
                value = {date}
                placeholder = 'Date'
                type = 'date'
                onChange = {(event) => set_date(event.target.value)}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => issue_book()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    // Verify Section
     const verifyMember = <div className = 'issue_form'>
        {
            assignment_message === '' ? null : <span className = 'alert_message'>{assignment_message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {studentId}
                placeholder = 'Student ID'
                onChange = {(event) => {set_studentId(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => verification_function()} className = 'submit_issue'>Submit</button>
        </div>
        {
            !user ? null : 
            <div>
                <div id = 'user_info_heading'>User Information</div>
                <div>
                    <div className='info_container'>                    
                        <span className = 'heading'>Email:</span>
                        <span className = 'individual_info'>{user.id}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Name:</span>
                        <span className = 'individual_info'>{user.name}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Education Typr:</span>
                        <span className = 'individual_info'>{user.type}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Issued Books:</span>
                        {
                            user.issuedBooks.map((info,index) =>{
                                return(
                                    <div>
                                        <span className = 'individual_info'>{`${index+1}) ${info[0]}`}</span><br />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Reserved Books:</span>
                        {
                            user.reservedBooks.map((info,index) =>{
                                return(
                                    <div>
                                        <span className = 'individual_info'>{`${index+1}) ${info[0]}`}</span><br />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        }
     </div>

    // Return Section
    const returnBook = <div className = 'issue_form'>
        {
            assignment_message === '' ? null : <span className = 'alert_message'>{assignment_message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_number}
                placeholder = 'Book No.'
                onChange = {(event) => set_book_number(event.target.value)}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {studentId}
                placeholder = 'Student ID'
                onChange = {(event) => {set_studentId(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => return_book()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    //Add book section
    const addBook = <div className = 'issue_form'>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_title}
                placeholder = 'Title'
                onChange = {(event) => {set_book_title(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_author}
                placeholder = 'Author'
                onChange = {(event) => {set_book_author(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_publication}
                placeholder = 'Publication'
                onChange = {(event) => {set_book_publication(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {isbn}
                placeholder = 'ISBN'
                onChange = {(event) => {set_isbn(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {new_book_number}
                placeholder = 'Book Number'
                onChange = {(event) => {set_new_book_number(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => add_Book()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    //Delete Book
    const deleteBook = <div className = 'issue_form'>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_number}
                placeholder = 'Book Number'
                onChange = {(event) => {set_book_number(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => delete_Book()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    //Display Details
    const displayDetails = <div className = 'issue_form'>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {new_book_number}
                placeholder = 'Book Number'
                onChange = {(event) => {set_new_book_number(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => display_book_function()} className = 'submit_issue'>Submit</button>
        </div>
        {
            !book_details ? null : 
            <div id = 'book_details'>
                <div id = 'user_info_heading'>Book Information</div>
                <div>
                    <div className='info_container'>                    
                        <span className = 'heading'>Book Number:</span>
                        <span className = 'individual_info'>{book_details.bookNumber}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Title:</span>
                        <span className = 'individual_info'>{book_details.bookTitle}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Author:</span>
                        <span className = 'individual_info'>{book_details.author}</span><br />
                    </div>
                    <div className='info_container'>
                        <span className = 'heading'>Publication:</span>
                        <span className = 'individual_info'>{book_details.publication}</span><br />
                    </div>
                    {
                        !book_details.assigned ? null : 
                        <div className='info_container'>
                            <span className = 'heading'>Assigned To:</span>
                            <span className = 'individual_info'>{book_details.assignedTo}</span><br />
                        </div>
                    }
                    <div className = 'update'><button className = 'update_button'>Update Details</button></div>
                </div>
            </div>
        }
    </div>

    //Update details
    const updateBook = <div className = 'issue_form'>
        {
            message === '' ? null : <span className = 'alert_message'>{message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {new_book_number}
                placeholder = 'Book Number'
                onChange = {(event) => {set_new_book_number(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_title}
                placeholder = 'Title'
                onChange = {(event) => {set_book_title(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_author}
                placeholder = 'Author'
                onChange = {(event) => {set_book_author(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {book_publication}
                placeholder = 'Publication'
                onChange = {(event) => {set_book_publication(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {isbn}
                placeholder = 'ISBN'
                onChange = {(event) => {set_isbn(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => update_book_function()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    //Search book
    const searchBook = <div className = 'issue_form'>
        <select className = 'choice_selection' onChange = {(event)=> set_search_by(event.target.value)}>
            <option value = '--searchBy'>Search By</option>
            <option value = 'bookNo'>Book No.</option>
            <option value = 'bookName'>Book Name</option>
        </select>
        {
            search_by === 'bookNo' ? <div className = 'input_section_issue'>
                <input className = 'area_for_apply'
                    value = {new_book_number}
                    placeholder = 'Book Number'
                    onChange = {(event) => {set_new_book_number(event.target.value)}}
                />
            </div> :
            search_by === 'bookName' ? <div className = 'input_section_issue'>
                <input className = 'area_for_apply'
                    value = {book_title}
                    placeholder = 'Book Title'
                    onChange = {(event) => {set_book_title(event.target.value)}}
                />
            </div> : null
        }
        <div className = 'input_section_issue_submit'>
            <button className = 'submit_issue'>Submit</button>
        </div>
    </div>

    //Pay Fine
    const Dues = <div className = 'issue_form'>
        {
            assignment_message === '' ? null : <span className = 'alert_message'>{assignment_message}</span>
        }
        <div className = 'input_section_issue'>
            <input className = 'area_for_apply'
                value = {studentId}
                placeholder = 'Student ID'
                onChange = {(event) => {set_studentId(event.target.value)}}
            />
        </div>
        <div className = 'input_section_issue_submit'>
            <button onClick = {() => pay_fine_function()} className = 'submit_issue'>Submit</button>
        </div>
    </div>

    return(
        <div>
            {
                is_logout ? <Redirect to = '/' /> :
            
                <div>
                    <div className = "head_logo">
                        <div className = 'head'>Library Management System</div>
                        <div className = 'head'>{user_info.name}(Admin)</div>
                        <div className = 'head'><button onClick = {() => set_logout(true)} className = 'login_toggle'>Logout</button></div>
                    </div>
                    <div id = 'actions_on_books'>
                        <div id = 'book_issual_related'>
                            <div id = 'book_info_heading'>Books Assignment</div>
                            <div className = 'details_container'>
                                <select className = 'choice_selection' onChange = {(event)=> {set_book_assignment(event.target.value); set_assignment_message('')}}>
                                    <option value = 'issueBook'>Issue</option>
                                    <option value = 'returnBook'>Return</option>
                                    <option value = 'verifyMember'>Verify Member</option>
                                    <option value = 'payFine'>Pay Fine</option>
                                </select>
                            </div>
                            <div className = 'action_container'>
                                {
                                    book_assignment === 'issueBook' ? issue : 
                                    book_assignment === 'verifyMember' ? verifyMember :
                                    book_assignment === 'returnBook' ? returnBook : 
                                    book_assignment === 'payFine' ? Dues : null
                                }
                            </div>
                        </div>
                        <div id = 'book_storage_related'>
                            <div id = 'book_info_heading'>Books Manipulation</div>
                            <div className = 'details_container'>
                                <select className = 'choice_selection' onChange = {(event)=> {set_book_manipulation(event.target.value); set_message('');set_book_details()}}>
                                    <option value = 'addBook'>Add</option>
                                    <option value = 'updateBook'>Update</option>
                                    <option value = 'displayBook'>Display Details</option>
                                    <option value = 'searchBook'>Search Book</option>
                                    <option value = 'deleteBook'>Delete</option>
                                </select>
                            </div>
                            <div className = "action_container">
                                {
                                    book_manipulation === 'addBook'? addBook : 
                                    book_manipulation === 'deleteBook' ? deleteBook : 
                                    book_manipulation === 'displayBook' ? displayDetails : 
                                    book_manipulation === 'updateBook' ? updateBook : 
                                    book_manipulation === 'searchBook' ? searchBook : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Admin;