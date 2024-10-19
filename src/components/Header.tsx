import { Flex, Image, Text } from '@mantine/core';
import { ColorSchemeToggle } from './ColorSchemeToggle';

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
        <ColorSchemeToggle />
      </Flex>
      <Flex align={'center'} justify='center' gap={'lg'} mt={'lg'} mb={'lg'}>
        <Image h={80} w='auto' radius={'xs'} fit={'contain'} src='./icon.jpg' alt='cute cat!' />
        <Text component='div' fz={'clamp(2rem, 1.364rem + 3.18vw, 3.75rem)'} fw={'bold'}>
          tur
          <Text component='span' variant='gradient' gradient={{ from: randomColor(), to: randomColor() }} inherit>
            ai
          </Text>
          .work
        </Text>
      </Flex>
    </>
  );
};
