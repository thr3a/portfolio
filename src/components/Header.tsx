import { Image, Center, Grid, Text } from '@mantine/core';

export const Header = (): JSX.Element => {
  return (
    <Grid mb={'md'}>
      <Grid.Col span={{ base: 12, md: 2 }}>
        <Center>
          <Image
            width={100}
            height={100}
            radius={'xl'}
            src="./icon.jpg"
            alt="cute cat!"
          />
        </Center>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 10 }}>
        <Text component='span' fz={'60px'} fw={'bold'}>
          tur
          <Text component='span' fz={'60px'} fw={'bold'} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 30 }}>ai</Text>
          .work
        </Text>
      </Grid.Col>
    </Grid>
  );
};
