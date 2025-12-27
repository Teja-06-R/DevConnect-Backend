# DevTinder Project - Logical DB and Compound Indexes

## Overview
Today's learning covers advanced concepts in MongoDB and Mongoose, including creating a connection request schema with strict validations, building an API to handle connection requests, and using `.pre` middleware for additional checks.


## 1. Connection Request Schema

### Key Features:
- **Schema Fields**:
  - `fromUserId`: The ID of the user sending the connection request.
  - `toUserId`: The ID of the user receiving the connection request.
  - `status`: The status of the request, restricted to specific values.

- **Status Validation**:
  - Only the following statuses are allowed:
    - `ignore`
    - `interested`
    - `accepted`
    - `rejected`
  - Any other value will throw a validation error using the `enum` type.

- **Custom Validators**:
  - Ensure only the predefined status values are accepted.
  - Provide meaningful error messages for invalid inputs.

---

## 2. API to Send Connection Requests

### Endpoint:
- **`POST /request/send/:status/:toUserId`**

### Key Validations:
1. **Allowed Statuses**:
   - Only "ignored" and "interested" statuses are allowed for this API.

2. **Duplicate Requests**:
   - Ensure that only one connection request can exist between two users, regardless of the direction (`fromUserId` to `toUserId` or vice versa).
   - If a request already exists, respond with a status indicating it was sent previously.

3. **Database Operation**:
   - Adds the `fromUserId`, `toUserId`, and `status` to the database upon successful validation.

---

## 3. `.pre` Middleware in Mongoose Schema

### Key Logic:
- **Prevent Self-Requests**:
  - Use `.pre` middleware in the Mongoose schema to validate that the `fromUserId` is not the same as the `toUserId`.
  - Throw an error if the condition (`fromUserId !== toUserId`) is not met.

### Benefits of Using `.pre` Middleware:
- Centralized validation logic directly within the schema.
- Ensures the database remains consistent by preventing invalid operations at the schema level.

## 4. Indexing in MongoDB

### What is an Index?
- An index is a data structure that improves the speed of data retrieval operations on a database table or collection.
- It acts like a "table of contents" for your database, enabling faster searches.

### Real-World Example:
- Searching for a common name like "Virat" among hundreds of entries can take significant time without an index.
- An index allows the database to find all matching entries much faster, reducing API response times.

### Automatic Indexing:
- Fields marked with `unique: true` in a schema automatically have an index created for them by MongoDB.
  - Example: Unique fields like `email` or `username`.

### Custom Indexing:
- Use `index: true` in the schema to create indexes for fields that are frequently queried but not marked as unique.
- Indexing non-unique fields like `firstname` can significantly improve query performance.

---

## 5. Compound Indexes

### What are Compound Indexes?
- Compound indexes are indexes created on multiple fields in a collection.
- They improve the performance of queries that filter or sort on multiple fields.

### Use Cases:
- Queries involving multiple fields, such as filtering users by `city` and `age`.
- Sorting results efficiently when multiple conditions are applied.

### Benefits:
- Faster data retrieval for complex queries.
- Reduced latency in API responses.

---

## 6. Limitations and Trade-Offs of Indexing

### Why Not Create Too Many Indexes?
1. **Storage Overhead**:
   - Each index consumes additional disk space, increasing the overall size of the database.

2. **Write Performance Impact**:
   - Creating and maintaining indexes adds overhead to write operations (insert, update, delete).

3. **Index Maintenance**:
   - The database must update all relevant indexes whenever a document is modified, leading to slower write operations.

### Best Practices:
- Index only the fields that are queried frequently.
- Use compound indexes strategically to cover complex queries.
- Regularly monitor and optimize indexes to balance performance and resource usage.

---

## Conclusion
These enhancements improve the robustness of the DevTinder app by ensuring data integrity and adding meaningful validations. The use of enums, compound validations, and middleware demonstrates effective use of Mongoose and MongoDB features for scalable application development.

### Enum:
- Restricts field to fixed set of values
- Prevents invalid data
- Enforces business rules at DB level
- Improves data integrity and queries

- Enum validation and custom error messages are handled by Mongoose at the schema level, before data reaches MongoDB
- Enum messages in Mongoose:
- Must be plain strings
- Use "{VALUE}" placeholder
- Never use `${}` inside schema


 

