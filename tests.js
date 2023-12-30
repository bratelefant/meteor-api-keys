/* eslint-env mocha */
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, assert } from 'chai';
import sinon from 'sinon';
import { ApiKeys, ApiKeysSrv } from './server';

describe('ApiKeysSrv', () => {
  beforeEach(async () => {
    await ApiKeys.removeAsync({});
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateKey', () => {
    it('should generate a key', () => {
      const key = ApiKeysSrv.generateKey();
      expect(key).to.be.a('string');
      expect(key.length).to.equal(32);
    });
  });

  describe('insertKey', () => {
    it('should insert a key', async () => {
      const params = {
        key: 'testKey',
        note: 'test',
        belongsToUserId: 'testUser',
        createdByUserId: 'testCreator',
      };
      const { insertedId } = await ApiKeysSrv.insertKey(params);
      const result = await ApiKeys.findOneAsync({ _id: insertedId });

      expect(result).to.be.an('object');
      expect(result).to.have.property('key', params.key);
      expect(result).to.have.property('note', params.note);
      expect(result).to.have.property(
        'belongsToUserId',
        params.belongsToUserId,
      );
      expect(result).to.have.property('createdAt').to.be.a('date');
      expect(result).to.have.property(
        'createdByUserId',
        params.createdByUserId,
      );
    });

    it('should update a key', async () => {
      const params = {
        key: 'testKey',
        note: 'test',
        belongsToUserId: 'testUser',
        createdByUserId: 'testCreator',
      };
      const { insertedId } = await ApiKeysSrv.insertKey(params);

      const newParams = {
        key: 'testKey',
        note: 'test2',
        belongsToUserId: 'testUser2',
        createdByUserId: 'testCreator2',
      };
      await ApiKeysSrv.insertKey(newParams);
      const result = await ApiKeys.findOneAsync({ _id: insertedId });

      expect(result).to.be.an('object');
      expect(result).to.have.property('key', newParams.key);
      expect(result).to.have.property('note', newParams.note);
      expect(result).to.have.property(
        'belongsToUserId',
        newParams.belongsToUserId,
      );
      expect(result).to.have.property('createdAt').to.be.a('date');
      expect(result).to.have.property(
        'createdByUserId',
        newParams.createdByUserId,
      );
    });
  });

  describe('createKey', () => {
    it('should create a key', async () => {
      const params = {
        note: 'test',
        belongsToUserId: 'testUser',
        createdByUserId: 'testCreator',
      };
      const id = await new ApiKeysSrv({}).createKey(params);

      expect(id).to.be.a('string');

      const result = await ApiKeys.findOneAsync({ _id: id });

      expect(result).to.be.an('object');
      expect(result).to.have.property('key');
      expect(result).to.have.property('note', params.note);
      expect(result).to.have.property(
        'belongsToUserId',
        params.belongsToUserId,
      );
      expect(result).to.have.property('createdAt').to.be.a('date');
      expect(result).to.have.property(
        'createdByUserId',
        params.createdByUserId,
      );
    });
  });

  describe('createKeyForCurrentUser', () => {
    let currentUser;

    beforeEach(async () => {
      await Meteor.users.removeAsync({});
      const id = await Accounts.createUserAsync({ username: 'testUser' });

      currentUser = await Meteor.users.findOneAsync(id);
      Meteor.user = sinon.stub();
      Meteor.userAsync = sinon.stub();

      Meteor.user.returns(currentUser);
      Meteor.userAsync.returns(
        await Meteor.users.findOneAsync(currentUser._id),
      );
    });

    afterEach(async () => {
      Meteor.user = sinon.restore();
      Meteor.userAsync = sinon.restore();
    });

    it('should throw an error if no current Meteor user is present', async () => {
      Meteor.userAsync.returns(null);
      let error;
      try {
        await new ApiKeysSrv({}).createKeyForCurrentUser({});
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceOf(Meteor.Error);
    });

    it('should create a key for the current Meteor user', async () => {
      const params = {
        note: 'test',
      };
      const id = await new ApiKeysSrv({}).createKeyForCurrentUser(params);

      expect(id).to.be.a('string');

      const result = await ApiKeys.findOneAsync({ _id: id });

      expect(result).to.be.an('object');
      expect(result).to.have.property('key');
      expect(result).to.have.property('note', params.note);
      expect(result).to.have.property('belongsToUserId', currentUser._id);
      expect(result).to.have.property('createdAt').to.be.a('date');
      expect(result).to.have.property('createdByUserId', currentUser._id);
    });
  });

  describe('deleteKey', () => {
    it('should delete a key', async () => {
      const firstKey = {
        key: 'testKey1',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const firstKeyId = await ApiKeys.insertAsync(firstKey);

      const secondKey = {
        key: 'testKey2',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const secondKeyId = await ApiKeys.insertAsync(secondKey);

      await ApiKeysSrv.deleteKey({ key: 'testKey1' });

      const result = await ApiKeys.find({}).fetchAsync();
      expect(result).to.have.deep.members([{ _id: secondKeyId, ...secondKey }]);
      expect(result).to.not.have.deep.members([
        { _id: firstKeyId, ...firstKey },
      ]);
    });
  });

  describe('findKey', () => {
    it('should find a key', async () => {
      const firstKey = {
        key: 'testKey1',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const firstKeyId = await ApiKeys.insertAsync(firstKey);

      const secondKey = {
        key: 'testKey2',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      await ApiKeys.insertAsync(secondKey);

      const result = await ApiKeysSrv.findKey({ key: 'testKey1' });

      expect(result).to.deep.equal({ _id: firstKeyId, ...firstKey });
    });
  });

  describe('findKeysForUserId', async () => {
    it('should find keys for a user', async () => {
      const firstKey = {
        key: 'testKey1',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const firstId = await ApiKeys.insertAsync(firstKey);

      const secondKey = {
        key: 'testKey2',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const secondId = await ApiKeys.insertAsync(secondKey);

      const thirdKey = {
        key: 'testKey3',
        belongsToUserId: 'anotherUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const thirdId = await ApiKeys.insertAsync(thirdKey);

      const result = await ApiKeysSrv.findKeysForUserId({
        belongsToUserId: 'testUser',
      }).fetchAsync();

      expect(result).to.deep.equal([
        { _id: firstId, ...firstKey },
        { _id: secondId, ...secondKey },
      ]);

      expect(result.length).to.equal(2);

      expect(result).to.not.have.deep.members([{ _id: thirdId, ...thirdKey }]);
    });
  });

  describe('isValid', () => {
    it('should validate a key', async () => {
      const findKeyStub = sinon
        .stub(ApiKeysSrv, 'findKey')
        .resolves({ key: 'testKey' });
      const result = await new ApiKeysSrv({}).isValid({ key: 'testKey' });

      assert.isTrue(result);
      assert.isTrue(findKeyStub.calledOnce);
    });
  });

  describe('pub:meteorApiKeys', async () => {
    let currentUser;

    beforeEach(async () => {
      await Meteor.users.removeAsync({});
      const id = await Accounts.createUserAsync({ username: 'testUser' });

      currentUser = await Meteor.users.findOneAsync(id);
      Meteor.user = sinon.stub();
      Meteor.userAsync = sinon.stub();

      Meteor.user.returns(currentUser);
      Meteor.userAsync.returns(
        await Meteor.users.findOneAsync(currentUser._id),
      );
    });

    afterEach(async () => {
      Meteor.user = sinon.restore();
      Meteor.userAsync = sinon.restore();
    });

    it('publishes all keys belonging to current user', async () => {
      const firstKey = {
        key: 'testKey1',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const firstId = await ApiKeys.insertAsync(firstKey);

      const secondKey = {
        key: 'testKey2',
        belongsToUserId: 'testUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const secondId = await ApiKeys.insertAsync(secondKey);

      const thirdKey = {
        key: 'testKey3',
        belongsToUserId: 'anotherUser',
        createdAt: new Date(),
        createdByUserId: 'testCreator',
      };
      const thirdId = await ApiKeys.insertAsync(thirdKey);

      const res = Meteor.server.publish_handlers.meteorApiKeys.apply({
        userId: 'testUser',
        unblock: () => {},
      });

      const result = await res.fetchAsync();

      firstKey._id = firstId;
      delete firstKey.createdByUserId;

      secondKey._id = secondId;
      delete secondKey.createdByUserId;

      thirdKey._id = thirdId;
      delete thirdKey.createdByUserId;

      expect(result).to.deep.equal([firstKey, secondKey]);

      expect(result.length).to.equal(2);

      expect(result).to.not.have.deep.members([thirdKey]);
    });
  });
});
