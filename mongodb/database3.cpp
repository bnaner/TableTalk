#include "C:\Users\Admin\source\repos\TableTalk3\TableTalk3\database3.h"

Database::Database(const string& uri, const string& dbName, const string& collectionName)
    : client(mongocxx::uri(uri)), collection(client[dbName][collectionName]) {}

void Database::insertDocument(const string& name, const string& email, const string& profileMessage, const vector<string>& groups) {
    try {
        // Create a document builder
        bsoncxx::builder::basic::document document_builder;
        bsoncxx::builder::basic::array array_builder;

        // Add each group to the array
        for (const auto& group : groups) {
            array_builder.append(group);
        }

        // Add fields to the document
        document_builder.append(
            bsoncxx::builder::basic::kvp("name", name),
            bsoncxx::builder::basic::kvp("email", email),
            bsoncxx::builder::basic::kvp("profile_message", profileMessage),
            bsoncxx::builder::basic::kvp("groups", array_builder)
        );

        // Finalize the document
        bsoncxx::document::value doc = document_builder.extract();

        // Insert the document
        collection.insert_one(doc.view());
        cout << "Document inserted successfully." << std::endl;
    }
    catch (const std::exception& e) {
        cerr << "Insert failed: " << e.what() << std::endl;
    }
}

void Database::updateDocument(const string& name, const string& newEmail, const string& newProfileMessage, const vector<string>& newGroups) {
    try {
        // Create a filter to find the document with the given name
        bsoncxx::builder::basic::document filter_builder;
        filter_builder.append(bsoncxx::builder::basic::kvp("name", name));

        // Create an array builder for the new groups
        bsoncxx::builder::basic::array array_builder;
        for (const auto& group : newGroups) {
            array_builder.append(group);
        }

        // Create an update document to set the new email, profile message, and groups
        bsoncxx::builder::basic::document update_builder;
        update_builder.append(
            bsoncxx::builder::basic::kvp("$set",
                [newEmail, newProfileMessage, &array_builder](bsoncxx::builder::basic::sub_document subdoc) {
                    subdoc.append(
                        bsoncxx::builder::basic::kvp("email", newEmail),
                        bsoncxx::builder::basic::kvp("profile_message", newProfileMessage),
                        bsoncxx::builder::basic::kvp("groups", array_builder)
                    );
                }
            )
        );

        // Extract the documents
        bsoncxx::document::value filter = filter_builder.extract();
        bsoncxx::document::value update = update_builder.extract();

        // Update the document
        collection.update_one(filter.view(), update.view()); // Pass both filter and update
        std::cout << "Document updated successfully." << std::endl;
    }
    catch (const std::exception& e) {
        std::cerr << "Update failed: " << e.what() << std::endl;
    }
}

void Database::deleteDocument(const string& name) {
    try {
        // Create a filter to find the document with the given name
        auto filter = bsoncxx::builder::stream::document{}
            << "name" << name
            << bsoncxx::builder::stream::finalize;

        // Delete the document
        collection.delete_one(filter.view());
        cout << "Document deleted successfully." << endl;
    }
    catch (const exception& e) {
        cerr << "Delete failed: " << e.what() << endl;
    }
}

void Database::findDocument(const string& name) {
    try {
        // Create a filter to find the document with the given name
        auto filter = bsoncxx::builder::stream::document{}
            << "name" << name
            << bsoncxx::builder::stream::finalize;

        // Find the document
        auto result = collection.find_one(filter.view());
        if (result) {
            cout << "Document found: " << bsoncxx::to_json(*result) << endl;
        }
        else {
            cout << "No matching document found." << endl;
        }
    }
    catch (const exception& e) {
        cerr << "Find failed: " << e.what() << endl;
    }
}

void Database::findAllDocuments() {
    try {
        // Find all documents in the collection
        auto cursor = collection.find({});
        for (auto&& doc : cursor) {
            cout << bsoncxx::to_json(doc) << endl;
        }
    }
    catch (const exception& e) {
        cerr << "Find all failed: " << e.what() << endl;
    }
}