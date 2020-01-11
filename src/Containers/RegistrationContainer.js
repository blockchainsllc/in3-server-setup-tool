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
import RegistrationComponent from '../Components/RegistrationComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent';
import MessageComponent from '../Components/MessageComponent';
import defaultConfig from '../defaultConfig';
import NodeRegistry from '../Contract/NodeRegistry';
import ERC20 from '../Contract/ERC20Wrapper';
import Web3 from 'web3';

const in3Common = require('in3-common');
const ethUtil = require('ethereumjs-util');


export default class RegistrationContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

            network: 'Mainnet',
            noderegistry: defaultConfig.servers['0x1'].contract,
            blockheight: '10',

            privatekey: '',
            address: '',
            encprivatekey: '',
            keystorepath: '',
            keyphrase1: '',
            keyphrase2: '',
            keyexported: false,

            capproof: true,
            caparchive: false,
            caphttp: false,
            caponion: false,
            capbinary: false,
            capstats: false,
            capsigner: false,

            deposit: '10000000000000000',
            in3nodeurl: '',  //Math.random().toString(36).substring(7),

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
                url, props, signer, weight, deposit, signature.v, signature.r, signature.s)
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
            this.showMessage("First generate private key using step 1 or import using file.");
            this.showProgress(false);
            return;
        }

        const nodeRegistryAddr = this.state.noderegistry;
        const nodeRegistryContract = new web3.eth.Contract(NodeRegistry.abi, nodeRegistryAddr);

        const weight = web3.utils.toHex(1);

        let props = web3.utils.toHex(
            (((this.state.capproof ? 1 : 0) + (this.state.caparchive ? 4 : 0)
                + (this.state.caphttp ? 8 : 0) + (this.state.caponion ? 20 : 0)
                + (this.state.capbinary ? 10 : 0) + (this.state.capstats ? 100 : 0) 
                + (this.state.capsigner ? 40 : 0)) * 2147483648)
            + this.state.blockheight)

        const deposit = this.state.deposit //web3.utils.toHex(Web3.utils.toWei(this.state.deposit, 'ether'));
        const signature = this.signForRegister(url, props, weight, window.web3.currentProvider.selectedAddress, PK);

        nodeRegistryContract.methods.supportedToken().call().then((erc20Addr) => {

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

    //utility functions
    showMessage(str) {
        let newState = Object.assign({}, this.props);
        newState['message'] = str;
        newState['showmessage'] = true;
        this.setState(newState);
    }

    showProgress(show) {
        let newState = Object.assign({}, this.props);
        newState['showProgressBar'] = show;
        this.setState(newState);
    }

    handleCloseMsg = () => {
        let newState = Object.assign({}, this.props);
        newState['message'] = "";
        newState['showmessage'] = false;
        this.setState(newState);
    }

    setData = (data) => {
        let newState = Object.assign({}, this.props);

        for (var prop in data) {
            console.log("settings" + prop)
            if (Object.prototype.hasOwnProperty.call(data, prop) && prop != "dataChanged" && hasOwnProperty.call(this.state, [prop])) {
                newState[prop] = data[prop];

                //console.log("settings"+prop)
            }
        }
        this.setState(newState);
    }

    componentDidMount() {
        this.setData(this.props.downData)
        console.log("reg down data")
        console.log(this.props.downData)
    }

    handleFile = (e) => {
        const content = e.target.result;
        this.decryptandLoadPK(content);
      }

    onFileHandler = event => {
        
        if (this.state.keyphrase1 === "") {
            this.showMessage("Invalid Pass Phrase!");
            return;
        }

        var file = event.target.files[0];
        var textType = /json.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = this.handleFile;
            reader.readAsText(file);
        }
    }

    decryptandLoadPK = data => {
        if (this.state.keyphrase1 === "") {
            this.showMessage("Invalid Pass Phrase!");
            return;
        }

        let newState = Object.assign({}, this.props);

        var wallet;
        try{
            wallet = ethWallet.fromV3(data, this.state.keyphrase1);}
        catch(e){
            this.showMessage("Some error occured! "+e.message);
            console.log("err"+e.message)
            return;
        }

        newState.encprivatekey = data;

        newState.privatekey = wallet.getPrivateKeyString();
        newState.address = wallet.getAddressString();
    
        this.setState(newState);

    }

    render() {
        return (
            <div>
                <RegistrationComponent
                    handleChange={this.handleChange}

                    network={this.state.network}
                    noderegistry={this.state.noderegistry}
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
                    capsigner={this.state.capsigner}

                    deposit={this.state.deposit}
                    in3nodeurl={this.state.in3nodeurl}

                    registerin3={this.registerin3}

                    showProgressBar={this.state.showProgressBar}

                    onFileHandler={this.onFileHandler}
                >
                </RegistrationComponent>

                <MessageComponent
                    show={this.state.showmessage}
                    message={this.state.message}
                    handleClose={this.handleCloseMsg} />

            </div>
        )
    }
}
