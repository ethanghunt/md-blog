import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import showdown, { Converter } from 'showdown';
import fs from 'fs';


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

// Setting the root path for data
const data_path: string = './src/public/data';

// Setting up the markdown converter
const md_converter: Converter = new showdown.Converter({metadata: true});

type Blog = {
  file_path: string;
  title: string;
  description: string;
  image_url: string;
  image_alt_text: string;
  date: string;
  html: string;
};

const all_blog_files: string[] = fs.readdirSync(data_path);
const blogs: Blog[] = all_blog_files.map((file_path: string) => {
  const markdown: string = fs.readFileSync(`${data_path}/${file_path}`, 'utf8');
  const html: string = md_converter.makeHtml(markdown);
  const metadata: any = md_converter.getMetadata();
  return {
    file_path: file_path,
    title: metadata.title,
    description: metadata.description,
    image_url: metadata.image_url,
    image_alt_text: metadata.image_alt_text,
    date: metadata.date,
    html: html
  };
});

app.get('/', function(req: Request, res: Response) {
  res.redirect('/blogs');
});

app.get('/blogs', function(req: Request, res: Response) {
  res.render('blogs', { blogs: blogs });
});

app.get('/blogs/:id', function(req: Request<{ id: string }>, res: Response) {
  let id: number = Number(req.params.id);
  if (isNaN(id)) {
    res.status(404).send('Not Found');
    return;
  };
  if (id >= blogs.length) {
    res.status(404).send('Not Found');
    return;
  };
  res.render('blog', { blog: blogs[id] });
});

// 404 page if the route is not found
app.use(function(req: Request, res: Response) {
  res.status(404).send('Not Found');
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});