import React, { useState } from 'react'
import axios from 'axios'

import Form from './recipeSearch/Form'

const RecipeSearch = () => {

  // Define the states variables with useState hooks
  const [numOfResult, setNumOfResult] = useState(0)
  const [userIngredient1, setUserIngredient1] = useState('')
  const [userIngredient2, setUserIngredient2] = useState('')
  const [userIngredient3, setUserIngredient3] = useState('')
  const [userExcludeIngredient1, setUserExcludeIngredient1] = useState('')
  const [userExcludeIngredient2, setUserExcludeIngredient2] = useState('')
  const [userExcludeIngredient3, setUserExcludeIngredient3] = useState('')
  const [userCalories, setUserCalories] = useState(0)
  const [userPreparationTime, setUserPreparationTime] = useState(10)
  const [userDiets, setUserDiets] = useState('')
  const [userIntolerables, setUserIntolerables] =
    useState({
      "peanut-free": false,
      "tree-nut-free": false,
      "alcohol-free": false
    })
  const [errorRequest, setErrorRequest] = useState(false)
  const [recipe, SetRecipes] = useState([])

  // Generate a random number
  const getRandomNumber = (max) => Math.floor(Math.random() * Math.floor(max))
  //Define the range of search for the api request
  const defineRangeNumber = (nbResults) => {
    const rangewidth = 10
    const numberToRandom = getRandomNumber(Math.ceil(nbResults / rangewidth))
    const max = (numberToRandom * rangewidth) + rangewidth > nbResults ? nbResults - 1 : (numberToRandom * rangewidth) + rangewidth
    const min = max - rangewidth < 0 ? 0 : max - rangewidth
    return `&from=${min}&to=${max}`
  }

  // Add the optionnal searches to the url request in depend of the users selected options
  const defineRequestUrl = (nbResults) => {
    nbResults = nbResults > 100 ? 100 : nbResults
    const calories = userCalories && `&calories=${userCalories}%2B`
    const preparationTime = userPreparationTime && `&time=15-${userPreparationTime}`
    const ingredients = userIngredient1 && `${userIngredient1},${userIngredient2},${userIngredient3}`
    const excludes = `&excluded=${userExcludeIngredient1}&excluded=${userExcludeIngredient2}&excluded=${userExcludeIngredient3}`

    const intolerables = Object.entries(userIntolerables)
      .filter(intolerable => intolerable[1])
      .reduce((a, b) => a + `&health=${b[0]}`, '')

    const rangeRequest = numOfResult ? defineRangeNumber(numOfResult) : nbResults ? defineRangeNumber(nbResults) : ''
    // url which will be send to the API request
    return `https://api.edamam.com/search?q=${ingredients}${calories}${rangeRequest}${userDiets}${intolerables}${excludes}${preparationTime}&app_id=812f083c&app_key=57cd06930f1a1d5818380b512897cc58`
  }

  // We verify if the number of results are define
  const callApi = (url) => numOfResult === 0 ? getNumRecipes(url) : getApiDatas(url)
  // If the number of result is unknown, we go fetch it
  const getNumRecipes = (url) => {
    axios.get(url)
      .then((res) => {
        setNumOfResult(0)
        setNumOfResult(res.data.count)
        getApiDatas(defineRequestUrl(res.data.count))
      })
      .catch(e => setErrorRequest("Error, please check your ingredients"))

  }
  // Else we fetch the datas
  const getApiDatas = (url) => {
    axios.get(url)
      .then(res => {
        SetRecipes(res.data.hits)
        setErrorRequest(false)
      })
      .catch(e => setErrorRequest("Error, please contact administrator"))
  }

  const submitForm = (e) => {
    e.preventDefault()
    callApi(defineRequestUrl())
  }

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase()
    switch (e.target.name) {
      case "ingredient1":
        setUserIngredient1(value)
        break
      case "ingredient2":
        setUserIngredient2(value)
        break
      case "ingredient3":
        setUserIngredient3(value)
        break
      case "excludedIngredient1":
        setUserExcludeIngredient1(value)
        break
      case "excludedIngredient2":
        setUserExcludeIngredient2(value)
        break
      case "excludedIngredient3":
        setUserExcludeIngredient3(value)
        break
      case "calories":
        setUserCalories(e.target.value)
        break
      case "time":
        setUserPreparationTime(e.target.value)
        break
      case "specialDiets":
        setUserDiets(`&health=${e.target.value}`)
        break
      case "intolerables":
        setUserIntolerables({ ...userIntolerables, [value]: e.target.checked })
        break
      default:
    }
  }



  return (
    <div className='recipeSearch'>
      <h2>Customize your recipe</h2>
      <div className='ingredientSearch'>
        <form onSubmit={submitForm} className="ingredientsSearch">
          <Form handleChange={handleChange} submitForm={submitForm} userCalories={userCalories} userPrepTime={userPreparationTime} errorRequest={errorRequest} />

          {
            errorRequest &&
            <div style={{ padding: "1em", color: "red", "fontWeight": "bold" }}>
              {errorRequest}
            </div>
          }
          {
            numOfResult !== 0 &&
            <p>{numOfResult} recettes trouvées !</p>
          }
          <div><input type="submit" value="Get recipe" className="button-recipe"></input></div>
        </form>

        {recipe[0] &&
          <>
            <fieldset>
              <legend>Other recipes</legend>
              <ul>{recipe && recipe.map((e, id) => <li key={id}>{e.recipe.label}</li>)}</ul>
            </fieldset>
            <h3>{recipe[0].recipe.label}</h3>
            <p><img src={recipe[0].recipe.image} alt={recipe[0].recipe.label} /></p>
            <p>{recipe[0].recipe.calories}</p>
            <p>{recipe[0].recipe.totalTime}</p>
          </>
        }
      </div>
    </div>
  )
}

export default RecipeSearch