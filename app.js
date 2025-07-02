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
app.use(express.static(path.join(__dirname, 'public_html')));

// Beispiel-Daten
const books = [
  { id: 1, title: 'Der kleine Prinz', author: 'Antoine de Saint-Exupéry', rating: 4.8, reviews: [
    { user: 'Anna', comment: 'Wundervoll!', likes: 5 },
    { user: 'Tom', comment: 'Sehr tiefgründig', likes: 2 }
  ] },
  { id: 2, title: 'Harry Potter', author: 'J.K. Rowling', rating: 4.5, reviews: [
    { user: 'Hermine', comment: 'Magisch!', likes: 10 },
    { user: 'Ron', comment: 'Spannend bis zum Schluss', likes: 7 }
  ] }
];

// Routen
app.get('/books', (req, res) => {
  res.render('book-list', { books });
});

app.get('/book/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).send('Buch nicht gefunden');
  }
  res.render('book-detail', { book });
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft unter http://localhost:${PORT}`);
});
