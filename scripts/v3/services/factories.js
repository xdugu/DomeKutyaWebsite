// This function concatenates all api request for each of access of store api
angular.module('AduguShopApp').factory('ApiManager',['$http', function ($http) {
    return {
        endPoint: "https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1",
        setEndPoint: function(address){
            this.endPoint = address;
        },
        get: function(mode, method, params){
            //getting credentials ready for 'closed' or locked apis
            // let creds = localStorage.getObj("credentials");
            let auth = null;

            str = `${this.endPoint}/${mode}/${method}?`;
            for(key in params){
                str+=`${key}=${params[key]}&`
            }
            // removing '&' sign at end if required
            if(str[str.length - 1] == '&'){
                str = str.substring(0, str.length - 1);
            }
            return $http({
                method: 'GET',
                crossDomain : true,
                url: str,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
            });

        },

        post: function(mode, method, params, body){
            //let creds = localStorage.getObj("credentials");
            let auth = null;

            str = `${this.endPoint}/${mode}/${method}?`;
            for(key in params){
                str+=`${key}=${params[key]}&`
            }
            // removing '&' sign at end if required
            if(str[str.length - 1] == '&' || str[str.length - 1] == '?'){
                str = str.substring(0, str.length - 1);
            }
            return $http({
                        method: 'POST',
                        crossDomain : true,
                        url: str,
                        data: angular.toJson(body),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                    });
        }

    }

}]);