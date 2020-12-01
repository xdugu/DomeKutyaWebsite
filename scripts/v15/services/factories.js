// This function concatenates all api request for each of access of store api
angular.module('AduguShopApp').factory('ApiManager',['$http', function ($http) {
    return {
        endPoint: "https://3j1b7pw3nd.execute-api.eu-central-1.amazonaws.com", //prod
        //endPoint: "https://vr0uojtaa1.execute-api.eu-central-1.amazonaws.com", //testing
        //endPoint: "http://127.0.0.1:3000" // local testing,
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

// common functions accross controllers will be saved here
angular.module('AduguShopApp').factory('CommonFuncs', function () {
    return{
    //// Get data from the specified metadata. Returns a null if not found
        getMeta: function(product, name){
            for(let i = 0; i < product.Metadata.length; i++){
                if(product.Metadata[i].name == name)
                    return product.Metadata[i].value;
            }   
            return null;
        }
    }
});