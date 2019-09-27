import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import PaperComp from './PaperComp'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import { isContinueStatement } from '@babel/types';
import { inherits } from 'util';

const useStyles = makeStyles(theme => ({
    container: {
        flexWrap: 'wrap',
        justifyContent: 'center'
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
    button: {
        margin: theme.spacing(1),
    },
}));

const SettingsComponent = (props) => {

    const classes = useStyles();

    return (

        <form className={classes.container} noValidate autoComplete="off">
            <PaperComp>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Meta data Settings</Typography>
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

            </PaperComp>

            <br /> <br />

            <PaperComp>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Server Settings</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} component="fieldset">

                            <FormLabel component="legend">Chain</FormLabel>
                            <RadioGroup aria-label="position" name="network" value={props.network} onChange={props.handleChange} row>

                                <FormControlLabel
                                    value="Mainnet"
                                    control={<Radio color="primary" />}
                                    label="Mainnet"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="Kovan"
                                    control={<Radio color="primary" />}
                                    label="Kovan"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="Goerli"
                                    control={<Radio color="primary" />}
                                    label="Goerli"
                                    labelPlacement="start"
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
                            <InputLabel htmlFor="logslevel">Logging Level</InputLabel>
                            <Select
                                native
                                value={props.logslevel}
                                onChange={props.handleChange}
                                inputProps={{
                                    name: 'logslevel',
                                    id: 'logslevel',
                                }}
                            >
                                <option value="Info">Info</option>
                                <option value="Debug">Debug</option>
                                <option value="Error">Error</option>
                            </Select>
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

                    <Grid item xs={10}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="privatekey"
                                label="Private Key"
                                className={classes.textField}
                                value={props.privatekey}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={props.genPrivateKey} >Generate Private Key</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Either Generate Private key or specify keystore path</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="keystorepath"
                                label="Key Store File Path"
                                className={classes.textField}
                                value={props.keystorepath}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>

                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="keyphrase"
                                label="Private Key Phrase to Unlock Keystore"
                                className={classes.textField}
                                value={props.keyphrase}
                                onChange={props.handleChange}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={props.genConfig}>Generate Config</Button>
                </Grid>

            </PaperComp>

            <br /> <br />

            <PaperComp>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Register IN3 Server</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} component="fieldset">
                            <FormLabel component="legend">Node Capabilities</FormLabel>
                            <RadioGroup aria-label="position" name="capabilities" value={props.capabilities} onChange={props.handleChange} row>

                                <FormControlLabel
                                    value="Proof"
                                    control={<Radio color="primary" />}
                                    label="Proof"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="Multi chain"
                                    control={<Radio color="primary" />}
                                    label="Multi chain"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="Archive"
                                    control={<Radio color="primary" />}
                                    label="Archive"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="Http"
                                    control={<Radio color="primary" />}
                                    label="Http"
                                    labelPlacement="start"
                                />

                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="deposit"
                                label="Deposit ( Ethers )"
                                className={classes.textField}
                                value={props.deposit}
                                onChange={props.handleChange}
                                variant="outlined"
                                helperText="The deposit stored for the node, which the node will lose if it signs a wrong blockhash."
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="in3timeout"
                                label="IN3 Timeout (ms)"
                                className={classes.textField}
                                value={props.in3timeout}
                                onChange={props.handleChange}
                                variant="outlined"
                                helperText="Timeout after which the owner is allowed to receive its stored deposit"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="ethnodeurl"
                                label="Ethereum Node URL"
                                className={classes.textField}
                                value={props.ethnodeurl}
                                onChange={props.handleChange}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" className={classes.button}>Register IN3 Server</Button>
                    </Grid>


                </Grid>
            </PaperComp>

            <br />

        </form>


    );
}

export default SettingsComponent;