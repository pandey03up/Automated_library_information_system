import React,{useState,useEffect} from 'react';
import axios from 'axios'

import {Redirect,Link} from 'react-router-dom';

import './Search.css';

const Search = (props) =>{
    useEffect(()=>{
        props.location.state.issuedBooks.map((book)=>{
            axios.get(`/admin/getOne/${book[0]}`)
            .then(res =>{
                issue_book_details.push(res.data)
            })
        })
        props.location.state.reservedBooks.map((book)=>{
            axios.get(`/admin/getOne/${book[0]}`)
            .then(res =>{
                reserved_book_details.push(res.data)
            })
        })
    },[])
    const [search_by,set_search_by] = useState('')
    const [search_content,update_search_content] = useState('')
    const [is_logout,set_logout] = useState(false);

    const [issue_book_details,set_issue_book_details] = useState([])
    const [reserved_book_details,set_reserved_book_section] = useState([])

    const [books,set_books] = useState([
        {
            bookTitle : 'Hesd First Python',
            author: 'Mat Heanry',
            publication : 'ORACLE',
            bookNo: 4128
        },
        {
            bookTitle : 'A Textbook of quantum mechanics',
            author: 'Piravonu Mathews Mathews',
            publication : 'Hill Books',
            bookNo: 70965102
        },
        {
            bookTitle : 'Higher creativity',
            author: 'Willis W. Harman',
            publication : 'ORACLE',
            bookNo: 874772931
        },
        {
            bookTitle : 'Cultural anthropology',
            author: 'Roger M. Keesing',
            publication : 'Springer',
            bookNo: 30462967
        },
        {
            bookTitle : 'Cultural anthropology',
            author: 'Roger M. Keesing',
            publication : 'Springer',
            bookNo: 30462967
        },
    ])

    return(
        <div>
            {   
                is_logout ? <Redirect to = '/' /> :
                <div>
                    <div className = "head_logo">
                        <div className = 'head'>Library Management System</div>
                        <div className = 'head'><Link id = 'link_to_profile' to ={{
                            pathname : '/profile',
                            state : {...props.location.state,issuedBooks : issue_book_details,reservedBooks : reserved_book_details}
                        }}>{props.location.state.name}</Link></div>
                        <div className = 'head'><button onClick = {() => set_logout(true)} className = 'login_toggle'>Logout</button></div>
                    </div>
                    <div id = 'search_bar'>
                        <div id = 'search_container'>
                            <div className='search_by_container'>
                                <select id = 'search_by' onChange = {(event)=> set_search_by(event.target.value)}>
                                    <option value = 'default'>Search By</option>
                                    <option value = 'byBookNo'>Book No.</option>
                                    <option value = 'byBookName'>Book Name</option>
                                </select>
                            </div>
                            <div id='search_search'>
                                <input value = {search_content}
                                    placeholder = 'Search'
                                    onChange = {(event)=> update_search_content(event.target.value)}
                                    className = 'search_input'
                                />
                            </div>
                            <div className = 'search_by_container'>
                                <button className = 'submit_issue'>Search</button>
                            </div>
                        </div>
                    </div>
                    <div id= 'books_section'>
                        <div id="all_books">
                            {
                                books.map(book=>{
                                    return(
                                        <div className = 'individual_book_info'>
                                            <span className = 'heading'>Title:</span>
                                            <span className = 'individual_info'>{book.bookTitle}</span><br />

                                            <span className = 'heading'>Author:</span>
                                            <span className = 'individual_info'>{book.author}</span><br />

                                            <span className = 'heading'>Publisher:</span>
                                            <span className = 'individual_info'>{book.publication}</span><br />

                                            <span className = 'heading'>Book No.:</span>
                                            <span className = 'individual_info'>{book.bookNo}</span><br />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Search;