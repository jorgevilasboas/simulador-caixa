#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'backend/database.sqlite');

// Check if database exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
    console.log('❌ Database file not found. Run migrations first:');
    console.log('   cd backend && npm run migrate');
    process.exit(1);
}

const db = new sqlite3.Database(dbPath);

console.log('🗄️ Simulador Caixa Database Viewer');
console.log('=====================================\n');

// Function to display table data
function displayTable(tableName) {
    return new Promise((resolve, reject) => {
        console.log(`📋 ${tableName.toUpperCase()}:`);
        console.log('-'.repeat(50));
        
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(`❌ Error reading ${tableName}:`, err.message);
                resolve();
                return;
            }
            
            if (rows.length === 0) {
                console.log(`   No data in ${tableName}\n`);
                resolve();
                return;
            }
            
            // Display column headers
            const columns = Object.keys(rows[0]);
            console.log('   ' + columns.join(' | '));
            console.log('   ' + '-'.repeat(columns.join(' | ').length));
            
            // Display rows
            rows.forEach(row => {
                const values = columns.map(col => {
                    let value = row[col];
                    if (value === null || value === undefined) {
                        return 'NULL';
                    }
                    if (typeof value === 'string' && value.length > 20) {
                        return value.substring(0, 20) + '...';
                    }
                    return value;
                });
                console.log('   ' + values.join(' | '));
            });
            console.log('');
            resolve();
        });
    });
}

// Main function
async function main() {
    try {
        // Get table names
        const tables = await new Promise((resolve, reject) => {
            db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.name));
            });
        });
        
        console.log(`📊 Found ${tables.length} tables: ${tables.join(', ')}\n`);
        
        // Display each table
        for (const table of tables) {
            await displayTable(table);
        }
        
        // Show summary
        console.log('📈 Summary:');
        console.log('-'.repeat(20));
        
        for (const table of tables) {
            const count = await new Promise((resolve, reject) => {
                db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });
            console.log(`   ${table}: ${count} records`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        db.close();
    }
}

// Run the viewer
main();
