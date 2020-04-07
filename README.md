# CognitoSignIn
Initial setup steps  
```npx create-react-app <reponame>``` {note that the repo name must be all lower case, and you can build the app in the current repo by using the reponame '```.```'}  

if you don't have amplify installed run the following  
```npm install aws-amplify-react```  

to configure the application with aws  
```amplify configure```
- sign into aws acount
- select correct region (us-east-2 for ohio)
- specify IAM user
- grant user permissions
- copy and paste keys
- defualt profile

```amplify init```  
- default proj name
- give environment a name (not terribly important)
- select your editor
- select javascript
- select react  
- default src
- default distribution
- default build command
- default start command
- use aws profile
- choose default profile

```amplify add auth```  
- manual config  
- user sign-up, sign-in  
- default project
- default identity pool
- do NOT allow unauthenticated logins  
- do not enable 3rd party authentification  
- sign in with username  
- do not add user pool groups
- No admin queries api
- turn off multifactor authentication  
- diable email based registration use sms/totop as an alternative  
- default sms message
- dont enable following capabilities
- do not override default password policy
- select the email attribute requirement (press space)
- select the phone number requirement (press space) 
- once you have unchecked email and checked phone number you can hit enter 
- default token experiration  
- do not specify user attributes this app can read and write  
- don't enable any of the following capabilities
- yes use OAuth flow (likely won't use this in the long run, but nice to have when starting) --trying no--
- default domain prefix
- redirect signin uri you can enter anything short and memorable and must end with a '/' (example 'https://phonesignin/')
- dont add another signing URI
- redirect signout URI is simimilar (example 'https://phonesignout/)
- no other signout URI
- Authorization code grant
- leave all scopes enabled  
- do not enable any social providers
- dont create lambda triggers

Additional npm stuff  
```npm add aws-amplify```
```npm add aws-amplify-react```


push these changes to aws  
```amplify push```

to test the application add the following to the app.js file   
```import { withAuthenticator } from 'aws-amplify-react'; ```
```import Amplify, { Auth } from 'aws-amplify';  ```  
```import awsconfig from './aws-exports';  ```  
```Amplify.configure(awsconfig);```

then change the final line of app.js to the following  
```export default withAuthentication(App);```