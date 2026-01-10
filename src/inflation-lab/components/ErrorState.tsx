import { Container, Text } from '@mantine/core';

type ErrorStateProps = {
  error: string;
};

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Container size='sm' py='xl'>
      <Text c='red' ta='center'>
        {error}
      </Text>
    </Container>
  );
}
