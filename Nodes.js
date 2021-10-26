const axios = require('axios')

class Nodes {
    // Nodes controller
    constructor(options = {}) {
        // Setup options
        if (!options['panel']) return new Error("You must put the link of your panel.");
        this.panel = options['panel'];

        if (!options['api_key']) return new Error("You must put an application key.");
        this.interval = options["interval"] || 1000 * 3;

        this.apiKey = options["api_key"];

        this.debug = options['debug'] || false;

        this.connected = false;
        
        this.nodes = [];
        
        this.prefix = "[Nodes]";

        // Auto post
        this.autoPost();
    }

    // Auto post request
    async autoPost() {
        setInterval(async () => await this.post(), this.interval);
    }

    // Post request
    async post() {
        await axios(`${this.panel}/api/application/nodes`, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`
            }
        }).then(res => {
            // Request accepted
            if (res.status === 200) {
                if (!this.connected) {
                    this.connected = true;
                    if (debug) console.log(`${this.prefix} Nodes successfully connected.`);
                }
                const datas = res.data.data;

                datas.forEach(data => this.nodes.push(data));
            
                if (debug) console.log(`${this.prefix} Successfully fetched nodes`);
            }
        });
    }
    // Get all nodes
    getAllNodes() {
        return this.nodes;
    }
}

module.exports = Nodes;