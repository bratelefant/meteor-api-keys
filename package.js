Package.describe({
  name: 'bratelefant:meteor-api-keys',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Provide a simple way to manage API keys, express middleware included.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.14');
  api.use('ecmascript');
  api.use('aldeed:collection2@3.5.0', ['server']);
  api.use(['mongo', 'check', 'random'], ['server']);
  api.mainModule('server.js', ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('aldeed:collection2@3.5.0', ['server']);
  api.use(['accounts-password', 'mongo', 'check', 'random'], ['server']);
  api.use('meteortesting:mocha');
  api.use('bratelefant:meteor-api-keys');
  api.mainModule('tests.js');
});

Npm.depends({
  'simpl-schema': '1.10.2',
});
