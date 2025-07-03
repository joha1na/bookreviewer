#!/bin/bash

# Migration Script using curl
# Fügt Mock-Daten über die API hinzu

echo "🚀 Starting data migration via API..."

# Base URL für API
API_BASE="http://localhost:8080/api"

# Buch 1: Der kleine Prinz
echo "📖 Adding: Der kleine Prinz"
curl -s -X POST "${API_BASE}/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Der kleine Prinz",
    "author": "Antoine de Saint-Exupéry",
    "rating": 4.8,
    "description": "Ein zeitloser Klassiker über Freundschaft, Liebe und die wichtigen Dinge im Leben.",
    "publishedYear": 1943,
    "genre": ["Klassiker", "Philosophie", "Kinderbuch"],
    "isbn": "978-3-15-018-024-9"
  }' | jq '.status, .message'

# Buch 2: Harry Potter
echo -e "\n📖 Adding: Harry Potter und der Stein der Weisen"
curl -s -X POST "${API_BASE}/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter und der Stein der Weisen",
    "author": "J.K. Rowling",
    "rating": 4.5,
    "description": "Der erste Band der berühmten Harry Potter-Serie. Ein Junge entdeckt, dass er ein Zauberer ist.",
    "publishedYear": 1997,
    "genre": ["Fantasy", "Jugend", "Abenteuer"],
    "isbn": "978-3-551-55-167-2"
  }' | jq '.status, .message'

# Buch 3: 1984
echo -e "\n📖 Adding: 1984"
curl -s -X POST "${API_BASE}/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "rating": 4.2,
    "description": "Ein dystopischer Roman über Überwachung und Kontrolle in einer totalitären Gesellschaft.",
    "publishedYear": 1949,
    "genre": ["Dystopie", "Politische Fiktion", "Klassiker"],
    "isbn": "978-0-452-28423-4"
  }' | jq '.status, .message'

# Buch 4: Die Verwandlung
echo -e "\n📖 Adding: Die Verwandlung"
curl -s -X POST "${API_BASE}/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Die Verwandlung",
    "author": "Franz Kafka",
    "rating": 3.9,
    "description": "Die berühmte Erzählung über Gregor Samsa, der sich eines Morgens in ein Ungeziefer verwandelt findet.",
    "publishedYear": 1915,
    "genre": ["Klassiker", "Literatur", "Existentialismus"],
    "isbn": "978-3-15-009-900-6"
  }' | jq '.status, .message'

# Buch 5: Sapiens
echo -e "\n📖 Adding: Sapiens"
curl -s -X POST "${API_BASE}/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sapiens: Eine kurze Geschichte der Menschheit",
    "author": "Yuval Noah Harari",
    "rating": 4.6,
    "description": "Ein faszinierender Blick auf die Evolution der Menschheit von den Anfängen bis heute.",
    "publishedYear": 2011,
    "genre": ["Sachbuch", "Geschichte", "Anthropologie"],
    "isbn": "978-3-421-04595-9"
  }' | jq '.status, .message'

echo -e "\n🎉 Migration completed! Checking results..."

# Statistiken anzeigen
curl -s "${API_BASE}/books" | jq '.status, .data.pagination.totalBooks'

echo "✨ Migration finished!"
