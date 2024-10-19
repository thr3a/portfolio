import '@mantine/code-highlight/styles.css';
import { ColorSchemeScript, Container, MantineProvider, Space, Stack, Title, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState } from 'react';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { SnsLink } from './components/SnsLink';
import { WorkGroup } from './components/WorkGroup';
import { SnsData } from './data/sns';

const theme = createTheme({
  defaultRadius: 'xs',
  fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
  primaryColor: 'violet'
});

export default function App(): JSX.Element {
  const [workGroup, setworkGroup] = useState('all');
  return (
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <ColorSchemeScript defaultColorScheme='auto' />
      <Container mt={'md'} mb={'md'}>
        <Header />
        <Profile />
        <Space h={'md'} />
        <Stack gap={'xs'}>
          {SnsData.map((props, index) => (
            <SnsLink key={index} url={props.url} name={props.name} color={props.color} icon={props.icon} />
          ))}
        </Stack>
        <Space h={'md'} />
        <Title order={2}>Works</Title>
        <WorkGroup workGroup={workGroup} setworkGroup={setworkGroup} />
      </Container>
    </MantineProvider>
  );
}
