// require('dotenv').config()
const express = require('express')  //The dependency(Express) we have installed is stored in a 'express' variable
const app = express()  //express() has lots of functionalities in it, so for using those functionalities we have stored in 'app' variable
const port = 3000  //port is the number of the port we are using to run, like where will the express listens

const githubData = {
  "login": "Swapnil-008",
  "id": 157499679,
  "node_id": "U_kgDOCWNBHw",
  "avatar_url": "https://avatars.githubusercontent.com/u/157499679?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/Swapnil-008",
  "html_url": "https://github.com/Swapnil-008",
  "followers_url": "https://api.github.com/users/Swapnil-008/followers",
  "following_url": "https://api.github.com/users/Swapnil-008/following{/other_user}",
  "gists_url": "https://api.github.com/users/Swapnil-008/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/Swapnil-008/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/Swapnil-008/subscriptions",
  "organizations_url": "https://api.github.com/users/Swapnil-008/orgs",
  "repos_url": "https://api.github.com/users/Swapnil-008/repos",
  "events_url": "https://api.github.com/users/Swapnil-008/events{/privacy}",
  "received_events_url": "https://api.github.com/users/Swapnil-008/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "SwapnilShingne",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 7,
  "public_gists": 0,
  "followers": 1,
  "following": 0,
  "created_at": "2024-01-23T14:04:11Z",
  "updated_at": "2025-03-24T08:03:39Z"
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/github', (req, res) => {
    res.json(githubData)
})

app.get('/login', (req, res) => {
    res.send('<h1>Please login at Swapnil Shingne</h1>')
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})