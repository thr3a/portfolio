import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { Header } from './Header';
import { Profile } from './Profile';
import { Title as MyTitle } from './Title';
import { WorkGroup } from './WorkGroup';
import { theme } from './theme';

export default function Portfolio() {
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
