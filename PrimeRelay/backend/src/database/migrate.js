const fs = require('fs').promises;
const path = require('path');
const { query } = require('./connection');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Execute schema
    await query(schema);
    
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('🎉 Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
