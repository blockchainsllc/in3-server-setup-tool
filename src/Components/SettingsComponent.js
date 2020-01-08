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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import PaperComponent from './PaperComponent'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({

    container: {
        flexWrap: 'wrap',
         justifyContent: 'center',
         width: '104%'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(0)
    },
    label: {
        marginTop: theme.spacing(2)
    },
    menu: {
        width: 200,
    },
    margin: {
        margin: theme.spacing(1),
    },
    margin2: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1),
    },
}));




const SettingsComponent = (props) => {

    const classes = useStyles();

    return (

        <form className={classes.container} noValidate autoComplete="off">
            <PaperComponent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Meta data Settings (Optional)</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="orgname"
                                label="Organization Name"
                                className={classes.textField}
                                value={props.orgname}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="profileicon"
                                label="Profile Icon"
                                className={classes.textField}
                                value={props.profileicon}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="description"
                                label="Description"
                                className={classes.textField}
                                value={props.description}
                                onChange={props.handleChange}
                                variant="outlined"
                            /></FormControl></Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="orgurl"
                                label="Organization URL"
                                className={classes.textField}
                                value={props.orgurl}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

            </PaperComponent>

            <br /> <br />

            <PaperComponent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Server Settings</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin2} component="fieldset">

                            <FormLabel component="legend">Chain</FormLabel>
                            <RadioGroup aria-label="position" name="network" value={props.network} onChange={props.handleChange} row>

                                <FormControlLabel
                                    value="Mainnet"
                                    control={<Radio color="primary" />}
                                    label="Mainnet"
                                />

                                <FormControlLabel
                                    value="Kovan"
                                    control={<Radio color="primary" />}
                                    label="Kovan"
                                />

                                <FormControlLabel
                                    value="Goerli"
                                    control={<Radio color="primary" />}
                                    label="Goerli"
                                />

                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="noderegistry"
                                label="Node Registry"
                                className={classes.textField}
                                value={props.noderegistry}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <TextField
                                id='logslevel'
                                select
                                label="Logging Level"
                                className={classes.textField}
                                value={props.logslevel}
                                onChange={props.handleChange}
                                name='logslevel'
                                variant="outlined"
                            >
                                <MenuItem key="Info" value="Info">Info</MenuItem>
                                <MenuItem key="Debug" value="Debug">Debug</MenuItem>
                                <MenuItem key="Error" value="Error">Error</MenuItem>
                            </TextField>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="blockheight"
                                label="Minimum Block Height"
                                className={classes.textField}
                                value={props.blockheight}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                                helperText="IN3 Server will sign blocks after block height range"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="keyphrase1"
                                label="Private Key Pass Phrase"
                                className={classes.textField}
                                value={props.keyphrase1}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                                type="password"
                            />
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="keyphrase2"
                                label="Private Key Pass Phrase ( again )"
                                className={classes.textField}
                                value={props.keyphrase2}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                                type="password"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={props.genPrivateKey} >Generate Private Key</Button>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin2} component="fieldset">
                            <FormLabel component="legend">Node Capabilities</FormLabel>
                            <FormGroup row>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="capproof"
                                            checked={props.capproof}
                                            onChange={props.handleChange}
                                            value="1"
                                            color="primary"
                                        />
                                    }
                                    label="Proof"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="capmultichain"
                                            checked={props.capmultichain}
                                            onChange={props.handleChange}
                                            value="2"
                                            color="primary"
                                        />
                                    }
                                    label="Multichain"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="caparchive"
                                            checked={props.caparchive}
                                            onChange={props.handleChange}
                                            value="4"
                                            color="primary"
                                        />
                                    }
                                    label="Archive"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="caphttp"
                                            checked={props.caphttp}
                                            onChange={props.handleChange}
                                            value="8"
                                            color="primary"
                                        />
                                    }
                                    label="Http"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="caponion"
                                            checked={props.caponion}
                                            onChange={props.handleChange}
                                            value="32"
                                            color="primary"
                                        />
                                    }
                                    label="Onion Routing"
                                />

                            </FormGroup>
                            <a href='https://in3.readthedocs.io/en/develop/spec.html#node-structure' target="_blank">Details of node Capabilities</a>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="encprivatekey"
                                label="Encrypted Private Key"
                                className={classes.textField}
                                value={props.encprivatekey}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={props.downloadEncPKFile} >Export Encrypted Private Key</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="ethnodeurl"
                                label="Ethereum Node URL ( if you dont want to use parity as service in docker-compose)"
                                className={classes.textField}
                                value={props.ethnodeurl}
                                onChange={props.handleChange}
                                variant="outlined"></TextField>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.margin}>If you want to use parity as service in docker-compose and wait for its sync use <b>'docker-compose up incubed-parity'</b> first. Once sync complete then start using 'docker-compose up' or for quick testing you can directly specify parity URL in above text field.</Typography>
                    </Grid>


                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={props.genConfig}>Generate Docker Compose</Button>
                </Grid>

            </PaperComponent>

            <br /> <br />

            <PaperComponent>
                <Grid container spacing={1}>
                    <Grid item xs={11}>
                        <Typography variant="body2" color="textSecondary" component="p">Register IN3 Server</Typography>
                    </Grid>
                    <Grid item xs={1}>{ props.showProgressCircle ?<CircularProgress color="secondary" visible="false"/>: null }</Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="in3nodeurl"
                                label="IN3 Node URL"
                                className={classes.textField}
                                value={props.in3nodeurl}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="deposit"
                                label="Deposit ( ERC20 ) Wei"
                                className={classes.textField}
                                value={props.deposit}
                                onChange={props.handleChange}
                                variant="outlined"
                                helperText="DApp will see if you already have ERC20 wei then It will approve Registry contract to use those as deposite first and then will register node, else first it will convert Ether Wei to ERC20."
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={props.registerin3}>Register IN3 Server</Button>
                    </Grid>


                </Grid>
            </PaperComponent>

            <br />
            
        </form>


    );
}

export default SettingsComponent;