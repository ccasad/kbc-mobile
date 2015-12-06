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
      restBaseUrl: 'https://www.casad.net/kbcapi/', // '/kellysbc/api/', //
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
        //'student',    // bitmask=8
        //'advisor',     // bitmask=16
        //'institutionadmin',     // bitmask=32
        //'angel',     // bitmask=64
        //'family',     // bitmask=128
        //'friend',     // bitmask=256
        //'centerrep',     // bitmask=512
        //'businessrep',     // bitmask=1024
        // 'schoolrep',     // bitmask=2048
      ],
      accessLevels: {
        'public' : '*',
        'anon': ['public'],
        'user' : ['user', 'admin'], // all authenticated/logged in user
        //'authorizeduser' : ['centerrep', 'businessrep'], // ['student', 'advisor'],
        //'institutionadmin': ['institutionadmin'],
        'superadmin': ['admin'],
        //'admin': ['admin', 'institutionadmin'],
        //'angel': ['angel'],
        //'ff': ['family', 'friend'],
        //'student': ['student'],
        //'centerrep': ['centerrep'],
        //'businessrep': ['businessrep'],
      },
      httpError: {'status':{'success': false, 'msg':'Error in connecting to the REST server'}},
      dataError: {'status':{'success': false, 'msg':'Error in data'}},
      formElements: [
        {id: 1, name: 'Text', value: 'text'},
        {id: 2, name: 'Number', value: 'number'},
        {id: 3, date: 'Date', value: 'date'},
        {id: 6, date: 'Text', value: 'text'}
      ],
      appModulesPath: 'scripts/src/',
      appDefaultRoute: 'anon.login',
      appDefaultUserRoute: 'user.stats-pr-list',
      googleAnalyticsAndroidKey: '', //'UA-63017146-7', // For Android
      googleAnalyticsIOSKey: '', //'UA-63017146-8', // For Ios
      googleAnalyticsKey: '', // For all other OS
    });

})();
