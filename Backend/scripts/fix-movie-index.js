const mongoose = require('mongoose');
require('dotenv').config();

async function fixMovieIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    const db = mongoose.connection.db;
    const moviesCollection = db.collection('movies');

    // Get all indexes
    const indexes = await moviesCollection.indexes();
  

    // Drop the old text index
    try {
      await moviesCollection.dropIndex('title_text_director_text');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
      } else {
        throw error;
      }
    }

    // Create new language-neutral text index
    await moviesCollection.createIndex(
      { title: 'text', director: 'text' },
      { default_language: 'none', name: 'title_text_director_text' }
    );

    

  } catch (error) {
  } finally {
    await mongoose.connection.close();
  }
}

fixMovieIndex();
