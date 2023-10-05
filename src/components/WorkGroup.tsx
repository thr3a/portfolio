import { Box, SegmentedControl, Stack } from '@mantine/core';
import { type WorkProps } from '../data/works';
import { Work } from './Work';
import { WorkData } from '../data/works';

export const WorkGroup = ({ workGroup, setworkGroup }: any): JSX.Element => {
  const filteredGroups = (): WorkProps[] => {
    if (workGroup === 'all') {
      return WorkData;
    } else {
      return WorkData.filter((x: WorkProps) => x.group === workGroup);
    }
  };

  return (
    <Box>
      <SegmentedControl
        value={workGroup}
        color="blue"
        onChange={setworkGroup}
        data={[
          { label: 'すべて', value: 'all' },
          { label: 'AI', value: 'ai' },
          { label: '便利ツール', value: 'tool' },
          { label: '開発', value: 'dev' }
        ]}
        mb={'sm'}
        mt={'sm'}
      />
      <Stack gap={'xs'}>
        {filteredGroups().map((props, index) => (
          <Work key={index} {...props}></Work>
        ))}
      </Stack>
    </Box>
  );
};
