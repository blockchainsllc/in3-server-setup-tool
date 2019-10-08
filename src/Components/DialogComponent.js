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
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('dockerOutPut').value], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "docker-compose.yml";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

const DialogComponent = (props) => {

    var openDialog = ((props.outputData == undefined || props.outputData.length <= 0) ? false : true);

    /*const props.handleChange = () => {
        openDialog = false;
    };*/

    return (
        <div>

            <Dialog onClose={props.handleChange} aria-labelledby="customized-dialog-title" open={openDialog} maxWidth='lg'>
                <DialogTitle id="customized-dialog-title" onClose={props.handleChange}>
                    IN3 Server
        </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Output IN3 Docker
          </Typography>

                    <TextField
                        fullWidth
                        id="dockerOutPut"
                        label="Output IN3 Docker"
                        multiline
                        rows="8"
                        value={props.outputData}
                        margin="normal"
                        variant="outlined"
                    />

                    <Typography gutterBottom>
                        Export encrypted private key first on same path where you will export docker-compose.yml .
                        For more details visit: 
                        https://in3.readthedocs.io/en/latest/getting_started.html
          </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={downloadTxtFile}>Download Docker File</Button>
                    <Button onClick={props.handleChange} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default DialogComponent;
