#pragma once
#ifndef DATABASE_H
#define DATABASE_H

#include <iostream>
#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <vector>
using namespace std;

class Database {
public:
    Database(const string& uri, const string& dbName, const string& collectionName);

    void insertDocument(const string& name, const string& email, const string& profileMessage, const vector<string>& groups);
    void updateDocument(const string& name, const string& newEmail, const string& newProfileMessage, const vector<string>& newGroups);
    void deleteDocument(const string& name);
    void findDocument(const string& name);
    void findAllDocuments();

private:
    mongocxx::client client;
    mongocxx::collection collection;
};

#endif // DATABASE_H