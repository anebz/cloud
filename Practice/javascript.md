# javascript

[Install Node.JS and npm](https://www.npmjs.com/get-npm)

Import AWS (`npm install aws-sdk`) and the `ROUTE53_PROFILE` from `./config` and rename it as `profile`. Get credentials from the profile and store them as AWS credentials.

```js
const AWS = require("aws-sdk")
const { ROUTE53_PROFILE: profile } = require("./config")
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile })
```

Some js native ways to access dicts and assign values to new variables, these 2 lines do the same thing.

```js
let {firstName: newvariable} = user
let newvariable = user.firstName
```

## asnyc await

The await operator is used to wait for a Promise, it causes async function execution to pause until a Promise is settled (fulfilled or rejected), and to resume execution of the async function after fulfillment. When resumed, the value of the await expression is that of the fulfilled Promise. If the Promise is rejected, the await expression throws the rejected value.

AWS uses the [Promise property](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Request.html#promise-property). Sending a request using Promises:

```js
var request = s3.putObject({Bucket: 'bucket', Key: 'key'});
var result = request.promise();
result.then(function(data) { ... }, function(error) { ... });
```

`function(data)` is called if the promise is fulfilled, `function(error)` is called if the promise is rejected.

The async/await is just syntactic sugar for `.then.catch`, it achieves the same effect:

```js
async someFunction() {
  try {
    await somePromise
  } catch(err) {
    throw err
  }
}
```
