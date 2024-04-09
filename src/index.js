import React from 'react'
import { createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Router} from './Routes'


class App extends React.Component{
  constructor(){
    super()
  }

  render(){
    return(
      <BrowserRouter>
          <Router />
      </BrowserRouter>
    )
  }
}

const element = document.getElementById('root')
const root = createRoot(element)

root.render(
  <App/>
)