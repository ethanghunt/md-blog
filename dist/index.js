import express from 'express';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
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
app.get('/', function (req, res) {
    res.redirect('/blogs');
});
app.get('/blogs', function (req, res) {
    res.render('blogs');
});
app.get('/blogs/:id', function (req, res) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send('Not Found');
    }
    else {
        res.render('blog', { id: id });
    }
});
app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
