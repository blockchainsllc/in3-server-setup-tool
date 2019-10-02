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

                    <Grid item xs={10}>
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

                    <Grid item xs={6}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Assign responsibility</FormLabel>
                            <FormGroup row>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.checkedB}
                                            //onChange={handleChange('checkedB')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Proof"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.checkedB}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Multichain"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.checkedB}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Archive"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.checkedB}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Http"
                                />

                            </FormGroup>
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
                        <Button variant="contained" color="primary" className={classes.button} onClick={props.registerin3}>Register IN3 Server</Button>
                    </Grid>


                </Grid>
            </PaperComponent>

            <br />

        </form>


    );
}

export default SettingsComponent;