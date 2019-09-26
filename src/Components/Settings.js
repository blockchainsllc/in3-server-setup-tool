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

const useStyles = makeStyles(theme => ({
    container: {
        //display: 'flex',
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

export default function Settings() {
    const [value, setValue] = React.useState('female');

    const [state, setState] = React.useState({
        age: '',
        name: 'hai',
    });

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const classes = useStyles();
    const [values, setValues] = React.useState({
        orgname: '',
        profileicon: '',
        description: ''

    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

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
                                value={values.orgname}
                                onChange={handleChange('name')}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Profile Icon"
                                className={classes.textField}
                                value={values.profileicon}
                                onChange={handleChange('name')}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Description"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                variant="outlined"
                            /></FormControl></Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Organization URL"
                                className={classes.textField}
                                value={values.orgurl}
                                onChange={handleChange('name')}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

            </PaperComp>

            <br />

            <PaperComp>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Server Settings</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} component="fieldset">
                            <FormLabel component="legend">Chain</FormLabel>
                            <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>

                                <FormControlLabel
                                    value="start"
                                    control={<Radio color="primary" />}
                                    label="Mainnet"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="start"
                                    control={<Radio color="primary" />}
                                    label="Kovan"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="start"
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
                                id="outlined-name"
                                label="Node Registry"
                                className={classes.textField}
                                value={values.profileicon}
                                onChange={handleChange('name')}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">Logging Level</InputLabel>
                            <Select
                                native
                                value={state.age}
                                onChange={handleChange('age')}
                                labelWidth={labelWidth}
                                inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value="" />
                                <option value={10}>Info</option>
                                <option value={20}>Debug</option>
                                <option value={30}>Error</option>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Minimum Block Height"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                margin="normal"
                                variant="outlined"
                                helperText="IN3 Server will sign blocks after block height range"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={10}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Private Key"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" className={classes.button}>Generate Private Key</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Either Generate Private key or specify keystore path</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Key Store File Path"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>

                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Private Key Phrase to Unlock Keystore"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button}>Generate Config</Button>
                </Grid>

            </PaperComp>

            <br />

            <PaperComp>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" component="p">Register IN3 Server</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin} component="fieldset">
                            <FormLabel component="legend">Node Capabilities</FormLabel>
                            <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>

                                <FormControlLabel
                                    value="start"
                                    control={<Radio color="primary" />}
                                    label="Proof"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="start"
                                    control={<Radio color="primary" />}
                                    label="Multi chain"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="start"
                                    control={<Radio color="primary" />}
                                    label="Archive"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="start"
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
                                id="outlined-name"
                                label="Deposit ( Ethers )"
                                className={classes.textField}
                                value={values.profileicon}
                                onChange={handleChange('name')}
                                variant="outlined"
                                helperText="The deposit stored for the node, which the node will lose if it signs a wrong blockhash."
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="IN3 Timeout (ms)"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                variant="outlined"
                                helperText="Timeout after which the owner is allowed to receive its stored deposit"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField
                                id="outlined-name"
                                label="Ethereum Node URL"
                                className={classes.textField}
                                value={values.description}
                                onChange={handleChange('name')}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" className={classes.button}>Register IN3 Server</Button>
                    </Grid>


                </Grid>
            </PaperComp>

        </form>

    );
}
