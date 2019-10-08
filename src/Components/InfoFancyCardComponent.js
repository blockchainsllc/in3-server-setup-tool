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

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
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

export default function InfoFancyCardComponent() {
  const classes = useStyles();

  const handlePageChange = (location) => {
    window.open(
      location,
      '_blank'
    );

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
                        The Minimal Verification Client. You can use following wizad for generating incube server settings JSON file or command line. <br/>
                        1. First fill form for server settings then generate and export encrypted Private key. <br />
                        2. Export docker compose file. <b>Make sure you export docker-compose file to same dir in which encrypted private key is located.</b> <br />
                        3. Start in3 node, and then register your in3 node using this wizard.
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
