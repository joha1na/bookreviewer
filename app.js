const express = require('express');
const { engine } = require('express-handlebars'); // ACHTUNG: neue Syntax
const path = require('path');

const app = express();
const PORT = 3000;

// Handlebars einrichten (neue Syntax)
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Beispiel-Daten
const books = [
  { id: 1, title: 'Der kleine Prinz', author: 'Antoine de Saint-Exupéry', rating: 4.8 },
  { id: 2, title: 'Harry Potter', author: 'J.K. Rowling', rating: 4.5 }
];

const bookDetail = {
  id: 1,
  title: 'Der kleine Prinz',
  author: 'Antoine de Saint-Exupéry',
  rating: 4.8,
  reviews: [
    { user: 'Anna', comment: 'Wundervoll!', likes: 5 },
    { user: 'Tom', comment: 'Sehr tiefgründig', likes: 2 }
  ]
};

// Routen
app.get('/books', (req, res) => {
  res.render('book-list', { books });
});

app.get('/book/:id', (req, res) => {
  res.render('book-detail', { book: bookDetail });
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft unter http://localhost:${PORT}`);
});
