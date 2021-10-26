# Ptero-Nodes

Ptero-Nodes is a module allowing the management of nodes.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install Ptero-Nodes.

```bash
npm install ptero-nodes
```

## Notice
When creating your application key make sure you have set the necessary permissions to read the nodes

See [steps](https://prnt.sc/1xf84cv)


## Usage

```javascript
const PteroNodes = require("pteronodes")

const Nodes = new PteroNodes.Nodes({
    panel: 'link of your pterodactyl panel',
    api_key: 'your application key',
    interval: 5000 // Optional (1000 = 1s),
    debug: true // Optional
});

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)