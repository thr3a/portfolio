import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState } from 'react';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { Title as MyTitle } from './components/Title';
import { WorkGroup } from './components/WorkGroup';
import { theme } from './theme';

export default function App() {
  const [workGroup, setworkGroup] = useState('all');
  return (
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <ColorSchemeScript defaultColorScheme='auto' />
      <Container mt={'md'} mb={'md'}>
        <Header />
        <MyTitle title='Profile' />
        <Profile />
        <MyTitle title='Works' />
        <WorkGroup workGroup={workGroup} setworkGroup={setworkGroup} />
      </Container>
    </MantineProvider>
  );
}
