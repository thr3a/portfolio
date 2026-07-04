import { Box, Container, Divider, Group, Image, MantineProvider, Stack, Text } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { type Work, works } from '../portfolio/data/works';
import { SectionKey } from './components/SectionKey';
import { WorkSection } from './components/WorkSection';
import { YamlProfile } from './components/YamlProfile';
import * as css from './styles.css';
import { COLORS, theme } from './theme';

const GROUPS: { key: Work['group']; comment: string }[] = [
  { key: 'ai', comment: '生成AI' },
  { key: 'tool', comment: 'ちょっとでも便利に' },
  { key: 'dev', comment: '開発者向け' },
  { key: 'book', comment: '技術同人誌' }
];

const featuredWorks = works.filter((work) => work.featured);
const worksByGroup = Object.groupBy(works, (work) => work.group);

export default function NewPortfolio() {
  useDocumentTitle('turai.work');

  return (
    <MantineProvider theme={theme} forceColorScheme='light'>
      <Box className={css.page} c={COLORS.ink}>
        <Container size='md' px='md' py='xl'>
          <Stack gap='3rem'>
            {/* ヒーロー */}
            <Group gap='2.5rem' align='center'>
              <Box className={css.iconFrame}>
                <Image src='/icon.jpg' w={{ base: 96, sm: 132 }} />
              </Box>
              <Stack gap='sm'>
                <Group gap='md' align='center' wrap='nowrap'>
                  <Text ff='monospace' fw='bold' lh={1.1} fz='clamp(2.2rem, 9vw, 3.75rem)' c={COLORS.ink}>
                    tur
                    <Text component='span' inherit c={COLORS.shu}>
                      ai
                    </Text>
                    .work
                  </Text>
                </Group>
                <Text fz='md'>つらいときこそ、なにか作る</Text>
              </Stack>
            </Group>

            <Divider color={COLORS.ink} size='sm' />

            {/* プロフィール */}
            <Stack gap='md'>
              <SectionKey name='profile' level={1} />
              <YamlProfile />
            </Stack>

            {/* 作品一覧 */}
            <Stack gap='xl'>
              <SectionKey name='works' level={1} />

              <WorkSection name='推し' items={featuredWorks} />

              {GROUPS.map((group) => (
                <WorkSection
                  key={group.key}
                  name={group.key}
                  comment={group.comment}
                  items={worksByGroup[group.key] ?? []}
                />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </MantineProvider>
  );
}
