import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { Header } from './Header';
import { Profile } from './Profile';
import { Title as MyTitle } from './Title';
import { theme } from './theme';
import { WorkGroup } from './WorkGroup';

export default function Portfolio() {
  const [workGroup, setworkGroup] = useState('featured');
  return (
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <ColorSchemeScript defaultColorScheme='auto' />
      <Container my='md'>
        <Header />
        <MyTitle title='Profile' />
        <Profile />
        <MyTitle title='Works' />
        <WorkGroup workGroup={workGroup} setworkGroup={setworkGroup} />
      </Container>
    </MantineProvider>
  );
}
