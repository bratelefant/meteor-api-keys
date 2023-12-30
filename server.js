/* eslint-disable import/no-unresolved */
import { Random } from 'meteor/random';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
// eslint-disable-next-line import/no-extraneous-dependencies
import SimpleSchema from 'simpl-schema';

export const schema = new SimpleSchema({
  key: {
    type: String,
    max: 100,
  },
  note: {
    type: String,
    optional: true,
  },
  belongsToUserId: {
    type: String,
    max: 100,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  createdByUserId: {
    type: String,
    max: 100,
  },
});

export const ApiKeys = new Mongo.Collection('meteor-api-keys');

ApiKeys.createIndexAsync(
  {
    key: 1,
  },
  {
    unique: true,
  },
);

ApiKeys.createIndexAsync({
  belongsToUserId: 1,
});

ApiKeys.attachSchema(schema);

ApiKeys.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

/**
 * ApiKeysSrv
 * @locus server
 * @class ApiKeysSrv
 * @param {Object} options
 * @param {String} [options.apiKeyName] - The name of the header key to use for the API key.
 *                                        Defaults to 'X-MeteorApp-ApiKey'.
 * @param {String} [options.apiRouteStartsWith] - The route to use for the API key.
 *                                                Defaults to '/api/v'
 * @example
 * ```javascript
 * const apiKeysSrv = new ApiKeysSrv(
 *                      {
 *                        apiKeyName: 'X-MeteorApp-ApiKey',
 *                        apiRouteStartsWith: '/api/v'
 *                      }
 *                    );
 * ```
 */
export class ApiKeysSrv {
  constructor({ apiKeyName, apiRouteStartsWith }) {
    this.apiKeyName = apiKeyName || 'X-MeteorApp-ApiKey';
    this.apiRouteStartsWith = apiRouteStartsWith || '/api/v';
    check(this.apiKeyName, String);
    check(this.apiRouteStartsWith, String);
  }

  /**
   * Generate a key, internally uses Random.secret
   * @returns {String} - A randomly generated key
   */
  static generateKey() {
    return Random.secret(32);
  }

  /**
   * Ensure that the key is present in the database, if it is not, insert it
   * otherwise update it. Also updates the createdAt field if the key is being
   * updated.
   * @param {Object} param0
   * @param {String} param0.key - The key to insert or update
   * @param {String} [param0.note] - A note to associate with the key
   * @param {String} [param0.belongsToUserId] - The user id that the key belongs to
   * @param {String} param0.createdByUserId - The user id that created the key
   * @returns {Object} - has properties: numberAffected, insertedId (if inserted)
   */
  static async insertKey({
    key, note, belongsToUserId, createdByUserId,
  }) {
    check(key, String);
    check(note, Match.Maybe(String));
    check(belongsToUserId, Match.Maybe(String));
    check(createdByUserId, String);
    const createdAt = new Date();

    const result = await ApiKeys.upsertAsync({ key }, {
      $set: {
        key,
        note,
        belongsToUserId,
        createdAt,
        createdByUserId,
      },
    });

    return result;
  }

  /**
   * Inserts a randomly generated key into the database
   * @param {Object} param0
   * @param {String} [param0.note] - A note to associate with the key
   * @param {String} [param0.belongsToUserId] - The user id that the key belongs to
   * @param {String} param0.createdByUserId - The user id that created the key
   * @returns {String} - The _id of the key that was inserted
   */
  async createKey({ note, belongsToUserId, createdByUserId }) {
    const key = this.constructor.generateKey();
    check(key, String);
    check(note, Match.Maybe(String));
    check(belongsToUserId, Match.Maybe(String));
    check(createdByUserId, String);

    const { insertedId: result } = await this.constructor.insertKey({
      key,
      note,
      belongsToUserId,
      createdByUserId,
    });

    return result;
  }

  /**
   * Creates a key for the current user
   * @param {Object} param0
   * @param {String} [param0.note] - An optional note to associate with the key
   * @throws {Meteor.Error} - Throws a Meteor.Error if there is no current user
   * @returns {String} - The _id of the key that was inserted
   */
  async createKeyForCurrentUser({ note }) {
    check(note, Match.Maybe(String));
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error(400, 'No current user');
    }
    const { _id: belongsToUserId } = currentUser;
    const createdByUserId = belongsToUserId;

    const result = await this.createKey({
      note,
      belongsToUserId,
      createdByUserId,
    });

    return result;
  }

  /**
   * Removes a key from the database
   * @param {Object} param0
   * @param {String} param0.key - The key to remove
   * @returns {Object} - has properties: numberAffected
   */
  static async deleteKey({ key }) {
    check(key, String);
    const result = await ApiKeys.removeAsync({ key });

    return result;
  }

  /**
   * Finds a key in the database
   * @param {Object} param0
   * @param {String} param0.key - The key to find
   * @returns {Object} - has properties: _id, key, note, belongsToUserId, createdAt, createdByUserId
   */
  static async findKey({ key }) {
    check(key, String);
    const result = await ApiKeys.findOneAsync({ key });

    return result;
  }

  /**
   * Gets the Cursor for all keys belonging to a user
   * @param {Object} param0
   * @param {String} param0.belongsToUserId - The user id to find keys for
   * @returns {Cursor} - A cursor for all keys belonging to the user
   */
  static findKeysForUserId({ belongsToUserId }) {
    check(belongsToUserId, String);
    const result = ApiKeys.find({ belongsToUserId });

    return result;
  }

  /**
   * Checks if a key is valid
   * @param {Object} param0
   * @param {String} param0.key - The key to check
   * @returns {Promise<Boolean>} - Resolves to true if the key is valid, false otherwise
   */
  async isValid({ key }) {
    check(key, String);
    const result = await this.constructor.findKey({ key });

    return !!result;
  }

  /**
   * Middleware for Express
   * @param {Array} [exceptions] - An array of routes to exclude from the middleware
   * @returns {Function} - Express middleware
   * @example
   * ```javascript
   * const apiKeysSrv = new ApiKeysSrv();
   * const app = express();
   * app.use(apiKeysSrv.middleware(['/api/v1/users/login']));
   * ```
   * @example
   * ```javascript
   * const apiKeysSrv = new ApiKeysSrv();
   * const app = express();
   * app.use(apiKeysSrv.middleware());
   * ```
   * */
  middleware(exceptions = []) {
    check(exceptions, Array);
    return async (req, res, next) => {
      if (!req.url.startsWith(this.apiRouteStartsWith)) {
        next();
        return;
      }

      if (exceptions.includes(req.url)) {
        next();
        return;
      }

      const apiToken = req.headers[this.apiKeyName.toLocaleLowerCase()];

      if (!apiToken) {
        const error = new Error('Missing API Token');
        error.statusCode = 401;
        next(error);
        return;
      }

      const isApiTokenValid = await this.isValid({ key: apiToken });

      if (!isApiTokenValid) {
        const error = new Error('Invalid API Token');
        error.statusCode = 403;
        next(error);
        return;
      }

      next();
    };
  }
}

/**
 * Publishes all keys belonging to the current user
 * @locus server
 * @name publishApiKeys
 * @returns {Cursor} - A cursor for all keys belonging to the user
 */
Meteor.publish('meteorApiKeys', function publishApiKeys() {
  if (!this.userId) {
    return this.ready();
  }

  return ApiKeys.find(
    { belongsToUserId: this.userId },
    { fields: { key: 1, createdAt: 1, belongsToUserId: 1 } },
  );
});
