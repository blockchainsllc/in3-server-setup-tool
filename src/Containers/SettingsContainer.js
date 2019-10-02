import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent';
import defaultConfig from '../defaultConfig';
import NodeRegistry from '../Contract/NodeRegistry';
import path from 'path';
import Web3 from 'web3';

const in3Common = require('in3-common');
const ethUtil = require('ethereumjs-util');


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
            keyphrase1: 'a',
            keyphrase2: 'a',

            capproof: false,
            capmultichain: false,
            caphttp: false,
            caparchive: false,

            deposit: '',
            in3timeout: '3600',
            in3nodeurl: '',
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
        else if (e.target.type == 'checkbox'){
            newState[id] = e.target.checked;
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
    }

    signForRegister = (url, props, timeout, weight, owner, pk) => {

        const msgHash = ethUtil.keccak(
            Buffer.concat([
                in3Common.serialize.bytes(url),
                in3Common.serialize.uint64(props),
                in3Common.serialize.uint64(timeout),
                in3Common.serialize.uint64(weight),
                in3Common.serialize.address(owner)
            ])
        )
        const msgHash2 = ethUtil.keccak(in3Common.util.toHex("\x19Ethereum Signed Message:\n32") + in3Common.util.toHex(msgHash).substr(2))
        const s = ethUtil.ecsign((msgHash2), in3Common.serialize.bytes32(pk))

        return {
            ...s,
            address: in3Common.util.getAddress(pk),
            msgHash: in3Common.util.toHex(msgHash2, 32),
            signature: in3Common.util.toHex(s.r) + in3Common.util.toHex(s.s).substr(2) + in3Common.util.toHex(s.v).substr(2),
            r: in3Common.util.toHex(s.r),
            s: in3Common.util.toHex(s.s),
            v: s.v
        }
    }

    sendRegTransaction = (web3, window) => {

        let nodeRegistry = "0x871C190Aa6f16B809c982ffD4679Bd6898754748";
        let abi = NodeRegistry.abi;
        let myContract = new web3.eth.Contract(abi, nodeRegistry);

        const proof = true;
        const multiChain = false;

        const _url = this.state.in3nodeurl;
        if (_url === "") {
            alert("IN3 node URL cannot be empty");
            return;
        }

        const _timeout = web3.utils.toHex(this.state.in3timeout);
        const _weight = web3.utils.toHex(1);
        const _props = web3.utils.toHex((this.state.capproof ? 1 : 0) + (this.state.capmultichain ? 2 : 0)
        + (this.state.caphttp ? 8 : 0)+ (this.state.caparchive ? 4 : 0))

        const deposit = '0x1';//web3.utils.toHex(Web3.utils.toWei('1', 'wei'));

        const PK = this.state.privatekey;
        const node_signerAcc = web3.eth.accounts.privateKeyToAccount(PK);

        const signature = this.signForRegister(_url, _props, _timeout, _weight, window.web3.currentProvider.selectedAddress, PK);

        myContract.methods
            .registerNodeFor(
                _url, _props, _timeout, this.state.address, _weight, signature.v, signature.r, signature.s)
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: nodeRegistry,
                value: deposit
                , gas: '30000'
            }).on('transactionHash', function (hash) {
                alert("Tx Hash" + hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                alert(confirmationNumber + " " + receipt)
            })
            .on('receipt', function (receipt) {
                alert(receipt);
            })
            .on('error', function (err) { alert(err) });
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

                    capproof={this.state.capproof}
                    capmultichain={this.state.capmultichain}
                    caphttp={this.state.caphttp}
                    caparchive={this.state.caparchive}

                    deposit={this.state.deposit}
                    in3timeout={this.state.in3timeout}
                    in3nodeurl={this.state.in3nodeurl}

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