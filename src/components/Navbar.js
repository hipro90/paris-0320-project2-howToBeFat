import React from 'react'
import './Navbar.css'
import home from '../home.png'
import recipe from '../recipe.png'
import beer from '../beer.png'
import balance from '../balance.png'

function Navbar(){
    return (
        // Navbar Mobile
        <div class="navbar-mobile">
  <a class="active" href="#home"><img class="icons" src={home} alt='home'/></a>
  <a href="#recipes"><img class="icons" src={recipe} alt='fork, knife and spoon'/></a>
    <a href="#beer"><img class="icons" src={beer} alt='glass of beer'/></a>
  <a href="#calculator"><img class="icons" src={balance} alt='weight balance'/></a>
        </div>
        // Navbar Mobile

        // Navbar Desktop
//         <div class="navbar-top">
// <a class="active" href="#home">Home</a>
// <a href="#news">Recipes</a>
// <a href="#contact">Beers</a>
// <a href="#about">Tips</a>
//         </div>
        // Navbar Desktop
    )
}

export default Navbar

