import { SimpleGrid, Stack } from '@mantine/core';
import type { Work } from '../data/works';
import { SectionKey } from './SectionKey';
import { WorkCard } from './WorkCard';

type WorkSectionProps = {
  name: string;
  comment?: string;
  items: Work[];
};

export const WorkSection = ({ name, comment, items }: WorkSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Stack gap='md'>
      <SectionKey name={name} comment={comment} level={2} />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
        {items.map((work) => (
          <WorkCard key={work.url} work={work} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
