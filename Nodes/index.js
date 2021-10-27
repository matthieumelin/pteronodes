const axios = require('axios')

class Nodes {
    // Nodes controller
    constructor(options = {}) {
        // Setup options
        if (!options['panel']) return console.log("${this.prefix} You must put the link of your panel.");
        this.panel = options['panel'];

        if (!options['api_key']) return console.log("${this.prefix} You must put an application key.");
        this.apiKey = options["api_key"];
        this.interval = options["interval"] || 1000 * 3;
        this.debug = options['debug'] || false;
        this.unit = options['unit'] || "percent";

        this.running = false;

        this.nodes = [];

        this.prefix = "[Ptero-Nodes]";

        // Start
        this.start();
    }

    // Start
    async start() {
        if (this.running) return console.log(`${this.prefix} Already started.`);
        // Running
        this.running = true;
        // Auto fetch
        await this.#autoFetchNodes();
        console.log(`${this.prefix} Started!`);
    }

    // Stop
    async stop() {
        if (!this.running) return console.log(`${this.prefix} Not started.`);
        this.running = false;
        console.log(`${this.prefix} Stopped!`);
    }

    // Auto fetch nodes
    async #autoFetchNodes() {
        if (!this.running) return console.log(`${this.prefix} Not started.`);
        setInterval(async () => await this.#asyncFetchNodes(), this.interval);
    }

    async #asyncFetchNodes() {
        if (isNaN(this.interval)) return console.log(`${this.prefix} ${this.interval} is not a number!`);
        if (this.apiKey.length < 48) return console.log(`${this.prefix} Invalid API Key.`);

        await axios(`${this.panel}/api/application/nodes`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        }).then(async (res) => {
            const datas = res.data.data;
            if (datas.length > 0) {
                datas.forEach(data => {
                    let id = data.attributes.id;
                    axios(`${this.panel}/api/application/nodes/${id}?include=servers,location,allocations`, {
                        method: "GET",
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${this.apiKey}`
                        }
                    }).then(node => {
                        axios(`${this.panel}/api/application/nodes/${id}/configuration`, {
                            method: "GET",
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${this.apiKey}`
                            }
                        }).then(data => {
                            let scheme = node.data.attributes.scheme;
                            let fqdn = node.data.attributes.fqdn;
                            let daemonListen = node.data.attributes.daemon_listen;
                            let token = data.data.token;
                            axios(`${scheme}://${fqdn}:${daemonListen}/api/servers`, {
                                method: "GET",
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`
                                }
                            }).then(status => {
                                const id = node.data.attributes.id;
                                const name = node.data.attributes.name;

                                this.nodes.push({
                                    id: id,
                                    name: name,
                                    status: true,
                                });
                                if (this.debug) console.log(`${this.prefix} ${node.data.attributes.name} is alive!`);
                            }).catch(error => {
                                if (this.debug) console.log(`${this.prefix} ${node.data.attributes.name} is down!`);
                            });
                        })
                    })
                });
            }
        }).catch(error => {
            if (this.debug) console.log(`${this.prefix} No nodes!`);
        });
    }

    // Get all nodes
    getAllNodes() {
        return this.nodes;
    }
    // Get node by id
    getNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }
    // Get node by name
    getNodeByName(name) {
        return this.nodes.find(node => node.name.replace(" ", "").toLowerCase() === name.replace(" ", "").toLowerCase());
    }
    // Get node status by id
    getNodeStatusById(id) {
        const node = this.nodes.find(node => node.id === id);
        return node.status;
    }
    // Get node status by name
    getNodeStatusByName(name) {
        const node = this.nodes.find(node => node.name.replace(" ", "").toLowerCase() === name.replace(" ", "").toLowerCase());
        return node.status;
    }
}

module.exports = Nodes;