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
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({

    container: {
        flexWrap: 'wrap'
        ,justifyContent: 'center'
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
                        <FormControl  fullWidth className={classes.margin2} component="fieldset">
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

                            </FormGroup>
                            <a href='https://in3.readthedocs.io/en/develop/spec.html#node-structure'>Details of node Capabilities</a>
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



                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={props.genConfig}>Generate Config</Button>
                </Grid>

            </PaperComponent>

            <br /> <br />

            <PaperComponent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Register IN3 Server</Typography>
                    </Grid>

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

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="in3timeout"
                                label="IN3 Timeout (seconds)"
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