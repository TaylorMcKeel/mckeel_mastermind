import React, {Component} from 'react'
import {Route, Routes} from 'react-router-dom'
import {  Home, Game} from './components'

export class Router extends Component{
  render(){
    return(
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/gameplay' element={<Game />} />
      </Routes>
    )
  }
}

export default (Router)