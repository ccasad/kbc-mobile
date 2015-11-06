(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .constant('APP_GLOBALS', {
      // protocol: 'http://',
      // host: 'vm-centos',   // this should be mycareergateway.com in production and mcgp1-dev-portal.hvcp.local for DEV ENV
      // subDomainDelimiter: '-',  // this should be a period for production
      // mainSubDomain: 'directoutreach',
      systemAdminSubDomain: 'admin',
      angelSubDomain: 'team',
      supportTeamSubDomain: 'team',
      baseUrl: '/',
      restBaseUrl: 'https://www.casad.net/kbcapi/',
      vcnBaseUrl: 'https://www.vcn.org',
      imageUrl: '/images/',
      auth0Domain: 'xpandmcg.auth0.com',
      auth0ClientId: 'pvGwuCAmtNKOBt8mWJPiFvC9SkV6lFpE',
      systemAdminId: 1,
      recaptchaKey: '6LfNjwATAAAAADTMyhQHFZ1uoUVPzMvCU7HppAk9',
      xpandInstitutionId: 1,
      supportTeamInstitutionId: 5,
      pollingEnabled: true,
      pollingInterval: 120000, //defaultPollingTime : 2 minutes
      roles: [
        'public',     // bitmask=1
        'user',       // bitmask=2
        'admin',      // bitmask=4
        'student',    // bitmask=8
        'advisor',     // bitmask=16
        'institutionadmin',     // bitmask=32
        'angel',     // bitmask=64
        'family',     // bitmask=128
        'friend',     // bitmask=256
        'centerrep',     // bitmask=512
        'businessrep',     // bitmask=1024
        // 'schoolrep',     // bitmask=2048
      ],
      accessLevels: {
        'public' : '*',
        'anon': ['public'],
        'user' : ['user', 'admin', 'student', 'advisor', 'institutionadmin', 'angel', 'family', 'friend', 'centerrep', 'businessrep'], // all authenticated/logged in user
        'authorizeduser' : ['centerrep', 'businessrep'], // ['student', 'advisor'],
        'institutionadmin': ['institutionadmin'],
        'superadmin': ['admin'],
        'admin': ['admin', 'institutionadmin'],
        'angel': ['angel'],
        'ff': ['family', 'friend'],
        'student': ['student'],
        'centerrep': ['centerrep'],
        'businessrep': ['businessrep'],
      },
      industries: [
        {'id': 1, 'name': 'Healthcare', 'url': 'health-care'},
        {'id': 3, 'name': 'Green Economy', 'url': 'i-gen'},
        {'id': 4, 'name': 'Transit', 'url': 'transit'},
        {'id': 5, 'name': 'Back to work 50+', 'url': 'btw50'},
      ],
      httpError: {'status':{'success': false, 'msg':'Error in connecting to the REST server'}},
      dataError: {'status':{'success': false, 'msg':'Error in data'}},
      circles: {
        'peer':{'typeId': 1, 'typeName': 'peer', 'name': 'Peer', 'connectionsPageBaseRoute': 'user.connections.peers'},
        'familyFriends':{'typeId': 2, 'typeName': 'familyFriends', 'name': 'Family and Friends', 'connectionsPageBaseRoute': 'user.connections.family-and-friends'},
        'angel':{'typeId': 3, 'typeName': 'angel', 'name': 'Angel', 'connectionsPageBaseRoute': 'user.connections.angels'},
        'forum':{'typeId': 4, 'typeName': 'forum', 'name': 'Forum', 'connectionsPageBaseRoute': '', 'domainId': 13, 'catId': 20},
      },
      formElements: [
        {id: 1, name: 'Text', value: 'text'},
        {id: 2, name: 'Number', value: 'number'},
        {id: 3, date: 'Date', value: 'date'},
        {id: 6, date: 'Text', value: 'text'}
      ],
      appModulesPath: 'scripts/src/',
      appDefaultRoute: 'anon.login',
      appDefaultUserRoute: 'user.stats-list',
      googleAnalyticsAndroidKey: 'UA-63017146-7', // For Android
      googleAnalyticsIOSKey: 'UA-63017146-8', // For Ios
      googleAnalyticsKey: '', // For all other OS
    });

})();
