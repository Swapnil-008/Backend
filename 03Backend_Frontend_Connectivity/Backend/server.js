import express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// get a list of 5 jokes ?
app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            joke: 'Why don\'t scientists trust atoms?',
            content: 'Because they make up everything.',
        },
        {
            id: 2,
            joke: 'Why don\'t eggs tell jokes?',
            content: 'They\'d crack each other up.'
        },
        {
            id: 3,
            joke: 'Why did the tomato turn red?',
            content: 'Because it saw the salad dressing.',
        },
        {
            id: 4,
            joke: 'Why did the scarecrow win an award?',
            content: 'Because he was outstanding in his field.',
        }
    ]
    res.json(jokes)
}
)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}
)