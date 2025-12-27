# DevTinder Project - ref, populate and Thought process for writing API's

## Overview
Today's focus is on using `ref`, `populate`, and implementing a structured thought process for writing APIs. The work involves building an API to review and update the status of a connection request.


## API Details

### Endpoint:
- **POST `/request/review/:status/:requestId`**

### Purpose:
- To accept or reject a connection request by updating its status based on specific conditions.

---

## Thought Process for API Development

### Steps:

1. **Getting the Logged-In User**:
   - Identify the user making the request using authentication mechanisms (e.g., JWT or session).

2. **Retrieving Parameters**:
   - Extract `status` and `requestId` from the API parameters.

3. **Validating Input**:
   - Ensure that the `status` parameter only contains valid values:
     - Allowed values: `accepted` or `rejected`.
   - Return an error response if the `status` is invalid.

4. **Searching for the Connection Request**:
   - Query the database to find a connection request that:
     - Matches the provided `requestId`.
     - Has the `toUserId` field equal to the logged-in user's ID.
     - Has the `status` set to `interested`.

5. **Updating the Status**:
   - If a matching connection request is found, update its `status` field to the new value provided in the parameters.
   - Respond with a success message or the updated connection request data.


```javascript
    requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        //Validate Status
        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
            message: "Invalid Status or Status not allowed",
            success: false,
            });
        }

        //validating the request
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "intrested",
        });

        if (!connectionRequest) {
            return res.status(404).json({
            message: "request not found ",
            success: false,
            });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({
            message: "Connection request " + status,
            data,
            success: true,
        });
        } catch (error) {
        res.status(400).send("ERROR:" + error.message);
        }
    }
    );
```
## Key Concepts

### 1. `ref` and `populate` in Mongoose
- **`ref`**:
  - Defines relationships between collections in MongoDB.
  - Used to reference documents from other collections (e.g., linking `toUserId` and `fromUserId` to the User collection).

- **`populate`**:
  - Populates referenced fields with actual document data instead of just IDs.
  - Simplifies retrieving related data in a single query.

 
## API Details (UserSide)

### Endpoint:
- **GET `/user/requests/received`**

### Purpose:
- Fetch all pending connection requests where the logged-in user is the recipient (`toUserId`) and the request status is `interested`.

---

## Thought Process for API Development

### Steps:

1. **Setting up the User Router**:
   - Create a dedicated router for user-related operations to improve modularity and organization.

2. **Authenticating the API**:
   - Apply authentication middleware to ensure the user is logged in before processing the request.
   - Use tokens (e.g., JWT) to validate and retrieve the logged-in user.

3. **Fetching Connection Requests**:
   - Query the `ConnectionRequest` collection to retrieve all requests with:
     - `toUserId` matching the logged-in user's ID.
     - `status` set to `interested`.

4. **Building Relationships Between Schemas**:
   - Use `ref` in the `ConnectionRequest` schema to reference the `User` schema for the `fromUserId` field.
   - Populate the `fromUserId` field to retrieve the related user's data.

5. **Returning Specific Fields**:
   - Use `populate` to fetch only the `firstName` and `lastName` of the `fromUserId` user.
   - Exclude unnecessary fields to optimize the response payload.


```javascript

    //Setting Reference
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Popuating Data
    userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status: "intrested",
        }).populate("fromUserId", ["firstName", "lastName"]);
        if (connectionRequests) {
        return res.status(200).json({
            connectionRequests,
        });
        }
    } catch (error) {
        res.status(400).send("ERROR:" + error.message);
    }
    });
  ```
---

## API Details

### Endpoint:
- **GET `/user/connections`**

### Purpose:
- Fetch all accepted connection requests where the logged-in user is either the sender (`fromUserId`) or the receiver (`toUserId`).

---

## Thought Process for API Development

### Steps:

1. **Fetching Connection Requests**:
   - Query the `ConnectionRequest` collection to retrieve requests that:
     - Have `status` set to `"accepted"`.
     - Include the logged-in user’s ID in either the `toUserId` or `fromUserId` fields.

2. **Data Relationships**:
   - Use relationships between the `ConnectionRequest` and `User` schemas to retrieve additional user data if necessary.
   - Leverage Mongoose’s `populate` method to enhance the data with user details.

3. **Returning Results**:
   - Filter and return all matching connection requests as part of the response.
   - Optimize the response payload by including only relevant fields (e.g., user names, IDs).

```javascript

userRouter.get("/user/connections",userAuth,async(req,res)=>{
try{
   const loggedInUser=req.user;
   const connections=await ConnectionRequestModel.find({
    $or:[
      {fromUserId:loggedInUser._id,status:"accepted"},
      {toUserId:loggedInUser._id,status:"accepted"},
    ],
   }).populate("fromUserId","name skills")
     .populate("toUserId","name skills")

   const data=connections.map((row)=>{
    if(row.fromUserId._id.toString()===row.toUserId._id.toString()){
      return row.toUserId;
    }
    return row.fromUserId;
   })  
  res.send(data);
}
catch(err){
 res.status(400).send("Error:"+err.message);
}
})

```


---

