import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    textField: {
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(1),
        width: 400,
        marginTop: 15
    },
    dense: {

    },
    menu: {
        width: 200,
    },
}));


export default function TextFields() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '0x000000000123',
        node: 'http://rpc-kovan.slock.it',
        port: '8500',
        blockheight: '6',
        noderegistry: '0xc260D84E86871274F648c3B85B8dfC592A8683c9',
        deposit: '100'
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    /*
    minBlockHeight=6 --registry=0xc260D84E86871274F648c3B85B8dfC592A8683c9 --persistentFile=false 
    --autoRegistry-url=http://127.0.0.1:8500 
    --autoRegistry-capabilities-proof=true 
    --autoRegistry-capabilities-multiChain=true 
    --autoRegistry-deposit=50000000000000000000"
     */
    return (
        <form className={classes.container} noValidate autoComplete="off">
            <TextField
                id="outlined-name"
                label="Account"
                className={classes.textField}
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />

            <TextField
                id="outlined-name"
                label="Eth Node URL"
                className={classes.textField}
                value={values.node}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />

            <TextField
                id="outlined-name"
                label="Port"
                className={classes.textField}
                value={values.port}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />

            <TextField
                id="outlined-name"
                label="Block Height"
                className={classes.textField}
                value={values.blockheight}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />

            <TextField
                id="outlined-name"
                label="Node Registry"
                className={classes.textField}
                value={values.noderegistry}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />

            <TextField
                id="outlined-name"
                label="Deposit"
                className={classes.textField}
                value={values.deposit}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
            />




        </form>
    );
}
