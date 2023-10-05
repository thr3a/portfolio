import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import { MantineProvider, createTheme, Container, ColorSchemeScript, Stack, Space, Title } from '@mantine/core';
import { WorkData } from './data/works';
import { Work } from './components/Work';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { SnsLink } from './components/SnsLink';
import { SnsData } from './data/sns';

const theme = createTheme({
  defaultRadius: 'xs',
  fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif'
});

export default function App () {
  return <MantineProvider theme={theme} defaultColorScheme='auto'>
    <ColorSchemeScript defaultColorScheme='auto' />
    <Container mt={'md'} mb={'md'}>
      <Header></Header>
      <Profile></Profile>
      <Space h={'md'}></Space>
      <Stack gap={'xs'}>
        {SnsData.map((props, index) => (
          <SnsLink key={index} url={props.url} name={props.name} color={props.color} icon={props.icon}></SnsLink>
        ))}
      </Stack>
      <Space h={'md'}></Space>
      <Title order={2}>Works</Title>
      <Stack gap={'xs'}>
        { WorkData.map((work, index) => (<Work key={index} {...work} />)) }
      </Stack>
    </Container>
  </MantineProvider>;
}
