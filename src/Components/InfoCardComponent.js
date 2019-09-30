import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export default class InfoCardComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handlePageChange(location) {
        window.location.href = location;
    }

    render() {
        return (
            <Card>
                <CardActionArea>

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Incubed Server Setup Wizard
          </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            The Minimal Verification Client. You can use following wizad for generating incube server settings JSON file or command line.
          </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{ justifyContent: 'center' }}>
                    <Button size="small" color="primary" onClick={() => this.handlePageChange('https://github.com/slockit/in3')}>
                        Source Code
        </Button>
                    <Button size="small" color="primary" onClick={() => this.handlePageChange('https://in3.readthedocs.io/en/latest/')}>
                        Documentation
        </Button>
                </CardActions>
            </Card>
        );
    }
}
