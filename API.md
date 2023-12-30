## Classes

<dl>
<dt><a href="#ApiKeysSrv">ApiKeysSrv</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#publishApiKeys">publishApiKeys</a> ⇒ <code>Cursor</code></dt>
<dd><p>Publishes all keys belonging to the current user</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#generateKey">generateKey()</a> ⇒ <code>String</code></dt>
<dd><p>Generate a key, internally uses Random.secret</p>
</dd>
<dt><a href="#insertKey">insertKey(param0)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Ensure that the key is present in the database, if it is not, insert it
otherwise update it. Also updates the createdAt field if the key is being
updated.</p>
</dd>
<dt><a href="#createKey">createKey(param0)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Inserts a randomly generated key into the database</p>
</dd>
<dt><a href="#createKeyForCurrentUser">createKeyForCurrentUser(param0)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Creates a key for the current user.</p>
</dd>
<dt><a href="#deleteKey">deleteKey(param0)</a> ⇒ <code>Object</code></dt>
<dd><p>Removes a key from the database.</p>
</dd>
<dt><a href="#findKey">findKey(param0)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Finds a key in the database</p>
</dd>
<dt><a href="#findKeysForUserId">findKeysForUserId(param0)</a> ⇒ <code>Cursor</code></dt>
<dd><p>Gets the Cursor for all keys belonging to a user</p>
</dd>
<dt><a href="#isValid">isValid(param0)</a> ⇒ <code>Promise.&lt;Boolean&gt;</code></dt>
<dd><p>Checks if a key is valid</p>
</dd>
<dt><a href="#middleware">middleware([exceptions])</a> ⇒ <code>function</code></dt>
<dd><p>Middleware for Express</p>
</dd>
</dl>

<a name="ApiKeysSrv"></a>

## ApiKeysSrv
**Kind**: global class  
**Locus**: server  
<a name="new_ApiKeysSrv_new"></a>

### new ApiKeysSrv(options)
ApiKeysSrv


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.apiKeyName] | <code>String</code> | The name of the header key to use for the API key.                                        Defaults to 'X-MeteorApp-ApiKey'. |
| [options.apiRouteStartsWith] | <code>String</code> | The route to use for the API key.                                                Defaults to '/api/v' |

**Example**  
```javascript
const apiKeysSrv = new ApiKeysSrv(
                     {
                       apiKeyName: 'X-MeteorApp-ApiKey',
                       apiRouteStartsWith: '/api/v'
                     }
                   );
```
<a name="publishApiKeys"></a>

## publishApiKeys ⇒ <code>Cursor</code>
Publishes all keys belonging to the current user

**Kind**: global variable  
**Returns**: <code>Cursor</code> - - A cursor for all keys belonging to the user  
**Locus**: server  
<a name="generateKey"></a>

## generateKey() ⇒ <code>String</code>
Generate a key, internally uses Random.secret

**Kind**: global function  
**Returns**: <code>String</code> - - A randomly generated key  
<a name="insertKey"></a>

## insertKey(param0) ⇒ <code>Promise.&lt;Object&gt;</code>
Ensure that the key is present in the database, if it is not, insert it
otherwise update it. Also updates the createdAt field if the key is being
updated.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - has properties: numberAffected, insertedId (if inserted)  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| param0.key | <code>String</code> | The key to insert or update |
| [param0.note] | <code>String</code> | A note to associate with the key |
| [param0.belongsToUserId] | <code>String</code> | The user id that the key belongs to |
| param0.createdByUserId | <code>String</code> | The user id that created the key |

<a name="createKey"></a>

## createKey(param0) ⇒ <code>Promise.&lt;String&gt;</code>
Inserts a randomly generated key into the database

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - - The _id of the key that was inserted  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| [param0.note] | <code>String</code> | A note to associate with the key |
| [param0.belongsToUserId] | <code>String</code> | The user id that the key belongs to |
| param0.createdByUserId | <code>String</code> | The user id that created the key |

<a name="createKeyForCurrentUser"></a>

## createKeyForCurrentUser(param0) ⇒ <code>Promise.&lt;String&gt;</code>
Creates a key for the current user.

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - - The _id of the key that was inserted  
**Throws**:

- <code>Meteor.Error</code> - Throws a Meteor.Error if there is no current user


| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| [param0.note] | <code>String</code> | An optional note to associate with the key |

<a name="deleteKey"></a>

## deleteKey(param0) ⇒ <code>Object</code>
Removes a key from the database.

**Kind**: global function  
**Returns**: <code>Object</code> - - has properties: numberAffected  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| param0.key | <code>String</code> | The key to remove |

<a name="findKey"></a>

## findKey(param0) ⇒ <code>Promise.&lt;Object&gt;</code>
Finds a key in the database

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - props: _id, key, note, belongsToUserId, createdAt, createdByUserId  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| param0.key | <code>String</code> | The key to find |

<a name="findKeysForUserId"></a>

## findKeysForUserId(param0) ⇒ <code>Cursor</code>
Gets the Cursor for all keys belonging to a user

**Kind**: global function  
**Returns**: <code>Cursor</code> - - A cursor for all keys belonging to the user  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| param0.belongsToUserId | <code>String</code> | The user id to find keys for |

<a name="isValid"></a>

## isValid(param0) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Checks if a key is valid

**Kind**: global function  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - - Resolves to true if the key is valid, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> |  |
| param0.key | <code>String</code> | The key to check |

<a name="middleware"></a>

## middleware([exceptions]) ⇒ <code>function</code>
Middleware for Express

**Kind**: global function  
**Returns**: <code>function</code> - - Express middleware  

| Param | Type | Description |
| --- | --- | --- |
| [exceptions] | <code>Array</code> | An array of routes to exclude from the middleware |

**Example**  
```javascript
const apiKeysSrv = new ApiKeysSrv();
const app = express();
app.use(apiKeysSrv.middleware(['/api/v1/users/login']));
```
**Example**  
```javascript
const apiKeysSrv = new ApiKeysSrv();
const app = express();
app.use(apiKeysSrv.middleware());
```
