import { Button, Container, Flex, MantineProvider, Title } from '@mantine/core';
import { theme } from '../theme';
import { SampleForm } from './SampleForm';

function SampleFlex() {
  return (
    <Flex mih={50} bg='gray' gap='md' justify='center' align='center' direction='row-reverse' wrap='wrap-reverse'>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>
  );
}

export default function Template() {
  return (
    <MantineProvider theme={theme}>
      <Container>
        <Title mt={'sm'} order={2}>
          Aboutページ
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          これはAboutページです。
        </Title>
        <SampleFlex />
        <SampleForm />
      </Container>
    </MantineProvider>
  );
}
