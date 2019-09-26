import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
}));

export default function InfoFancyCard() {
  const classes = useStyles();
  const theme = useTheme();

  const handlePageChange = (location) => {
    window.location.href = location;
  }

  return (
    <Card className={classes.card}>
     
      <CardMedia
        className={classes.cover}
        image="/static/images/img.jpg"
        title="Live from space album cover"
      />

      <div className={classes.details}>
        <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2">
                            Incubed Server Setup Wizard
          </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        The Minimal Verification Client. You can use following wizad for generating incube server settings JSON file or command line.
          </Typography>
        </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                    <Button size="small" color="primary" onClick={ () => handlePageChange('https://github.com/slockit/in3')}>
                        Source Code
        </Button>
                    <Button size="small" color="primary" onClick={ () => handlePageChange('https://in3.readthedocs.io/en/latest/')}>
                        Documentation
        </Button>
                </CardActions>
      </div>
    </Card>
  );
}
