/* eslint-disable import/no-unresolved */
import { Mongo } from 'meteor/mongo';
// eslint-disable-next-line import/no-extraneous-dependencies
import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';

/**
 * @summary Represents the API key schema
 * @type {SimpleSchema}
 */
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

/**
 * @summary Represents the API key collection, which is a Mongo collection.
 */
export const ApiKeys = new Mongo.Collection('meteor-api-keys');

if (Meteor.isServer) {
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
}

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
