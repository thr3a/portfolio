import '@mantine/code-highlight/styles.css';
import { ColorSchemeScript, Container, MantineProvider, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState } from 'react';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { SnsLink } from './components/SnsLink';
import { Title as MyTitle } from './components/Title';
import { WorkGroup } from './components/WorkGroup';
import { SnsData } from './data/sns';
import { theme } from './theme';

export default function App(): JSX.Element {
  const [workGroup, setworkGroup] = useState('all');
  return (
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <ColorSchemeScript defaultColorScheme='auto' />
      <Container mt={'md'} mb={'md'}>
        <Header />
        <MyTitle title='Profile' />
        <Profile />
        <MyTitle title='Navigation' />
        <Stack gap={'xs'}>
          {SnsData.map((props, index) => (
            <SnsLink key={index} url={props.url} name={props.name} color={props.color} icon={props.icon} />
          ))}
        </Stack>
        <MyTitle title='Works' />
        <WorkGroup workGroup={workGroup} setworkGroup={setworkGroup} />
      </Container>
    </MantineProvider>
  );
}
