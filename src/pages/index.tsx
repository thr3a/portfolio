import type { NextPage, InferGetStaticPropsType } from 'next';
import { Container, Grid, Title, createStyles, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import fs from 'fs';
import { SnsButton } from '@/features/links/components/SnsButton';
import { MyImage } from '@/features/header/components/MyImage';
import { MyWork } from '@/features/works/components/MyWork';
import type { WorkProps } from '@/features/works/Props';
import type { SnsProps } from '@/features/links/Props';

const useStyles = createStyles((theme) => ({
  header: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md
  }
}));

type JsonData = {
  sns: SnsProps[];
  works: WorkProps[];
}

export const getStaticProps = () => {
  const introYaml = fs.readFileSync('./data/self_introduction.yaml', 'utf8');
  const json: JsonData = JSON.parse(fs.readFileSync('./data/links.json', 'utf8'));
  return {
    props: {
      intro_yaml: introYaml,
      sns: json.sns,
      works: json.works
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Home: NextPage<Props> = ({intro_yaml, sns, works}) => {
  const { classes } = useStyles();
  return (
    <>
      <Container>
        <Grid sx={{marginTop: '20px', marginBottom: '20px'}}>
          <Grid.Col sm={2} span={12}>
            <MyImage></MyImage>
          </Grid.Col>
          <Grid.Col sm={8} span={12}>
            <Text component='span' sx={{fontSize: '60px'}} weight='bold'>turai.work</Text>
          </Grid.Col>
        </Grid>
        <div>
          <Prism language="yaml" noCopy={true} colorScheme='dark'>{intro_yaml}</Prism>
        </div>
        <Title order={1} className={classes.header}>Links</Title>
        {sns.map(({ name, url, color, icon }) => (
          <div key={name}>
            <SnsButton url={url} name={name} color={color} icon={icon}></SnsButton>
          </div>
        ))}
        <Title order={1} className={classes.header}>Works</Title>
        {works.map(({ title, url, description }) => (
          <div key={title}>
            <MyWork title={title} url={url} description={description}></MyWork>
          </div>
        ))}
      </Container>
    </>
  );
};

export default Home;
