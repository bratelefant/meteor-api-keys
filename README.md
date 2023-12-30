[![Tests](https://github.com/bratelefant/meteor-api-keys/actions/workflows/server-tests.yml/badge.svg)](https://github.com/bratelefant/meteor-api-keys/actions/workflows/server-tests.yml)
[![Lint](https://github.com/bratelefant/meteor-api-keys/actions/workflows/lint.yml/badge.svg)](https://github.com/bratelefant/meteor-api-keys/actions/workflows/lint.yml)
[![API Docs](https://github.com/bratelefant/meteor-api-keys/actions/workflows/generate-docs.yml/badge.svg)](https://github.com/bratelefant/meteor-api-keys/actions/workflows/generate-docs.yml)
[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg)](https://github.com/airbnb/javascript)

# Simple Meteor API Key Management

This is a meteor >=2.14 package, which allows to manage api keys that can be used to access a rest api for example. 
All relevant server functions are provided. Api key can optionally be linked to a meteor user and you can also
attach a note to each api key.

The server class also provides a method for getting a middleware e.g. for express to check requests agains a valid api key.
Note that this middleware will not check if the user associated with the api key matches the user making the request.

Meteor methods are not provided, since these will in general require some custom policy checks, depending on the apps 
structure. 

Api Keys will be stored in a collection named `meteor-api-keys` with indices on the keys and on the associated userIds.

## Server Functionality

You can check the server API [right here](API.md). Use these methods to wrap your meteor methods around, e.g. 
```javascript
const myMeteorApiKeySrv = new ApiKeysServer({});

Meteor.methods({
    async 'removeApiKey' (key){
        const isAllowed = await doMyPolicyChecks();
        if (!isAllowed) throw new Meteor.Error(403, "Not allowed");
        await myMeteorApiKeySrv.delete({ key });
    },

    async 'createKeyForCurrentUser' (note){
        const isAllowed = await doMyPolicyChecks();
        if (!isAllowed) throw new Meteor.Error(403, "Not allowed");
        try {
            await myMeteorApiKeySrv.createKeyForCurrentUser({ note });
        } catch (e) {
            console.warn("Couldn't create an api key, no user present");
            throw e;
        }
    }
})
```

## Meteor Publications

- `Meteor.publish('meteorApiKeys', function publishApiKeys())`

Publishes the API keys for the current user.