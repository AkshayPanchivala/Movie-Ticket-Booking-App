const mongoose = require('mongoose');
require('dotenv').config();

async function fixMovieIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const moviesCollection = db.collection('movies');

    // Get all indexes
    const indexes = await moviesCollection.indexes();
    console.log('\nExisting indexes:');
    indexes.forEach(index => {
      console.log('- ', index.name);
    });

    // Drop the old text index
    try {
      await moviesCollection.dropIndex('title_text_director_text');
      console.log('\n✓ Dropped old text index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('\n✓ No old text index found (already removed)');
      } else {
        throw error;
      }
    }

    // Create new language-neutral text index
    await moviesCollection.createIndex(
      { title: 'text', director: 'text' },
      { default_language: 'none', name: 'title_text_director_text' }
    );
    console.log('✓ Created new language-neutral text index');

    // Verify new indexes
    const newIndexes = await moviesCollection.indexes();
    console.log('\nNew indexes:');
    newIndexes.forEach(index => {
      console.log('- ', index.name);
      if (index.name === 'title_text_director_text') {
        console.log('  Default language:', index.default_language || 'none');
      }
    });

    console.log('\n✅ Index migration completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

fixMovieIndex();
