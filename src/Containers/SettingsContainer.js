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

export default class SettingsContainer extends Component {
    constructor(props) {
        super(props);
        
        this.NW = {
            "Mainnet": "0x1",
            "Kovan": "0x2a",
            "Goerli": "0x5"
        };

        this.contracts = {
            "Mainnet": "0x6c095a05764a23156efd9d603eada144a9b1af33",
            "Kovan": "0xf14d54e349ac971ab6280d6d99f7152c9a06b0b3",
            "Goerli": "0x635cccc1db6fc9e3b029814720595092affba12f"
        }

        this.state = {
            orgname: '',
            profileicon: '',
            description: '',
            orgurl: '',
            network: 'Mainnet',
            noderegistry: this.contracts["Mainnet"],//defaultConfig.servers['0x1'].contract,
            logslevel: 'Info',
            blockheight: '10',

            privatekey: '',
            address: '',
            encprivatekey: '',
            keystorepath: '',
            keyphrase1: '',
            keyphrase2: '',
            keyexported: false,

            outputData: '',

            ethnodeurl: '',
            in3nodeurl: '',
            showProgressBar: false,

            showmessage: false,
            message: ""
        }

    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let newState = Object.assign({}, this.props);

        if (e.target.name === 'network') {
            newState["noderegistry"] = this.contracts[value]; //defaultConfig.servers[this.NW[value]].contract;
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

        this.setState(newState, () => {this.props.dataChanged(this.state)});
    }

    generateConfig = (e) => {
        if (this.state.encprivatekey === "") {
            this.showMessage("First generate and export encrypted private key");
            return;
        } else if (!this.state.keyexported) {
            this.showMessage("First export encrypted private key.");
            return;
        }

        let url;
        try {
            url = new URL(this.state.in3nodeurl);
        }
        catch(err){
            this.showMessage("App cannot generate docker-compose as invalid URL given. ");
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
            "        - "+(url.port?url.port:'80')+":8500/tcp                                             # open the port to be accessed by the public \n" +
            "        command: \n" +
            "        - --privateKey=/secure/" + encPKFileName + "                # internal path to the key \n" +
            "        - --privateKeyPassphrase=" + (this.state.keyphrase1) + "                                # passphrase to unlock the key \n" +
            "        - --chain=" + this.NW[this.state.network] + "                                                # chain \n" +
            "        - --rpcUrl=" + (this.state.ethnodeurl === '' ? "http://192.168.1.3:8545" : this.state.ethnodeurl) + "                            # URL of the eth client \n" +
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
                "               ipv4_address: '192.168.1.2' \n" +
                " \n" +
                "    incubed-parity:  \n" +
                "        image:  parity/parity:stable                                 \n" +
                "        command:  \n" +
                "        - --auto-update=none                                        # do not automatically update the client \n" +
                "        - --pruning=" + (this.state.caparchive ? "archive" : "auto") + " \n" +
                "        - --chain=" + this.state.network.toLowerCase() + " \n" +
                "        - --jsonrpc-interface=192.168.1.3 \n" +
                "        - --jsonrpc-port=8545 \n" +
                "        - --jsonrpc-experimental \n" +
                "        - --no-warp \n" +
                "        volumes: \n"+
                "        - ./chaindata:/home/parity/.local/share/io.parity.ethereum/ \n"+
                "        ports: \n" +
                "        - 8545:8545 \n" +
                "        - 30303:30303 \n"+
                "        - 30303:30303/udp \n"+
                "        healthcheck: \n" +
                "            test: [\"CMD-SHELL\", \"curl --data '{\\\"method\\\":\\\"eth_blockNumber\\\",\\\"params\\\":[],\\\"id\\\":1,\\\"jsonrpc\\\":\\\"2.0\\\"}' -H 'Content-Type: application/json' -X POST http://192.168.1.3:8545\"] \n" +
                "            interval: 10s \n" +
                "            timeout: 10s \n" +
                "            retries: 5 \n" +
                "        networks: \n" +
                "            incubed_net: \n" +
                "                ipv4_address: '192.168.1.3' \n" +
                "  \n" +
                "networks: \n" +
                "    incubed_net: \n" +
                "        driver: bridge \n" +
                "        ipam: \n" +
                "            driver: default \n" +
                "            config: \n" +
                "            - subnet: 192.168.1.0/20 \n";

        let newState = Object.assign({}, this.props);
        newState['outputData'] = dockerConf;
        this.setState(newState, () => {this.props.dataChanged(this.state)});
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
        this.setState(newState, () => {this.props.dataChanged(this.state)});
    }

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

        this.setState(newState, () => {this.props.dataChanged(this.state)});
    }

    //retain state on tab coming back
    setData = (data) => {
        let newState = Object.assign({}, this.props);

        for (var prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop) && prop!=="dataChanged" ) {
                newState[prop] = data[prop];
            }
        }
        newState['outputData'] = undefined;
        this.setState(newState);
    }

    componentDidMount(){
        this.setData(this.props.downData)
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
                    handleClose={this.handleCloseMsg} />

            </div>
        )
    }
}
