import React, { Component } from 'react';
import SettingsComponent from '../Components/SettingsComponent';
import ethWallet from 'ethereumjs-wallet';

export default class SettingsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgname: '',
            profileicon: '',
            description:'',
            orgurl: '',
            network: '',
            noderegistry: '',
            logslevel: '',
            blockheight: '',
            privatekey: '',
            keystorepath: '',
            keyphrase: '',
            capabilities: '',
            deposit: '',
            timeout: '',
            ethnodeurl: ''
        }

    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let newState = Object.assign({}, this.props);

        newState[id] = e.target.type === 'checkbox' ? e.target.checked : value;
        this.setState(newState);
    }

    generateConfig = (e) => {
        const { id, value } = e.target;
        alert(this.state.orgname)
    }

    generatePrivateKey = (e) => {
        const wallet = ethWallet.generate();
        //console.log("privateKey: " + wallet.getPrivateKeyString());
        //console.log("address: " + wallet.getAddressString());
        this.setState({ privatekey : wallet.getPrivateKeyString() });
   
        //alert(this.state.privatekey);
    }

    render() {
        return (
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
        )
    }
}

//export default SettingsContainer;