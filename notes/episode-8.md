# DevTinder Project - Data Sanitization and Schema Validations in Mongoose

## Overview
In today's learning, I explored data sanitization and schema validation features in Mongoose. These features help enforce data integrity, improve data consistency, and add extra layers of validation to ensure that the data saved in MongoDB adheres to specific rules.

### Validation vs Sanitization
- Validation checks whether client data meets required rules.
- Sanitization cleans or restricts data to make it safe.
- Validation answers: "Is the data correct?"
- Sanitization answers: "Is the data safe to use?"
- Both are important to prevent bugs and security issues.

## Schema Types in Mongoose
Mongoose provides various schema types and properties that can be used to enforce data validation and sanitization. Key properties include:

### 1. `required`
- Ensures that a field must be provided before a document is saved.
```javascript
firstName: {
        type: String,
        `required: true,`
        minLength: 3,
        maxLenght: 50
    }
```

### 2. `unique`
- Specifies that the value in the field must be unique across the collection.
```javascript
emailId: {
        type: String,
        lowercase: true,
        required: true,
       `unique: true,`
        trim: true
    }
```

### 3. `default`
- Sets a default value for a field if no value is provided.
```javascript
about: {
        type: String,
        `default: "Dev is in search for someone here"`
    }
```

### 4. `lowercase`
- Converts the string value to lowercase before storing it in the database.
```javascript
emailId: {
        type: String,
        `lowercase: true,`
        required: true,
        unique: true,
        trim: true
    }
```

### 5. `trim`
- Removes leading and trailing whitespace from a string before saving it.
```javascript
emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
       `trim: true`
   }

### 6. `minLength` and `maxLength`
- Ensures that the length of a string field falls within a specified range.
```javascript
firstName: {
        type: String,
        required: true,
        `minLength: 3,`
        `maxLenght: 50`
    }
```

### 7. `min` and `max`
- Sets minimum and maximum values for numerical fields.
```javascript
age: {
        type: Number,
        required: true,
        `min: 18`
    }
```

### 8. `validate`
- Allows for custom validation logic to be applied to a field. This can include custom functions for more complex validation needs.
```javascript
gender: {
        type: String,
        required: true,
        trim: true,
       ` validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valid gender (Male , Female and other)")
            }
        }`
    }
```

### 9. `timestamps`
- Automatically adds `createdAt` and `updatedAt` fields to the schema, tracking when the document was created and last modified.
```javascript
{
   `timestamps: true`
}
```

## Custom Validator Function
Custom validators can be used to enforce more complex validation logic. For example, a custom validator for the `age` field can ensure that only values meeting a specific condition are accepted.
```javascript
gender: {
        type: String,
        required: true,
        trim: true,
       `validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valid gender (Male , Female and other)")
            }
        }`
    }
```

## API-Level Validations

### PATCH API for Selected Field Updates
- **Field-Level Validation**: API-level validation ensures that only specific fields can be updated in a PATCH request. This limits changes to approved fields and improves security.
- **Selective Updates**: Enables users to update only allowed fields while maintaining the integrity of other data.

- **Benefits**:
  - Prevents unintended updates.
  - Minimizes errors by restricting updates to specified fields.
  - Enhances data security by controlling what data is modifiable.

  ```javascript
        const ALLOWED_UPDATES = [
            "photoURL",
            "about",
            "gender",
            "skills",
            "firstName",
            "lastName",
            "age"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed")
        }
  ```


  ```javascript
  const isValidUpdate =
  Object.keys(data).every(key =>
    ALLOWED_UPDATES.includes(key)
  );
  if (!isValidUpdate) {
  throw new Error("Invalid updates");
  }
  ```
### Validating allowed update fields

- Object.keys(data) gives all fields user wants to update.
- every() ensures ALL fields are valid.
- includes() checks if field is in allowed list.
- Used to prevent users from updating restricted fields.


## Conclusion
Schema validations and data sanitization in Mongoose provide powerful tools to maintain data quality and integrity. These features enable building robust applications by ensuring that only valid data is stored in the database, reducing the need for manual checks and potential data-related errors.

## Key Validation Methods in Validator.js
Now focus  on learning how to use the `validator.js` library for advanced data validation in the DevTinder app. Validator.js provides powerful and simple methods to validate user input fields, ensuring data accuracy and security.

### Why we use validator library

- Writing custom validation logic increases complexity and bug risk.
- validator provides inbuilt, well-tested validation functions.
- It saves development time and improves code readability.
- Reduces chances of invalid or inconsistent data entering the system.


### 1. **Validating Email IDs**
- **Method**: `isEmail`
- Ensures that the provided email address is in a valid format.
- Helps prevent invalid or malformed email addresses from being stored in the database.
```javascript
   validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email :" + value)
            }
        }
```

### 2. **Validating Photo URLs**
- **Method**: `isURL`
- Validates whether a string is a properly formatted URL.
- Useful for checking the validity of photo URLs uploaded by users.
```javascript
   validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL :" + value)
            }
        }
```

### 3. **Validating Password Strength**
- **Method**: `isStrongPassword`
- Checks if the password meets specific criteria for strength, such as:
  - Minimum length.
  - Inclusion of uppercase and lowercase letters.
  - Numbers and special characters.
- Ensures that users create secure passwords to protect their accounts.
```javascript
   validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password :" + value)
            }
        }
```

## Benefits of Using Validator.js
- **Improved Data Integrity**: Ensures only valid data is stored in the database.
- **Enhanced Security**: Prevents common vulnerabilities caused by invalid inputs.
- **Ease of Use**: Simple methods for complex validations reduce development time.
- **Standard Compliance**: Ensures data adheres to industry standards (e.g., email formatting, URL structure).

## Conclusion
Using `validator.js` enhances the robustness of input validation in the DevTinder app. It simplifies the process of ensuring data consistency and security, particularly for critical fields like email, photo URLs, and passwords.