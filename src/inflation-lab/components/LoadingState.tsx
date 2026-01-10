import { Container, Text } from '@mantine/core';

export function LoadingState() {
  return (
    <Container size='sm' py='xl'>
      <Text ta='center'>データを読み込んでいます...</Text>
    </Container>
  );
}
