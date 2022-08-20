import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Container, Grid, Title, Space } from '@mantine/core';
import { GetStaticProps } from "next";
import { Prism } from '@mantine/prism';
import fs from 'fs';
import SnsButton from '../components/SnsButton';
import MyImage from '../components/MyImage';
import MyWork from '../components/MyWork';
import { MyProps, JsonData } from '../components/Definition';

const Home: NextPage<MyProps> = (props: MyProps) => {
  return (
    <>
      <Head>
        <title>turai.work</title>
        <meta name="description" content="turai.work" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.container}>
        <Grid className={styles.header}>
          <Grid.Col sm={2} span={12}>
            <MyImage></MyImage>
          </Grid.Col>
          <Grid.Col sm={8} span={12}>
            <span className={styles.title}>turai.work</span>
          </Grid.Col>
        </Grid>
        <div>
          <Prism language="yaml" noCopy={true} colorScheme='dark'>{props.intro_yaml}</Prism>
        </div>
        <Space h="md" />
        <Title order={1}>Links</Title>
        {props.sns.map(({ name, url, color, icon }) => (
          <div key={name}>
            <SnsButton url={url} name={name} color={color} icon={icon}></SnsButton>
          </div>
        ))}
        <Title order={1}>Works</Title>
        {props.works.map(({ title, url, description }) => (
          <div key={title}>
            <MyWork title={title} url={url} description={description}></MyWork>
          </div>
        ))}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<MyProps> = async (context) => {  
  const intro_yaml = fs.readFileSync('./data/self_introduction.yaml', 'utf8');
  const json: JsonData = JSON.parse(fs.readFileSync('./data/links.json', 'utf8'));
  return {
    props: {
      intro_yaml,
      sns: json.sns,
      works: json.works
    },
  };
};

export default Home;
