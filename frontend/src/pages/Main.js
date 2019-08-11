import React, { useEffect, useState } from 'react'
import './Main.css'
import { Link } from 'react-router-dom'

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';

export default function Main({ match }){

    const [users, setUsers] = useState([]);

    useEffect(()=>{
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: { 
                    user: match.params.id
                }
            });

            setUsers(response.data);

        }   

        loadUsers();
    }, [match.params.id]);

    async function handleLike(id){
        console.log('like', id)
    }

    async function handleDislike(id){
        await api.post(` /dev/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        })

        setUsers(users.filter( user => user._id !== id ));
    }

    return (
        <div className="main-container">

            <Link to='/'>
                <img src={logo} alt="Tindev" />
            </Link>

            { users.length > 0 ? (

                <ul>
                { users.map(user => ( /* Equivalente à um return */

                    <li key={ user._id }>
                        <img src={user.avatar} alt={user.name} />
                        <footer> 
                            <strong> {user.name} </strong>
                            <p> {user.bio} </p>
                        </footer>
                        <div className="buttons">
                            <button type="button" onClick={ ()=>{ handleDislike(user._id) }  }>
                                <img src={ dislike } alt="Dislike" />
                            </button>
                            <button type="button" onClick={ ()=>{ handleLike(user._id) }  }>
                                <img src={ like } alt="like" />
                            </button>
                        </div>
                    </li>
                ) ) }
                </ul>

            ):(
                <div className="empty"> Acabou :( </div>
            )}

        </div>
    )
}