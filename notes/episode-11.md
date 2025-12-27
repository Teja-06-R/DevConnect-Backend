# API Development and Express Router

## Overview
Today's learning focused on finalizing the DevTinder API endpoints and structuring the application using Express Router for better modularity and maintainability. The APIs were categorized into different routers based on their functionality.

---

## 1. DevTinder API Endpoints

### Auth Router
Handles user authentication, including signup, login, and logout.
- **POST `/signup`**: Register a new user.
- **POST `/login`**: Authenticate a user and issue a token.
- **POST `/logout`**: Revoke the user's session.

---

### Profile Router
Manages user profile-related operations.
- **GET `/profile/view`**: Retrieve the profile information of the logged-in user.
- **PATCH `/profile/edit`**: Update user profile details.
- **PATCH `/profile/password`**: Change the user's password.

---

### Connection Request Router
Handles connection requests between users with various statuses:
- **Status Options**: `ignore`, `interested`, `accepted`, `rejected`.
- **Endpoints**:
  - **POST `/request/send/intrested/:userId`**: Send a connection request to another user.
  - **POST `/request/ignored/:userId`**: Mark a request as ignored.
  - **POST `/request/review/accepted/:requestId`**: Accept a connection request.
  - **POST `/request/review/rejected/:requestId`**: Reject a connection request.

---

### User Router
Handles operations related to connections, requests, and the user feed.
- **GET `/user/connections`**: Get a list of connections for the logged-in user.
- **GET `/user/requests/received`**: Retrieve a list of received connection requests.
- **GET `/user/feed`**: Get a list of suggested users to connect with.

---

## 2. Structuring with Express Router

### Key Concepts:
1. **Creating a Routes Folder**:
   - Organize the API endpoints into separate route files for each functionality (e.g., `authRoutes.js`, `profileRoutes.js`).

2. **Using Express Router**:
   - Leverage the `express.Router()` to define routes in a modular way.
   - Each route file exports its router, which is then mounted to a specific path in the main application file.

```javascript
    const express = require("express");
    const profileRouter = express.Router();
    const { userAuth } = require("../Middlewares/auth");


    //profile API to get the profile details
    profileRouter.get("/profile", userAuth, async (req, res) => {
        const user = req.user;
        res.send(user);
    });

    module.exports = profileRouter;
```
 -  After this app.js becomes like this:
 ```javascript
 
const authRouter=require("./routers/auth");
const profileRouter=require("./routers/profile");
const userRouter=require("./routers/userRouter");

app.use('/',authRouter);
app.use("/",profileRouter);
app.use('/',userRouter);
 ```
 
- if a user sends signUp request then 1st it will check using authRouter then it will check inside authRouter file if it contains signup api then it hit it otherwise,it will got o profile router and check it and if there hit it. if there also api is not there then it will to the next routing api call

### How Express routing works with app.use()

- Express processes routers in the order they are registered.
- For each request, Express checks routes router by router.
- If a matching route is found, it executes the handler and stops.
- If no route matches in any router, Express returns 404.
- Route order matters when multiple routers use the same base path.


### Benefits of Using Express Router:
- **Modularity**: Separate files for each router improve code organization and readability.
- **Scalability**: Easier to maintain and expand as the application grows.
- **Reusability**: Common middleware and logic can be reused across routes.

---
## Overview
Today's learning focuses on building key APIs for the DevTinder app:  
1. A **Logout API** to securely log users out.  
2. A **Profile/Edit API** to update user information while maintaining validation and security.

---

## 1. Logout API

### Key Features:
- **Purpose**: Log users out by clearing their authentication cookies.
- **Implementation**:
  - Use the `res.cookie` method to set the cookie storing the JWT token to `null`.
  - Ensure the cookie is securely cleared by setting appropriate attributes (e.g., `httpOnly`, `secure`).

```javascript
  authRouter.post("/logout", async (req, res) => {
    res
        .cookie("token", null, {
            expires: new Date(Date.now())
        })
        .send("User Logged out successfully")
})
```

### Benefits:
- Ensures a secure and seamless logout process.
- Prevents unauthorized access by invalidating the session.

---

## 2. Profile/Edit API

### Key Features:
- **Purpose**: Allow users to update their profile information.
- **Validation**:
  - Implement checks to ensure only specific fields (e.g., `firstName`, `about`, `profileURL` etc) can be updated.
  - Prevent updates to sensitive or immutable fields like `password` or `_id`.
- **Security**:
  - Validate all incoming data to ensure it meets predefined criteria (e.g., length, format).
  - Sanitize inputs to prevent injection attacks or unintended updates.

```javascript
  profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditFields(req)) {
            throw new Error("Invalid Edit request")
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save();
        res.json({
            message: ` ${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})
```

### Benefits:
- Maintains data integrity by restricting updates to allowable fields.
- Provides a secure mechanism for users to manage their profile information.

---

## Conclusion
This structured approach to API development ensures that the DevTinder backend is organized, maintainable, and scalable. Using Express Router and clearly defined endpoints simplifies future feature additions and debugging.

