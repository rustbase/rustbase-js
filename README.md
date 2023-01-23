# Rustbase JS
A driver to use Rustbase with NodeJS

# Installation
```bash
npm install rustbase-js
```

# Usage
```js
const { connect } = require('rustbase-js');

const rustbase = connect("rustbase://<url>:23561/supercooldatabase");
```

## With username and password
You can also connect to a Rustbase database with a username and password. Just add them to the URL.
```js
const rustbase = connect("rustbase://username:password@<url>:23561/supercooldatabase");
```

## With SSL
You can also connect to a Rustbase database with SSL. 
```js
const rustbase = connect("rustbase://username:password@<url>:23561/supercooldatabase", {
    tls: true,
});
```

# Contribute
## Prerequisites
- **pnpm**: We use pnpm as our package manager. You can install it with `npm install -g pnpm`.


## Setup
1. Clone the repository: `git clone https://github.com/rustbase/rustbase-js`
2. Enter the directory: `cd rustbase-js`
3. Install dependencies: `pnpm install`

# License
[MIT License](/LICENSE)