import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';
import DialogComponent from '../Components/DialogComponent'
import defaultConfig from '../defaultConfig'

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
            timeout: '',
            ethnodeurl: '',
            outputData: ''
        }

    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let newState = Object.assign({}, this.props);

        if (e.target.type == 'radio'){
            var nw = '0x1';
            if(value=='Kovan'){
                nw="0x2a";
            }
            else if(value=='Goerli'){
                nw="0x5";
            }

            newState["noderegistry"]=defaultConfig.servers[nw].contract;
            newState[e.target.name] = value;}
        else
            newState[id] = value;

        this.setState(newState);
    }

    generateConfig = (e) => {
        var dockerConf="version: '2'\n\
        services:\n\
          incubed-server:\n\
            image: slockit/in3-server:latest\n";

        if(this.state.keystorepath){
            dockerConf+="volumes:\n\
            - $PWD/keys:"+(this.state.keystorepath)+"               # directory where the private key is stored";
        }
        else{}

        dockerConf+="\n\
              ports:\n\
            - 8500:8500/tcp                                         # open the port 8500 to be accessed by the public\n\
            command:\n\
            - --privateKey=/secure/myKey.json                       # internal path to the key\n\
            - --privateKeyPassphrase=dummy                          # passphrase to unlock the key\n\
            - --chain=0x1                                           # chain (Kovan)\n\
            - --rpcUrl=http://incubed-parity:8545                   # URL of the Kovan client\n\
            - --registry=0xFdb0eA8AB08212A1fFfDB35aFacf37C3857083ca # URL of the Incubed registry\n\
            - --autoRegistry-url=http://in3.server:8500             # check or register this node for this URL\n\
            - --autoRegistry-deposit=2                              # deposit to use when registering\n\
                        \n\
          incubed-parity:\n\
            image: slockit/parity-in3:v2.2                          # parity-image with the getProof-function implemented\n\
            command:\n\
            - --auto-update=none                                    # do not automatically update the client\n\
            - --pruning=archive \n\
            - --pruning-memory=30000                                # limit storage";

        //const { id, value } = e.target;
        //alert(this.state.logslevel);

        let newState = Object.assign({}, this.props);
        newState['outputData'] = dockerConf;
        this.setState(newState);

    }

    generatePrivateKey = (e) => {
        const wallet = ethWallet.generate();
        //console.log("privateKey: " + wallet.getPrivateKeyString());
        //console.log("address: " + wallet.getAddressString());
        this.setState({ privatekey: wallet.getPrivateKeyString() });

        //alert(this.state.privatekey);
    }



    render() {
        return (
            <div>
                <SettingsComponent
                    handleChange={this.handleChange}
                    genConfig={this.generateConfig}
                    genPrivateKey={this.generatePrivateKey}

                    handleSubmitF={this.handleSubmit}
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
                    timeout={this.state.timeout}
                    ethnodeurl={this.state.ethnodeurl}
                >
                </SettingsComponent>

                <DialogComponent
                    outputData={this.state.outputData}
                >

                </DialogComponent>
            </div>
        )
    }
}

//export default SettingsContainer;