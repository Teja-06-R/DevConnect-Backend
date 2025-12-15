# Diving into APIs


---

## Table of Contents
1. [JavaScript Object vs JSON Object](#javascript-object-vs-json-object)
2. [Receiving Data Through POST API](#receiving-data-through-post-api)
3. [Retrieving Users from the Database](#retrieving-users-from-the-database)
4. [Handling Duplicate Documents with findOne()](#handling-duplicate-documents-with-findone)
5. [Delete API - Removing Documents from Database](#delete-api---removing-documents-from-database)
6. [PATCH vs PUT API](#patch-vs-put-api)
7. [Updating Data with PATCH API](#updating-data-with-patch-api)

---

## 1. JavaScript Object vs JSON Object

### Key Differences

| Feature                         | JavaScript Object                                          | JSON (JavaScript Object Notation)                             |
|---------------------------------|------------------------------------------------------------|---------------------------------------------------------------|
| **Definition**                  | A collection of key-value pairs in JavaScript              | A text-based data format for representing structured data     |
| **Data Types Supported**        | Any JavaScript type (string, number, boolean, array, object, function, etc.) | Limited to strings, numbers, booleans, arrays, objects, and null |
| **Syntax**                      | Property names do not need to be in quotes                 | Property names must be in double quotes                       |
| **Usage**                       | Primarily used within JavaScript code for manipulation     | Commonly used for data interchange between systems            |
| **Parsing Requirement**         | Not required in JavaScript, as it's native                 | Needs `JSON.parse()` to convert to a JavaScript object        |
| **Stringification Requirement** | `JSON.stringify()` is used to convert to JSON format       | Already in string format, no conversion needed for transmission |
| **Functions Allowed**           | Can include functions as values                            | Does not support functions                                    |
| **Comments**                    | Can contain comments                                       | Does not allow comments                                       |

---

## 2. Receiving Data Through POST API

### Overview
The POST API is used to receive data from the client. In the DevTinder app, this data is often user information that needs to be stored in the database.

### Process
- **Step 1**: Set up a route that handles incoming POST requests.
- **Step 2**: Extract data from the request body. Ensure data validation and sanitize inputs to prevent issues such as SQL injection or XSS.
- **Step 3**: Once validated, structure the data appropriately before pushing it into the database.
- **Step 4**: Handle errors or success responses based on database operations to provide feedback to the client.

```javascript
app.use(express.json());
//signup api for signing the user
app.post("/signup", async (req, res) => {
    const data = req.body;
    const user = new User(data)

    try {
        await user.save();
        res.send("User added successfully")

    } catch (err) {
        res.status(400).send("Error in saving the user:" + err.message)
    }
})
```
---

## 3. Retrieving Users from the Database

### Overview
Fetching users from the database is essential for listing or displaying information on the frontend.

### Process
- **Step 1**: Set up a GET API route that triggers the database query for retrieving users.
- **Step 2**: Define query filters (if any) based on the request parameters. For example, you may want to fetch users with specific attributes.
- **Step 3**: Execute the query and structure the results before sending them back in the API response.
- **Step 4**: Ensure the response format is JSON, allowing the client to process and display data as needed.

```javascript
// Feed API - get all the users form the database
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({})
        if (users.length === 0) {
            res.send("No user found")
        } else {
            console.log(users);
            res.send(users)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})
```
---

## 4. Handling Duplicate Documents with findOne()

### Overview
When `findOne()` is used with duplicate email documents in the database, MongoDB will return the **first matching document** it finds based on the collection's internal document ordering.

### Key Points
- **Ordering**: MongoDB does not guarantee a specific order unless specified with an index. The document returned will typically be the first found, according to the insertion order.
- **Best Practice**: To avoid duplicates, enforce uniqueness in fields like email by using unique indexes.
```javascript
    //user API to find the single user by by email
    app.get("/user", async (req, res) => {
        //getting user from body
        const userEmail = req.body.emailId;
        try {
            const users = await User.findOne({ emailId: userEmail })
            if (users.length === 0) {
                res.status(400).send("User not found")
            } else {

                // console.log(users)
                res.send(users)
            }
        }
        catch (err) {
            res.status(400).send("Something went wrong")
        }
    })
```
---

## 5. Delete API - Removing Documents from Database

### Overview
The Delete API is used to remove specific documents from the database, allowing for efficient data management.

### Key Method: `findByIdAndDelete()`
- Accepts the document's `_id` to identify and delete the target document.
- Returns the deleted document or `null` if no document is found.
- **Usage**: Primarily used for deleting user profiles or unwanted data from the collection.
```javascript
    //delete user API - deleting a user by its id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})
```
---

## 6. PATCH vs PUT API

| Feature                         | PATCH                                                      | PUT                                                         |
|---------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| **Purpose**                     | To partially update a document                             | To completely replace a document                            |
| **Required Data**               | Only the fields that need updating                         | All fields, even if only one field changes                  |
| **Typical Use Case**            | Updating a few fields, like changing a user's email        | Replacing or re-uploading an entire document                |
| **Database Interaction**        | Updates specific fields, leaving others unchanged          | Replaces the document with a new version                    |
| **HTTP Response Code**          | Typically 200 (OK) or 204 (No Content)                     | Typically 200 (OK) or 204 (No Content)                      |

---

## 7. Updating Data with PATCH API

### Overview
The PATCH API is used to update specific fields within a document without affecting other data.

### Key Method: `findByIdAndUpdate()`
- Accepts the document's `_id` and an object with updated data.
- Only the fields in the update object will be modified; others remain unchanged.
- **Use Case**: Ideal for updating user information like username, bio, or profile picture without affecting other fields.
```javascript
// patch user API - updating the data of user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "before" });
        console.log(user)
        res.send("User updated successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})
```
---
## Without express.json()
Client sends JSON
→ Express receives raw data
→ req.body = undefined
→ Your API breaks

## with express.json()
Client sends JSON
→ express.json() parses it
→ req.body becomes JS object
→ Your API works

## Without middleware:
```javascript
app.post("/signup", (req, res) => {
  console.log(req.body); // undefined ❌
});
```
## With middleware:
```javascript
app.use(express.json());

app.post("/signup", (req, res) => {
  console.log(req.body); // { name, emailId, password } ✅
});

```

