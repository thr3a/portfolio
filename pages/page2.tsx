import { GetServerSideProps } from "next";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IconBrandTwitter } from '@tabler/icons';
import MyButton from '../components/MyButton';

// propsの型を定義する
type Props = {
  title?: string;
  num?: number;
};

// ページコンポーネントを定義する
const TestPage = (props: Props) => {
  return (
    <div>
      <div>
        <MyButton url="https://twitter.com/amanekey" name="@amanekey" color="blue" icon="twitter"></MyButton>
      </div>
      <div>
        <MyButton url="https://thr3a.hatenablog.com/" name="Blog" color="orange" icon="blog"></MyButton>
      </div>
      <div>
        <MyButton url="" name="zenn" color="orange" icon="external"></MyButton>
      </div>
    </div>
  );
};

export default TestPage;

// サーバサイドで実行する処理(getServerSideProps)を定義する
export const getServerSideProps: GetServerSideProps = async (context) => {
  // APIやDBからのデータ取得処理などを記載

  const props: Props = {
    title: "testtitle",
    num: 123,
  };

  return {
    props: props,
  };
};
