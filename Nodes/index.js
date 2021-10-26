const axios = require('axios')

class Nodes {
    // Nodes controller
    constructor(options = {}) {
        // Setup options
        if (!options['panel']) return new Error("You must put the link of your panel.");
        this.panel = options['panel'];

        if (!options['api_key']) return new Error("You must put an application key.");
        this.apiKey = options["api_key"];
        this.interval = options["interval"] || 1000 * 3;
        this.debug = options['debug'] || false;

        this.running = false;
        this.connected = false;

        this.nodes = [];

        this.prefix = "[Nodes]";

        // Start
        this.start();
    }

    // Start
    async start() {
        if (this.running) return new Error(`${this.prefix} Already started.`);
        // Running
        this.running = true;
        // Auto fetch
        await this.#autoFetchNodes();
    }

    // Stop
    async stop() {
        if (!this.running) return new Error(`${this.prefix} Not started.`);
        this.running = false;
    }

    // Auto fetch nodes
    async #autoFetchNodes() {
        if (!this.running) return new Error(`${this.prefix} Not started.`);
        setInterval(async () => await this.#asyncFetchNodes(), this.interval);
    }

    status(res) {
        if (res.status === 200) {
            if (!this.connected) {
                this.connected = true;
                if (this.debug) console.log(`${this.prefix} Nodes successfully connected.`);
            }
            const datas = res.data.data;

            datas.forEach(data => this.nodes.push(data));

            if (this.debug) console.log(`${this.prefix} Successfully fetched nodes.`);
        }
    }

    async #asyncFetchNodes() {
        await axios(`${this.panel}/api/application/nodes`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.apiKey}`
            }
        }).then(res => {
            this.status(res);
        });
    }

    // Get all nodes
    getAllNodes() {
        return this.nodes;
    }
    // Get node by name
    getNodeByName(name) {
        return this.nodes.find(node => node.attributes.name.replace(" ", "").toLowerCase() === name.replace(" ", "").toLowerCase());
    }
}

module.exports = Nodes;