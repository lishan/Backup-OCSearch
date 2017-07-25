'use strict';

angular.module('basic').factory('spinnerInterceptor', ['$q', 'usSpinnerService', '$injector' ,($q, usSpinnerService, $injector)=>{
    return {
      'request': (config) => {
        usSpinnerService.spin('spinner');
        return config;
      },
      'response': (response) => {
        usSpinnerService.stop('spinner');
        return response;
      },
      'responseError': (reason) => {
        if (reason) {
          usSpinnerService.stop('spinner');
          let Notification = $injector.get('Notification');
          if (reason.data && reason.data !== "") {
            Notification.error(reason.data);
          }
        }
        return $q.reject(reason);
      },
    };
}]);
