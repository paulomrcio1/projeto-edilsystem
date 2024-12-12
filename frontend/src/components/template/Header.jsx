/* eslint-disable import/no-anonymous-default-export */
import './Header.css'
import React from 'react'

export default props =>

//d-nome -> para celular o header vai sumir
//d-sm-flex -> vai usar o display flex

<header className="header d-nome d-sm-flex flex-column"> 
    <h1 className='mt-3'>
        <i className={`fa fa-${props.icon}`}></i> {props.title}
    </h1>

    <p>{props.subtitle}</p>
</header>
