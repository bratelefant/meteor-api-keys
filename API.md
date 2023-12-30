# API Documentation

## Class: ApiKeysSrv

### Constructor

- `new ApiKeysSrv({ apiKeyName, apiRouteStartsWith })`

Creates a new instance of `ApiKeysSrv`.

**Parameters:**

- `apiKeyName` (String, optional): The name of the header key to use for the API key. Defaults to 'X-MeteorApp-ApiKey'.
- `apiRouteStartsWith` (String, optional): The route to use for the API key. Defaults to '/api/v'.

### Methods

#### `ApiKeysSrv.generateKey()`

Generates a new API key.

**Returns:**

- A randomly generated key (String).

#### `ApiKeysSrv.insertKey({ key, note, belongsToUserId, createdByUserId })`

Ensures that the key is present in the database, if it is not, insert it otherwise update it. Also updates the createdAt field if the key is being updated.

**Parameters:**

- `key` (String): The key to insert or update.
- `note` (String, optional): A note to associate with the key.
- `belongsToUserId` (String, optional): The user id that the key belongs to.
- `createdByUserId` (String): The user id that created the key.

**Returns:**

- An object with properties: numberAffected, insertedId (if inserted).

#### `ApiKeysSrv.createKey({ note, belongsToUserId, createdByUserId })`

Inserts a randomly generated key into the database.

**Parameters:**

- `note` (String, optional): A note to associate with the key.
- `belongsToUserId` (String, optional): The user id that the key belongs to.
- `createdByUserId` (String): The user id that created the key.

**Returns:**

- The _id of the key that was inserted (String).

#### `ApiKeysSrv.createKeyForCurrentUser({ note })`

Creates a key for the current user.

**Parameters:**

- `note` (String, optional): An optional note to associate with the key.

**Throws:**

- A `Meteor.Error` if no current user is present.

**Returns:**

- The _id of the key that was inserted (String).

#### `ApiKeysSrv.deleteKey({ key })`

Removes a key from the database.

**Parameters:**

- `key` (String): The key to remove.

**Returns:**

- An object with properties: numberAffected.

#### `ApiKeysSrv.findKey({ key })`

Finds a key in the database.

**Parameters:**

- `key` (String): The key to find.

**Returns:**

- An object with properties: _id, key, note, belongsToUserId, createdAt, createdByUserId.

#### `ApiKeysSrv.findKeysForUserId({ belongsToUserId })`

Gets the Cursor for all keys belonging to a user.

**Parameters:**

- `belongsToUserId` (String): The user id to find keys for.

**Returns:**

- A cursor for all keys belonging to the user.

#### `ApiKeysSrv.isValid({ key })`

Checks if a key is valid.

**Parameters:**

- `key` (String): The key to check.

**Returns:**

- Resolves to true if the key is valid, false otherwise (Promise<Boolean>).

#### `ApiKeysSrv.middleware(exceptions = [])`

Middleware for Express.

**Parameters:**

- `exceptions` (Array, optional): An array of routes to exclude from the middleware.

**Returns:**

- Express middleware (Function).