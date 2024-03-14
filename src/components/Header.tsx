import { Center, Flex, Grid, Image, Text } from '@mantine/core';
import { DarkModeButton } from './DarkModeButton';

const randomColor = (): string => {
  const colors = [
    'blue',
    'red',
    'yellow',
    'teal',
    'pink',
    'gray',
    'cyan',
    'indigo',
    'lime',
    'green',
    'orange',
    'purple',
    'violet'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const Header = (): JSX.Element => {
  return (
    <>
      <Flex justify='flex-end'>
        <DarkModeButton />
      </Flex>
      <Grid mb={'md'}>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Center>
            <Image h={100} w='auto' radius={'xl'} src='./icon.jpg' alt='cute cat!' />
          </Center>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Text component='span' fz={'60px'} fw={'bold'}>
            tur
            <Text
              component='span'
              variant='gradient'
              gradient={{ from: randomColor(), to: randomColor() }}
              inherit
            >
              ai
            </Text>
            .work
          </Text>
        </Grid.Col>
      </Grid>
    </>
  );
};
