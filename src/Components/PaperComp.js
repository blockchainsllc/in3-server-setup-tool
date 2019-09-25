import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


export default class PaperComp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const classes = makeStyles(theme => ({
            root: {
                padding: theme.spacing(3, 2),
            },
        }));

        return (
            <div>
                <Paper className={classes.root}>
                    {this.props.children}
                </Paper>
            </div>
        );
    }
}