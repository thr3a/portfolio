import { Flex, Image, Text } from '@mantine/core';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import * as classes from './Header.css';

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

export const Header = () => {
  return (
    <>
      <Flex justify='flex-end'>
        <ColorSchemeToggle />
      </Flex>
      <Flex align='center' justify='center' gap='lg' my='lg' direction={{ base: 'column', sm: 'row' }}>
        <Image h='12vh' w='auto' radius='100%' fit='contain' src='./icon.jpg' alt='cute cat!' />
        <Text component='div' className={classes.title} fw='bold' ta={{ base: 'center', sm: 'left' }}>
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
