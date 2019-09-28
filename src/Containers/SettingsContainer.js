import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent';
import defaultConfig from '../defaultConfig';
import NodeRegistry from '../Contract/NodeRegistry';
import path from 'path';
import Web3 from 'web3';
import soliditySha3 from "web3-utils";

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
            keystorepath: '',
            keyphrase: '',

            capabilities: '',
            deposit: '',
            in3timeout: '',
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
        const wallet = ethWallet.generate();
        //console.log("privateKey: " + wallet.getPrivateKeyString());
        //console.log("address: " + wallet.getAddressString());
        this.setState({ privatekey: wallet.getPrivateKeyString() });

    }

    registerin3 = (e) => {
        // Modern DApp Browsers
        if (window.ethereum) {
            var web3 = new Web3(window.ethereum);
            try {
                window.ethereum.enable().then(function () {
                    // User has allowed account access to DApp...
                    let nodeRegistry = "0xb43D758e8f2158Ff807C9d53E779ab967bEfb9b1";
                    let abi = NodeRegistry.abi;
                    let myContract = new web3.eth.Contract(abi, nodeRegistry);

                    //incoming params
                    const proof = true;
                    const multiChain = false;
                    const _url = "http://127.0.0.1:8501";
                    const _timeout = 10;
                    const _weight = 1;
                    const _props = web3.utils.toHex((proof ? 1 : 0) + (multiChain ? 2 : 0))
                    const deposit = web3.utils.toHex(Web3.utils.toWei('100', 'ether')); //100 ether

                    const encoded = web3.utils.soliditySha3(
                        _url,
                        parseInt(_props, 16),
                        _timeout,
                        _weight,
                        window.web3.currentProvider.selectedAddress
                    );

                    var h = web3.utils.sha3(encoded);
                    web3.eth.sign(h, window.web3.currentProvider.selectedAddress).then(function (sigi) {
                        alert(sigi);
                        
                        var sig = sigi.slice(2);
                        var _r = `0x${sig.slice(0, 64)}`;
                        var _s = `0x${sig.slice(64, 128)}`;
                        var _v = web3.utils.toDecimal(sig.slice(128, 130)) + 27;

                        let response = myContract.methods
                            .registerNodeFor(
                                _url,
                                _props,
                                _timeout,
                                window.web3.currentProvider.selectedAddress,
                                _weight,
                                _v,
                                _r,
                                _s
                            )
                            .send({
                                from: window.web3.currentProvider.selectedAddress,
                                to: nodeRegistry,
                                value: deposit
                                //gasPrice: '20000000000'
                            });
                            
                            response.catch(function (response) {
                                alert("error : ", response);
                            });
                            
                            response.then(function (response) {
                                alert("response: ", response);
                            });
                        
                    });
                });
            } catch (e) {
                // User has denied account access to DApp...
                alert('You Denied MetaMask Access!');
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            var web3 = new Web3(window.web3.currentProvider);
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
                    privatekey={this.state.privatekey}
                    keystorepath={this.state.keystorepath}
                    keyphrase={this.state.keyphrase}

                    capabilities={this.state.capabilities}
                    deposit={this.state.deposit}
                    in3timeout={this.state.in3timeout}
                    ethnodeurl={this.state.ethnodeurl}

                    registerin3={this.registerin3}
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