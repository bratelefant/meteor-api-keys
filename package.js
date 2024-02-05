Package.describe({
  name: 'bratelefant:meteor-api-keys',
  version: '1.0.1',
  // Brief, one-line summary of the package.
  summary: 'Provide a simple way to manage API keys, express middleware included.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/bratelefant/meteor-api-keys',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom(['2.14', '3.0-beta.0']);
  api.use('ecmascript');
  api.use('aldeed:collection2@4.0.0', ['server']);
  api.use(['mongo', 'check', 'random'], ['server']);
  api.mainModule('server.js', ['server']);
  api.mainModule('client.js', ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('aldeed:collection2@4.0.0', ['server']);
  api.use(['accounts-password', 'mongo', 'check', 'random'], ['server']);
  api.use('meteortesting:mocha');
  api.use('bratelefant:meteor-api-keys');
  api.mainModule('tests.js');
});
