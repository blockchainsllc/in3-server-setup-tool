import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent';
import defaultConfig from '../defaultConfig';
import NodeRegistry from '../Contract/NodeRegistry';
import path from 'path';
import Web3 from 'web3';
import soliditySha3 from "web3-utils";
//import EthUtil from "ethereumjs-util";
var ethUtils = require('ethereumjs-util');;


export default class SettingsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgname: '',
            profileicon: '',
            description: '',
            orgurl: '',
            network: 'Mainnet',
            noderegistry: defaultConfig.servers['0x1'].contract,
            logslevel: 'Info',
            blockheight: '6',

            privatekey: '',
            address: '',
            encprivatekey: '',
            keystorepath: '',
            keyphrase1: '',
            keyphrase2: '',

            capabilities: '',
            deposit: '',
            in3timeout: '3600',
            ethnodeurl: '',
            outputData: ''
        }

        this.NW = {
            "Mainnet": "0x1",
            "Kovan": "0x2a",
            "Goerli": "0x5"
        };
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let newState = Object.assign({}, this.props);

        if (e.target.name == 'network') {
            newState["noderegistry"] = defaultConfig.servers[this.NW[value]].contract;
        }
        if (e.target.type == 'radio') {
            newState[e.target.name] = value;
        }
        else
            newState[id] = value;

        this.setState(newState);
    }

    generateConfig = (e) => {
        var dockerConf = "\n\
        version: '2'\n\
        services:\n\
          incubed-server:\n\
            image: slockit/in3-server:latest\n";

        if (this.state.keystorepath && this.state.keyphrase) {

            dockerConf += "volumes:\n\
            - "+ path.dirname(this.state.keystorepath) + ":/secure                                     # directory where the private key is stored";
        }

        dockerConf += "\n\
              ports:\n\
            - 8500:8500/tcp                                         # open the port 8500 to be accessed by the public\n\n\
            commands:\n";

        if (this.state.keystorepath && this.state.keyphrase) {
            dockerConf +=
                "            - --privateKey=/secure/" + (this.state.keystorepath.replace(/^.*[\\\/]/, '')) + "                       # internal path to the key\n\
            - --privateKeyPassphrase="+ (this.state.keyphrase) + "                          # passphrase to unlock the key\n";
        }
        else {
            dockerConf += "            - --privateKey=" + this.state.privatekey;
        }

        dockerConf += "\n\
            - --chain="+ this.NW[this.state.network] + "                                           # chain (Kovan)\n\
            - --rpcUrl=http://incubed-parity:8545                   # URL of the Kovan client\n\
            - --registry="+ this.state.noderegistry + " # URL of the Incubed registry\n";

        if (this.state.orgname) dockerConf += "            - --profile-name=" + this.state.orgname + "\n";
        if (this.state.profileicon) dockerConf += "            - --profile-icon=" + this.state.profileicon + "\n";
        if (this.state.description) dockerConf += "            - --profile-comment=" + this.state.description + "\n";
        if (this.state.orgurl) dockerConf += "            - --profile-url=" + this.state.orgurl + "\n";
        if (this.state.logslevel) dockerConf += "            - --logging-level=" + this.state.logslevel + "\n";
        if (this.state.blockheight) dockerConf += "            - --minBlockHeight=" + this.state.blockheight + "\n";

        dockerConf += "\n\
        incubed - parity: \n\
        image: slockit / parity - in3: v2.2                          # parity - image with the getProof - function implemented\n\
        command: \n\
        - --auto-update=none                                    # do not automatically update the client\n\
        - --pruning=archive \n\
        - --pruning-memory=30000                                # limit storage";

        //const { id, value } = e.target;

        let newState = Object.assign({}, this.props);
        newState['outputData'] = dockerConf;
        this.setState(newState);

    }

    generatePrivateKey = (e) => {

        if (this.state.keyphrase1 != this.state.keyphrase2) {
            alert("Key Pass Phrase doesnt match");
            this.setState({ keyphrase1: '' });
            this.setState({ keyphrase2: '' });
        }
        else if (this.state.keyphrase1 == '') {
            alert("Key Phrase cannot be empty");
        }
        else {
            const wallet = ethWallet.generate();
            //var key = Buffer.from(wallet.getPrivateKeyString(), 'hex');
            // var wallet = Wallet.fromPrivateKey(key)

            var str = wallet.toV3String(this.state.keyphrase1);

            this.setState({ encprivatekey: str });
            this.setState({ privatekey: wallet.getPrivateKeyString() });
            this.setState({ address: wallet.getAddressString() });
        }

        //console.log("privateKey: " + wallet.getPrivateKeyString());
        //console.log("address: " + wallet.getAddressString());
    }

    sendRegTransaction = (web3, window) => {

        let nodeRegistry = "0x7DA81c2d83B0e07DB4AEe9dA0d5DCe8d16b4d245";
        let abi = NodeRegistry.abi;
        let myContract = new web3.eth.Contract(abi, nodeRegistry);

        const proof = true;
        const multiChain = false;
        const _url = "http://127.0.0.1:8503";
        const _timeout = web3.utils.toHex(3600);
        const _weight = web3.utils.toHex(1);
        const _props = web3.utils.toHex((proof ? 1 : 0) + (multiChain ? 2 : 0)) // or 32
        const deposit = web3.utils.toHex(Web3.utils.toWei('5', 'ether'));

        const encoded = web3.utils.soliditySha3(
            _url,
            parseInt(_props, 16),
            parseInt(_timeout, 16),
            parseInt(_weight, 16),
            this.state.address
        );

        const pk = this.state.privatekey;

        const sig = ethUtils.ecsign(
            ethUtils.toBuffer(encoded),
            ethUtils.toBuffer(pk));

        let response = myContract.methods
            .registerNodeFor(
                _url,
                _props,
                _timeout,
                this.state.address,
                _weight,
                sig.v,
                sig.r,
                sig.s
            )
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: nodeRegistry,
                value: deposit
                , gas: '300000'
            });

        response.catch(function (response) {
            alert("error : ", response);
        });

        response.then(function (response) {
            alert("response: ", response);
        });

    }

    registerin3 = () => {
        // Modern DApp Browsers
        if (window.ethereum) {
            var web3 = new Web3(window.ethereum);
            try {
                window.ethereum.enable().then(() => {

                    this.sendRegTransaction(web3, window);
                });
            } catch (e) {
                // User has denied account access to DApp...
                alert('You Denied MetaMask Access!');
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            var web3 = new Web3(window.web3.currentProvider);
            this.sendRegTransaction(web3, window);
        }
        // Non-DApp Browsers
        else {
            alert('You have to install MetaMask !');
        }

    }

    handleClose = () => {
        let newState = Object.assign({}, this.props);
        newState['outputData'] = undefined;
        this.setState(newState);
    };

    downloadEncPKFile = () => {

        if (this.state.encprivatekey == '') {
            alert("First generate private key.");
        }
        else {
            const element = document.createElement("a");
            const json = document.getElementById('encprivatekey').value;
            const file = new Blob([json], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);

            const jsonObj = JSON.parse(json);

            element.download = jsonObj.address + ".json";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        }
    }

    render() {
        return (
            <div>
                <SettingsComponent
                    handleChange={this.handleChange}
                    genConfig={this.generateConfig}
                    genPrivateKey={this.generatePrivateKey}

                    orgname={this.state.orgname}
                    profileicon={this.state.profileicon}
                    description={this.state.description}
                    orgurl={this.state.orgurl}
                    network={this.state.network}
                    noderegistry={this.state.noderegistry}
                    logslevel={this.state.logslevel}
                    blockheight={this.state.blockheight}
                    encprivatekey={this.state.encprivatekey}
                    keystorepath={this.state.keystorepath}
                    keyphrase1={this.state.keyphrase1}
                    keyphrase2={this.state.keyphrase2}

                    capabilities={this.state.capabilities}
                    deposit={this.state.deposit}
                    in3timeout={this.state.in3timeout}
                    ethnodeurl={this.state.ethnodeurl}

                    registerin3={this.registerin3}

                    downloadEncPKFile={this.downloadEncPKFile}
                >
                </SettingsComponent>

                <DialogComponent
                    outputData={this.state.outputData}
                    handleChange={this.handleClose}
                >

                </DialogComponent>
            </div>
        )
    }
}

//export default SettingsContainer;