import express from 'express';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import showdown from 'showdown';
import fs from 'fs';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Adding EJS and EJS layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
// Setting the root path for public
app.use(express.static('./src/public'));
// Setting the root path for views
app.set('views', './src/views');
// Setting the root path for data
const data_path = './src/public/data';
// Setting up the markdown converter
const md_converter = new showdown.Converter({ metadata: true });
const all_blog_files = fs.readdirSync(data_path);
const blogs = all_blog_files.map((file_path) => {
    const markdown = fs.readFileSync(`${data_path}/${file_path}`, 'utf8');
    const html = md_converter.makeHtml(markdown);
    const metadata = md_converter.getMetadata();
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
app.get('/', function (req, res) {
    res.redirect('/blogs');
});
app.get('/blogs', function (req, res) {
    res.render('blogs', { blogs: blogs });
});
app.get('/blogs/:id', function (req, res) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send('Not Found');
        return;
    }
    ;
    if (id >= blogs.length) {
        res.status(404).send('Not Found');
        return;
    }
    ;
    res.render('blog', { blog: blogs[id] });
});
app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
