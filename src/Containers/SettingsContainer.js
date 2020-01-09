/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3-server
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/

import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent';
import MessageComponent from '../Components/MessageComponent';
import defaultConfig from '../defaultConfig';
import NodeRegistry from '../Contract/NodeRegistry';
import ERC20 from '../Contract/ERC20Wrapper';
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
            blockheight: '10',

            privatekey: '',
            address: '',
            encprivatekey: '',
            keystorepath: '',
            keyphrase1: 's',
            keyphrase2: 's',
            keyexported: false,

            capproof: true,
            caparchive: false,
            caphttp: false,
            caponion: false,
            capbinary: false,
            capstats: false,

            deposit: '10000000000000000',
            in3nodeurl: 'te.u' + Math.random().toString(36).substring(7),
            outputData: '',

            ethnodeurl: '',
            showProgressBar: false,

            showmessage: false,
            message: ""
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

        if (e.target.name === 'network') {
            newState["noderegistry"] = defaultConfig.servers[this.NW[value]].contract;
        }
        if (e.target.type === 'radio' || e.target.name === 'logslevel') {
            newState[e.target.name] = value;
        }
        else if (e.target.type === 'checkbox') {
            newState[id] = e.target.checked;
        }
        else {
            newState[id] = value;
        }

        this.setState(newState);
    }

    generateConfig = (e) => {
        if (this.state.encprivatekey === "") {
            this.showMessage("First generate and export encrypted private key");
            return;
        } else if (!this.state.keyexported) {
            this.showMessage("First export encrypted private key.");
            return;
        }

        const jsonObj = JSON.parse(this.state.encprivatekey);
        const encPKFileName = jsonObj.address + ".json";

        var dockerConf =
            "version: '2.1' \n" +
            "services: \n" +
            " \n" +
            "    incubed-server: \n";

        if (this.state.ethnodeurl === '')
            dockerConf +=
                "        depends_on: \n" +
                "            incubed-parity: \n" +
                "                condition : service_healthy \n";

        dockerConf +=
            "        image: slockit/in3-node:latest \n" +
            "        volumes: \n" +
            "        - ./:/secure                                                # directory where the private key is stored \n" +
            "        ports: \n" +
            "        - 8500:8500/tcp                                             # open the port 8500 to be accessed by the public \n" +
            "        command: \n" +
            "        - --privateKey=/secure/" + encPKFileName + "                # internal path to the key \n" +
            "        - --privateKeyPassphrase=" + (this.state.keyphrase1) + "                                # passphrase to unlock the key \n" +
            "        - --chain=" + this.NW[this.state.network] + "                                                # chain \n" +
            "        - --rpcUrl=" + (this.state.ethnodeurl === '' ? "http://172.15.0.3:8545" : this.state.ethnodeurl) + "                            # URL of the eth client \n" +
            "        - --registry=" + this.state.noderegistry + "      #Incubed Registry contract address \n";

        if (this.state.orgname) dockerConf += "        - --profile-name=" + this.state.orgname + "\n";
        if (this.state.profileicon) dockerConf += "        - --profile-icon=" + this.state.profileicon + "\n";
        if (this.state.description) dockerConf += "        - --profile-comment=" + this.state.description + "\n";
        if (this.state.orgurl) dockerConf += "        - --profile-url=" + this.state.orgurl + "\n";
        if (this.state.logslevel) dockerConf += "        - --logging-level=" + this.state.logslevel + "\n";
        if (this.state.blockheight) dockerConf += "        - --minBlockHeight=" + this.state.blockheight + "\n";

        if (this.state.ethnodeurl === '')
            dockerConf +=
                "        networks: \n" +
                "            incubed_net: \n" +
                "               ipv4_address: '172.15.0.2' \n" +
                " \n" +
                "    incubed-parity:  \n" +
                "        image:  parity/parity:stable                                 \n" +
                "        command:  \n" +
                "        - --auto-update=none                                        # do not automatically update the client \n" +
                "        - --pruning=" + (this.state.caparchive ? "archive" : "auto") + " \n" +
                "        - --pruning-memory=30000                                    # limit storage \n" +
                "        - --chain=" + this.state.network.toLowerCase() + " \n" +
                "        - --jsonrpc-interface=172.15.0.3 \n" +
                "        - --jsonrpc-port=8545 \n" +
                "        - --ws-interface=172.15.0.3 \n" +
                "        - --ws-port=8546 \n" +
                "        - --jsonrpc-experimental \n" +
                "        ports: \n" +
                "        - 8545:8545 \n" +
                "        - 8546:8546 \n" +
                "        healthcheck: \n" +
                "            test: [\"CMD-SHELL\", \"curl --data '{\\\"method\\\":\\\"eth_blockNumber\\\",\\\"params\\\":[],\\\"id\\\":1,\\\"jsonrpc\\\":\\\"2.0\\\"}' -H 'Content-Type: application/json' -X POST http://172.15.0.3:8545\"] \n" +
                "            interval: 10s \n" +
                "            timeout: 10s \n" +
                "            retries: 5 \n" +
                "        networks: \n" +
                "            incubed_net: \n" +
                "                ipv4_address: '172.15.0.3' \n" +
                "  \n" +
                "networks: \n" +
                "    incubed_net: \n" +
                "        driver: bridge \n" +
                "        ipam: \n" +
                "            driver: default \n" +
                "            config: \n" +
                "            - subnet: 172.15.0.0/16 \n";

        let newState = Object.assign({}, this.props);
        newState['outputData'] = dockerConf;
        this.setState(newState);
    }

    generatePrivateKey = (e) => {
        let newState = Object.assign({}, this.props);

        if (this.state.keyphrase1 !== this.state.keyphrase2) {
            this.showMessage("Key Pass Phrase doesnt match");
            newState.keyphrase1 = '';
            newState.keyphrase2 = '';
        }
        else if (this.state.keyphrase1 === '') {
            this.showMessage("Key Phrase cannot be empty");
        }
        else {
            const wallet = ethWallet.generate();
            //var key = Buffer.from(wallet.getPrivateKeyString(), 'hex');
            // var wallet = Wallet.fromPrivateKey(key)

            var str = wallet.toV3String(this.state.keyphrase1);

            newState.encprivatekey = str;
            newState.privatekey = wallet.getPrivateKeyString();
            newState.address = wallet.getAddressString();
        }
        this.setState(newState);
    }

    signForRegister = (url, props, weight, owner, pk) => {

        const msgHash = ethUtil.keccak(
            Buffer.concat([
                in3Common.serialize.bytes(url),
                in3Common.util.toBuffer(props, 24),
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

    mintERC20 = (erc20Contract, fromAddr, amount) => {
        return erc20Contract.methods.mint().send({
            from: fromAddr,
            to: erc20Contract.address,
            value: amount
            , gas: '300000'
        }).on('transactionHash', function (hash) {
            console.log("Transaction Hash: " + hash);
        })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Confirmation Num: " + JSON.stringify(confirmationNumber) + " Receipt: " + receipt)
            })
            .on('receipt', function (receipt) {
                console.log("Receipt: " + JSON.stringify(receipt));
                return receipt;
            })
        // .on('error', function (err) {
        //     console.log(err.message)
        //     return err;
        // });
    }

    sendRegisterNode = (registryContract, url, props, signer, weight, deposit, signature, txSender, nodeRegistryAddr) => {

        return registryContract.methods
            .registerNodeFor(
                url, props, signer, weight, deposit, signature.v, signature.r , signature.s)
            .send({
                from: txSender,
                to: nodeRegistryAddr,
                value: 0
                //,gas: '30000'
            }).on('transactionHash', function (hash) {
                console.log("Transaction Hash: " + hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Confirmation Num: " + JSON.stringify(confirmationNumber) + " Receipt: " + receipt)
            })
            .on('receipt', function (receipt) {
                console.log("Receipt: " + JSON.stringify(receipt));

                return receipt
            });
        // .on('error', function (err) {
        //     this.showMessage(err)
        //     return err
        // });
    }

    sendApprove = (amount, fromAddr, toAddr, erc20Contract) => {
        return erc20Contract.methods.approve(toAddr, amount).send({
            from: fromAddr,
            to: erc20Contract.address,
            value: 0
            //,gas: '30000'
        })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash: " + hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Confirmation Num: " + confirmationNumber + " Receipt: " + receipt)
            })
            .on('receipt', function (receipt) {
                console.log("Receipt: " + JSON.stringify(receipt));
                return receipt;
            });
        // .on('error', function (err) {
        //     console.log(JSON.stringify(err))
        //     return err;
        // });
    }

    showMessage(str){
        let newState = Object.assign({}, this.props);
        newState['message'] = str;
        newState['showmessage'] = true;
        this.setState(newState);
    }

    showProgress(show){
        let newState = Object.assign({}, this.props);
        newState['showProgressBar'] = show;
        this.setState(newState);
    }

    sendRegTransaction = (web3, window) => {
        this.showProgress(true);

        if (this.state.deposit === "" || (! /^\d*\.?\d*$/.test(this.state.deposit))) {
            this.showMessage("Invalid deposit value");
            this.showProgress(false);
            return;
        }

        const url = this.state.in3nodeurl;
        if (url === "") {
            this.showMessage("IN3 node URL cannot be empty");
            this.showProgress(false);
            return;
        }

        const PK = this.state.privatekey;
        if (PK === '') {
            this.showMessage("First generate private key.");
            this.showProgress(false);
            return;
        }

        if (!this.state.keyexported) {
            this.showMessage("Please export encrypted private key first.");
            this.showProgress(false);
            return;
        }

        const nodeRegistryAddr = '0x4dCA8bCA3bbdA168176440878BBD2691134b4995';//this.state.noderegistry;
        const nodeRegistryContract = new web3.eth.Contract(NodeRegistry.abi, nodeRegistryAddr);

        //const timeout = web3.utils.toHex((parseFloat(this.state.in3timeout) * 60 * 60));
        const weight = web3.utils.toHex(1);

        const props = web3.utils.toHex((this.state.capproof ? 1 : 0) + (this.state.caparchive ? 4 : 0)
                +(this.state.caphttp ? 8 : 0) + (this.state.caponion ? 20 : 0)
                + (this.state.capbinary ? 10 : 0) + (this.state.capstats ? 100 : 0))

        const deposit = this.state.deposit //web3.utils.toHex(Web3.utils.toWei(this.state.deposit, 'ether'));
        const signature = this.signForRegister(url, props, weight, window.web3.currentProvider.selectedAddress, PK);

        //first check erc20 balance
        const erc20Addr = "0x71357768E92C5178C1f8E69aB841b4ed85225AaD"; // <--- hardcoded for testing now
        const erc20Contract = new web3.eth.Contract(ERC20.abi, erc20Addr)

        erc20Contract.methods.balanceOf(window.web3.currentProvider.selectedAddress).call().then((balance) => {

            if (parseInt(balance) < parseInt(deposit)) {
                this.showMessage("Insufficient erc20 funds (" + balance + ") for deposit, first converting " + deposit + " wei to erc20")

                this.mintERC20(
                    erc20Contract,
                    window.web3.currentProvider.selectedAddress,
                    deposit - balance
                ).then((res) => {

                    this.sendApprove(
                        deposit,
                        window.web3.currentProvider.selectedAddress,
                        nodeRegistryAddr,
                        erc20Contract
                    ).then((res) => {

                        this.sendRegisterNode(
                            nodeRegistryContract,
                            url,
                            props,
                            this.state.address,
                            weight,
                            deposit,
                            signature,
                            window.web3.currentProvider.selectedAddress,
                            nodeRegistryAddr).then((res) => {
                                this.showMessage("Registration Completed Successfully")
                            })
                    }).catch(
                        err => {
                            this.showMessage("Some Error Occured. " + err.message);
                            this.showProgress(false);
                        }
                    )
                }).catch(
                    err => {
                        this.showMessage("Some Error Occured. " + err.message);
                        this.showProgress(false);
                    }
                )
            }
            else {
                this.sendApprove(
                    deposit,
                    window.web3.currentProvider.selectedAddress,
                    nodeRegistryAddr,
                    erc20Contract).then((res) => {

                        this.sendRegisterNode(
                            nodeRegistryContract,
                            url,
                            props,
                            this.state.address,
                            weight,
                            deposit,
                            signature,
                            window.web3.currentProvider.selectedAddress,
                            nodeRegistryAddr)
                            .then((res) => {

                                this.showMessage("Registration Completed Successfully");
                                this.showProgress(false);

                            }).catch(
                                err => {
                                    this.showMessage("Some Error Occured. " + err.message);
                                    this.showProgress(false);
                                })

                    }).catch(
                        err => {
                            this.showMessage("Some Error Occured. " + err.message);
                            this.showProgress(false);
                        }
                    )
            }
        }).catch(
            err => {
                this.showMessage("Some Error Occured. " + err.message);
                console.log("Some Error Occured." + JSON.stringify(err));
                this.showProgress(false);
            }
        )
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
                this.showMessage('You Denied MetaMask Access!');
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            var web3 = new Web3(window.web3.currentProvider);
            this.sendRegTransaction(web3, window);
        }
        // Non-DApp Browsers
        else {
            this.showMessage('You have to install MetaMask !');
        }

    }

    handleClose = () => {
        let newState = Object.assign({}, this.props);
        newState['outputData'] = undefined;
        this.setState(newState);
    };

    handleCloseMsg = () => {
        let newState = Object.assign({}, this.props);
        newState['message'] = "";
        newState['showmessage'] = false;
        this.setState(newState);
    }

    downloadEncPKFile = () => {
        let newState = Object.assign({}, this.props);
        newState.keyexported = false;

        if (this.state.encprivatekey === '') {
            this.showMessage("First generate private key.");
        }
        else {
            const element = document.createElement("a");
            const json = document.getElementById('encprivatekey').value;
            const file = new Blob([json], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);

            const jsonObj = JSON.parse(json);

            element.download = jsonObj.address + ".json";
            document.body.appendChild(element);
            element.click();
            newState.keyexported = true;
        }

        this.setState(newState);
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
                    caparchive={this.state.caparchive}
                    caphttp={this.state.caphttp}
                    caponion={this.state.caponion}
                    capbinary={this.state.capbinary}
                    capstats={this.state.capstats}

                    deposit={this.state.deposit}
                    in3nodeurl={this.state.in3nodeurl}

                    registerin3={this.registerin3}

                    downloadEncPKFile={this.downloadEncPKFile}
                    ethnodeurl={this.ethnodeurl}
                    showProgressBar={this.state.showProgressBar}
                >
                </SettingsComponent>

                <DialogComponent
                    outputData={this.state.outputData}
                    handleChange={this.handleClose}
                />
                <MessageComponent 
                    show={this.state.showmessage} 
                    message={this.state.message}
                    handleClose={this.handleCloseMsg}/>

            </div>
        )
    }
}