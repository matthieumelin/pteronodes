# Ptero-Nodes

Ptero-Nodes is a module allowing the management of nodes.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install Ptero-Nodes.

```bash
npm install ptero-nodes
```

## Notice
If you have a question or if you encounter any bugs, help is available on [our Discord](https://discord.swizen.eu)

When creating your application key make sure you have set the necessary permissions to read the nodes

See [steps](https://prnt.sc/1xf84cv)


## Usage

```javascript
// Import package
const PteroNodes = require("ptero-nodes")

// Init nodes
const Nodes = new PteroNodes.Nodes({
    panel: 'link of your pterodactyl panel',
    api_key: 'your application key',
    interval: 5000 // Optional (1000 = 1s),
    debug: true // Optional,
});

const PteroNodes = require("pteronodes")

// Get all nodes
Nodes.getAllNodes()
// Get node by id
Nodes.getNodeById(1)
// Get node by name
Nodes.getNodeByName("node name")
// Get node status by id
Nodes.getNodeStatusById(1)
// Get node status by name
Nodes.getNodeStatusByName("node name")
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)