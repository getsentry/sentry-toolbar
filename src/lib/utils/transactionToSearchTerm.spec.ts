import transactionToSearchTerm from 'toolbar/utils/transactionToSearchTerm';

describe('transactionToSearchTerm', () => {
  it.each([
    {
      transactionName: '//alerts/rules/details/:ruleId/',
      searchTerm: '/alerts/rules/details/*/',
    },
    {transactionName: '/pokemon/[pokemonName]', searchTerm: '/pokemon/*'},
    {transactionName: '/replays/<id>/details/', searchTerm: '/replays/*/details/'},
    {
      transactionName: '/param/{id}/param2/key:value/',
      searchTerm: '/param/*/param2/key:value/',
    },
    {transactionName: '/issues/4489703641/', searchTerm: '/issues/*/'},
    {
      transactionName: 'v1.3/tutorial/event/123',
      searchTerm: 'v1.3/tutorial/event/*',
    },
    {
      transactionName: '/all/:id1/:id2/param',
      searchTerm: '/all/*/*/param',
    },
    {
      transactionName: '//settings/account/emails/',
      searchTerm: '/settings/account/emails/',
    },
    {
      transactionName: '//settings/account/api/auth-tokens/new-token/',
      searchTerm: '/settings/account/api/auth-tokens/new-token/',
    },
    {
      transactionName: '/about/ps5/',
      searchTerm: '/about/ps5/',
    },
    {
      transactionName: '/',
      searchTerm: '/',
    },
    {
      transactionName: '/hello/:param/world/[param]/foo/{param}/bar/<param>/biz/',
      searchTerm: '/hello/*/world/*/foo/*/bar/*/biz/',
    },
    {
      transactionName: '/hello/:param/[param]/{param}/<param>/world/',
      searchTerm: '/hello/*/*/*/*/world/',
    },
    {
      transactionName: '/hello/:param/[param]/{param}/<param>/world',
      searchTerm: '/hello/*/*/*/*/world',
    },
    {
      transactionName: '/hello/:param/[param]/{param}/<param>/',
      searchTerm: '/hello/*/*/*/*/',
    },
    {
      transactionName: '/hello/:param/[param]/{param}/<param>',
      searchTerm: '/hello/*/*/*/*',
    },
    {
      transactionName: '/:param/[param]/{param}/<param>/world/',
      searchTerm: '/*/*/*/*/world/',
    },
    {
      transactionName: ':param/[param]/{param}/<param>/world/',
      searchTerm: '*/*/*/*/world/',
    },
    {
      transactionName: ':param/[param]/{param}/<param>/world',
      searchTerm: '*/*/*/*/world',
    },
    {
      transactionName: ':param/[param]/{param}/<param>/',
      searchTerm: '*/*/*/*/',
    },
    {
      transactionName: ':param/[param]/{param}/<param>',
      searchTerm: '*/*/*/*',
    },
    {
      transactionName: ':param/:param/:param/:param',
      searchTerm: '*/*/*/*',
    },
    {
      transactionName: '[param]/[param]/[param]/[param]',
      searchTerm: '*/*/*/*',
    },
    {
      transactionName: '{param}/{param}/{param}/{param}',
      searchTerm: '*/*/*/*',
    },
    {
      transactionName: '<param>/<param>/<param>/<param>',
      searchTerm: '*/*/*/*',
    },
    {
      transactionName: '/some/uuid/d3aa88e2-c754-41e0-8ba6-4198a34aa0a2/',
      searchTerm: '/some/uuid/*/',
    },
    {
      transactionName: '/some/uuid/d3aa88e2c75441e08ba64198a34aa0a2/',
      searchTerm: '/some/uuid/*/',
    },
  ])('should change $transactionName', ({transactionName, searchTerm}) => {
    expect(transactionToSearchTerm(transactionName)).toStrictEqual(searchTerm);
  });
});
