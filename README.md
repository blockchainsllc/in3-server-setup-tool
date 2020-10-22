
## Incubed Server Setup Wizard
This wizard could be used for registering Incubed server on node registry contract and generating IN3 Server docker-compose file.

#### Starting Wizard

In the project directory, you can run:

`npm i`  for installing dependencies and then
`npm start` for starting wizard.

This app is already deployed at https://in3-setup.slock.it/ so you can use that as well instead of building from source.

#### Requirements:

* Firefox or Brave with Metamask installed
* Docker compose supporting version 2.1+ compose files

#### How to use:

1. First Generate encrypted private key by filling private key pass phrase, and export that private key.

2. Then fill form for server settings and generate docker compose file. Make sure docker file is exported to same location where you exported encrypted private key. Start incubed server using `docker-compose up`

3. Register Incubed server by specifying your public in3 server URL.

#### Details
There are three sections in wizard app metadata settings, server settings, and registering server.

1. Metadata Settings: These are not mandatory settings but your organization name, profile icon, organiation description and URL could be specified here. Then this will start appearing on IN3 dashboard.

2. Server Settings: 
    * The settings provided here will generate docker-compose.yml file that could be used for running incubed server. First step is to select network ( Mainnet, Ewc, Goerli) this selection will automatically populate predeployed incubed registry contract address.


    * logging level flag is used for specifying logs output. Minimum height is used by server so that server will only sign blocks after that height. Like if you specify 8 as minimum height the server will only sign blocks after ( latest - 8 ).

    * In node capabilities the `proof` option selection means the node is able to deliver proof. If not set, it may only serve pure ethereum JSON/RPC. Thus, simple remote nodes may also be registered as Incubed nodes. The `multichain` selection means same RPC endpoint may also accept requests for different chains. The `archive` option means that if it is set, the node is able to support archive requests returning older states. If not, only a pruned node is running. The `http` option means If set, the node will also serve requests on standard http even if the url specifies https. This is relevant for small embedded devices trying to save resources by not having to run the TLS.

3. Server Registration Section: 
    * For registering you need Incubed node public URL, private key, time out and some deposit ( minimum 0.01 Ether). 

    * The time out means timeout after which the owner is allowed to receive its stored deposit. This information is also important for the client, since an invalid blockhash-signature can only “convict” as long as the server is registered. A long timeout may provide higher security since the node can not lie and unregister right away.

    *  The deposit stored for the node, which the node will lose if it signs a wrong blockhash.

 #### Contributors welcome!

 We at Slock.it believe in the power of the open source community. Feel free to open any issues you may come across, fork
  the repository and integrate in your own projects. You can reach us on various social media platforms for any questions
  and suggestions.  
 
 [![Twitter](https://img.shields.io/badge/Twitter-Page-blue)](https://twitter.com/slockitproject?s=17)
 [![Blog](https://img.shields.io/badge/Blog-Medium-blue)](https://blog.slock.it/)
 [![Youtube](https://img.shields.io/badge/Youtube-channel-blue)](https://www.youtube.com/channel/UCPOrzp3CZmdb5HJWxSjv4Ig)
 [![LinkedIn](https://img.shields.io/badge/Linkedin-page-blue)](https://www.linkedin.com/company/10327305)
 [![Gitter](https://img.shields.io/badge/Gitter-chat-blue)](https://gitter.im/slockit-in3/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
 

#### Got any questions?
 Send us an email at <a href="mailto:team-in3@slock.it">team-in3@slock.it</a>









