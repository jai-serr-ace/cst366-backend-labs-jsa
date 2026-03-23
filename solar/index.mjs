import express, { response } from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', async (req, res) => {

      let url = "https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&per_page=50&orientation=horizontal&q=solar%20system";
      let response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      response = await response.json();
      let randomNum = Math.floor(Math.random() * response.hits.length);
      let source = response.hits[randomNum].webformatURL;
      console.log(source);


   res.render('home.ejs', {source})
});

app .get('/nasa', async (req, res) => {
   let url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
   let response = await fetch(url);
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   response = await response.json();
   console.log(response);

   const source = response.url;
   res.render('nasa.ejs', {source})
})

app.get('/planetInfo', (req, res) => {
   let planet = req.query.planet;
   let planetInfo = planets[`get${planet}`]();
   res.render('planet.ejs', {planetInfo, planet})
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
