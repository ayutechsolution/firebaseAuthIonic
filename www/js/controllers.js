angular.module('starter.controllers', [])
.controller('homeCtrl', function($scope, $stateParams, $firebaseAuth, $firebaseObject, $state, firebaseUrl, $rootScope) {
  console.log($rootScope.Userdata);
  var ref = new Firebase(firebaseUrl);
                  if ($rootScope.Userdata.google) {
                                $scope.name = $rootScope.Userdata.google.displayName;
                                $scope.imageURl=$rootScope.Userdata.google.profileImageURL;
                                $scope.gender=$rootScope.Userdata.google.cachedUserProfile.gender;
                            }
                            if ($rootScope.Userdata.facebook) {
                                $scope.name = $rootScope.Userdata.facebook.displayName;
                                $scope.imageURl=$rootScope.Userdata.facebook.profileImageURL;
                                $scope.gender=$rootScope.Userdata.facebook.cachedUserProfile.gender;
                            }
                            $scope.logout = function () {
                ref.unauth();
                $state.go('login');
            }
})
.controller('loginCtrl', function($scope, $stateParams, $firebaseAuth, $firebaseObject, $state, firebaseUrl, $rootScope) {
 console.log('hii there');
            $scope.isLoggedIn  = false;

            var ref = new Firebase(firebaseUrl);
            var authObj = $firebaseAuth(ref);

            //initialize and get current authenticated state:
            init();
        
            function init(){
                authObj.$onAuth(authDataCallback);
                if (authObj.$getAuth()){
                    $scope.isLoggedIn  = true;
                }
                
            }

            function authDataCallback(authData) {
                if (authData) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                    $scope.isLoggedIn = true;
                    var user = $firebaseObject(ref.child('users').child(authData.uid));
                    $rootScope.Userdata=authData; 
                    $state.go('home');
                    console.log($rootScope.Userdata);
                    user.$loaded().then(function () {
                        if (user.name == undefined) {
                            var newUser = {
                                rooms: [],
                                maxRooms: 5
                            };
                            if (authData.google) {
                                newUser.name = authData.google.displayName;
                            }
                            if (authData.github) {
                                newUser.name = authData.github.username;
                            }
                            if (authData.facebook) {
                                newUser.name = authData.facebook.displayName;
                            }
                            user.$ref().set(newUser);

                        }
                    });


                } else {
                    console.log("User is logged out");
                    $scope.isLoggedIn = false;
                }
            }
            
            
            firebaseAuthLogin = function(provider){
              console.log("google");
                authObj.$authWithOAuthPopup(provider).then(function (authData) {
                    $rootScope.Userdata=authData;
                    console.log("Authenticated successfully with provider " + provider +" with payload:", authData);
                    $state.go('home');
                }).catch(function (error) {
                    console.error("Authentication failed:", error);
                });
                
            }
            $scope.googleLogin = function () {
              console.log('google login');
                    firebaseAuthLogin('google');
            }
            $scope.facebookLogin = function () {
                firebaseAuthLogin('facebook');
            }
            

        });
 



