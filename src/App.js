import React from 'react';
import './App.css';
import 'typeface-roboto';
import AppBarComponent from './Components/AppBarComponent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import SettingsContainer from './Containers/SettingsContainer';
import InfoFancyCardComponent from './Components/InfoFancyCardComponent';

function App() {
  return (
    <div className="App">
      <AppBarComponent />

      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <br />
          <InfoFancyCardComponent></InfoFancyCardComponent>
          <br />
          <SettingsContainer></SettingsContainer>
        </Container>
      </React.Fragment>

    </div>
  );
}

export default App;
