import { Box, SegmentedControl, Stack } from '@mantine/core';
import type { WorkProps } from '../data/works';
import { WorkData } from '../data/works';
import { Work } from './Work';

type props = {
  workGroup: string;
  setworkGroup: (workGroup: string) => void;
};

export const WorkGroup = ({ workGroup, setworkGroup }: props): JSX.Element => {
  const filteredGroups = (): WorkProps[] => {
    if (workGroup === 'all') {
      return WorkData.filter((x: WorkProps) => x.group !== 'old');
    }
    return WorkData.filter((x: WorkProps) => x.group === workGroup);
  };

  return (
    <Box>
      <SegmentedControl
        value={workGroup}
        color='blue'
        onChange={setworkGroup}
        data={[
          { label: 'すべて', value: 'all' },
          { label: 'AI', value: 'ai' },
          { label: '便利ツール', value: 'tool' },
          { label: '開発', value: 'dev' },
          { label: '🪦', value: 'old' }
        ]}
        mb={'sm'}
        mt={'sm'}
      />
      <Stack gap={'xs'}>
        {filteredGroups().map((props) => (
          <Work key={props.url} {...props} />
        ))}
      </Stack>
    </Box>
  );
};
