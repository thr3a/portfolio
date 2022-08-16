import type { NextPage } from 'next';
import { Center } from '@mantine/core';

const MyPage: NextPage = () => {
  return (
    <div>
      <Center style={{ width: 400, height: 200 }}>
        <div>All elements inside Center are centered</div>
      </Center>
    </div>
  );
};

export default MyPage;
