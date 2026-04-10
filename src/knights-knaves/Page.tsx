import { Box, Container, MantineProvider, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconMasksTheater } from '@tabler/icons-react';
import { theme } from '../theme';
import { PuzzleGenerator } from './components/PuzzleGenerator';

export default function KnightsKnavesPage() {
  useDocumentTitle('正直者と嘘つき者パズル');

  return (
    <MantineProvider theme={theme}>
      <Box bg='dark.7' py='xl'>
        <Container size='sm'>
          <Stack gap='sm' align='center' ta='center'>
            <ThemeIcon color='yellow.4' variant='transparent' size={48}>
              <IconMasksTheater size={42} />
            </ThemeIcon>
            <Title order={1} c='gray.0' fz={{ base: 24, sm: 32 }}>
              正直者と嘘つき者パズル
            </Title>
            <Text c='gray.4' size='sm' fs='italic'>
              誰かが真実を語り、誰かが嘘を重ねる。信じるべきは誰か？
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size='sm' py='xl'>
        <Stack id='main'>
          <PuzzleGenerator />
        </Stack>
      </Container>
    </MantineProvider>
  );
}
