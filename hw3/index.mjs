import express from 'express';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
   
    let response = await fetch(`https://cataas.com/cat?json=true`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data);
    let catImageUrl = data.url;
    console.log(catImageUrl);
    res.render('index', { catImageUrl });
});

app.get('/searchResults', async (req, res) => {
    let tags = req.query.ctags;
    let response = await fetch(`https://cataas.com/cat/${tags}?json=true`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data);
    let catImageUrl = data.url;
    console.log(catImageUrl);

    res.render('searchResults', { catImageUrl });
});

app.get('/textImage', async (req, res) => {
    const rawMessage = (req.query.ctext || '').toString().trim();
    const message = rawMessage || 'Hello';
    const encodedMessage = encodeURIComponent(message);

    console.log(message);
    let response = await fetch(`https://cataas.com/cat/says/${encodedMessage}?json=true`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data);
    let catImageUrl = data.url;
    console.log(catImageUrl);

    res.render('textImage', { catImageUrl });
});

app.get('/randomGif', async (req, res) => {
   
    let response = await fetch(`https://cataas.com/cat/gif?json=true`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data);
    let catImageUrl = data.url;
    console.log(catImageUrl);
    res.render('randomGif', { catImageUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
