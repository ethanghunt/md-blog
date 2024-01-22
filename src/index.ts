import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Adding EJS and EJS layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Setting the root path for public
app.use(express.static('./src/public'));

// Setting the root path for views
app.set('views', './src/views');

app.get('/', function(req: Request, res: Response) {
  res.send('Hello World!');
});

app.get('/blogs', function(req: Request, res: Response) {
    res.render('blogs')
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});