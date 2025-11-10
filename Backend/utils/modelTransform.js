/**
 * Utility functions to ensure consistent _id to id transformation
 */

/**
 * Transform a single Mongoose document to JSON with id instead of _id
 * @param {Object} doc - Mongoose document
 * @returns {Object} - Transformed JSON object
 */
const transformDoc = (doc) => {
  if (!doc) return null;
  if (typeof doc.toJSON === 'function') {
    return doc.toJSON();
  }
  return doc;
};

/**
 * Transform an array of Mongoose documents to JSON
 * @param {Array} docs - Array of Mongoose documents
 * @returns {Array} - Array of transformed JSON objects
 */
const transformDocs = (docs) => {
  if (!Array.isArray(docs)) return docs;
  return docs.map(doc => transformDoc(doc));
};

module.exports = {
  transformDoc,
  transformDocs
};
