#include "C:\Users\Admin\source\repos\TableTalk3\TableTalk3\database3.h"

#include <iostream>
#include <vector>

using namespace std;

int main() {
    // Initialize the MongoDB instance
    mongocxx::instance inst{};

    // Initialize the Database object with the connection string, database name, and collection name
    Database db("mongodb+srv://Admin1:pass98@tabletalk-mongo.vh4ln.mongodb.net/", "mydb", "users");

    // Insert a new document
    vector<string> groups = { "group1", "group2" };
    db.insertDocument("Alice", "alice@example.com", "Hello, I'm Alice!", groups);

    // Find all documents
    db.findAllDocuments();

    // Update the document with the name "Alice"
    vector<string> newGroups = { "group1", "group3" };
    db.updateDocument("Alice", "alice_new@example.com", "Updated profile message!", newGroups);

    // Find the updated document
    db.findDocument("Alice");

    // Delete the document with the name "Alice"
    db.deleteDocument("Alice");

    return 0;
}