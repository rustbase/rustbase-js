# Rustbase JS
A driver to use Rustbase with NodeJS

# Installation
```bash
npm install rustbase-js
```

# Usage
```js
const { connect } = require('rustbase-js');

const rustbase = connect("rustbase://localhost:23561/supercooldatabase");
```

# Development
```bash
git clone https://github.com/rustbase/rustbase-js
cd rustbase-js 
yarn install # Install dependencies
yarn run build:proto # Build the protobuf files
```

# Roadmap
- [x] Send queries
- [x] Build a query builder


# License
[MIT License](/LICENSE)