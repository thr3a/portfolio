import { Badge, Button, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCheck, IconMoodSmileBeam, IconSkull, IconX } from '@tabler/icons-react';
import type { PersonType } from '../types';

type Props = {
  name: string;
  selected: PersonType | null;
  result?: PersonType | null;
  showResult: boolean;
  onSelect: (type: PersonType) => void;
};

const typeLabel = (type: PersonType | null) =>
  type === 'knight' ? '正直者' : type === 'knave' ? '嘘つき者' : '未回答';
const typeColor = (type: PersonType | null) => (type === 'knight' ? 'blue' : type === 'knave' ? 'red' : 'gray');

export const PersonToggle = ({ name, selected, result, showResult, onSelect }: Props) => {
  const isCorrect = showResult && result != null && selected === result;
  const isWrong = showResult && result != null && selected !== result;

  if (showResult && result != null) {
    return (
      <Card withBorder bg={isCorrect ? 'green.0' : 'red.0'}>
        <Group gap='md' align='center' wrap='nowrap'>
          <ThemeIcon color={isCorrect ? 'green' : 'red'} variant='filled' size='lg' style={{ flexShrink: 0 }}>
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
          </ThemeIcon>
          <Stack gap={4} style={{ flex: 1 }}>
            <Text fw='bold'>{name}</Text>
            <Group gap='sm' align='flex-end'>
              <Stack gap={2} align='center'>
                <Text size='xs' c='dimmed'>
                  あなたの回答
                </Text>
                <Badge color={typeColor(selected)} variant='filled' size='md'>
                  {typeLabel(selected)}
                </Badge>
              </Stack>
              {isWrong && (
                <>
                  <Text c='dimmed' mb={4}>
                    →
                  </Text>
                  <Stack gap={2} align='center'>
                    <Text size='xs' c='dimmed'>
                      正解
                    </Text>
                    <Badge color={typeColor(result)} variant='light' size='md'>
                      {typeLabel(result)}
                    </Badge>
                  </Stack>
                </>
              )}
            </Group>
          </Stack>
        </Group>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack gap='xs'>
        <Text fw='bold'>{name}</Text>
        <Group gap='sm'>
          <Button
            leftSection={<IconMoodSmileBeam size={14} />}
            variant={selected === 'knight' ? 'filled' : 'outline'}
            color='blue'
            size='sm'
            flex={1}
            onClick={() => onSelect('knight')}
          >
            正直者
          </Button>
          <Button
            leftSection={<IconSkull size={14} />}
            variant={selected === 'knave' ? 'filled' : 'outline'}
            color='red'
            size='sm'
            flex={1}
            onClick={() => onSelect('knave')}
          >
            嘘つき者
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
