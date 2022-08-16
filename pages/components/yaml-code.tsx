import React from 'react';
import { Prism } from '@mantine/prism';
import fs from 'fs';
import { NextPage, GetStaticProps } from "next";

type SSGProps = {
  message: string
}

const YamlCode: NextPage<SSGProps> = (props) => {
  const {message} = props;
  
  return (
    <div>
      11111111111111
      <p>{message}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SSGProps> =async (context) => {
  const timestamp = new Date().toLocaleString();
  const message = timestamp;
  console.log(message);
  return {
    props: {
      message,
    }
  };
};
export default YamlCode;

// const demoCode = fs.readFileSync('./self_introduction.yaml', 'utf8')
// const YamlCode = () => {
//   return (
//     <Prism language="yaml" noCopy={true} colorScheme='dark'>{demoCode}</Prism>
//   )
// }

// export default YamlCode
