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

const DialogComponent = (props) => {

    var openDialog = ((props.outputData == undefined || props.outputData.length <= 0) ? false : true);

    const handleClose = () => {
        openDialog = false;
    };

    return (
        <div>

            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog} maxWidth='lg'>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    IN3 Server
        </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Output IN3 Docker
          </Typography>

                    <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        label="Output IN3 Docker"
                        multiline
                        rows="8"
                        value={props.outputData}
                        margin="normal"
                        variant="outlined"
                    />

                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                        scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                        auctor fringilla.
                        https://in3.readthedocs.io/en/develop/api-node.html#command-line-arguments
          </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Save changes
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default DialogComponent;