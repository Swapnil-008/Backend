import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App()
{
  const [jokes, setJokes] = useState([])
  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  )
  return (
    <>
      <h1>Jokes: {jokes.length}</h1>
      {
        jokes.map((joke, index) => (
          <div  key={joke.id}>
            <h3> Joke {index}:  {joke.joke}</h3>
            <p>Content:  {joke.content}</p>
          </div>
        ))
      }
      {/* If we used curly braces instead of parenthesis in map then we have to return the joke also */}
    </>
  )
}

export default App
