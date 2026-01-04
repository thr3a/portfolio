import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';

export function MyCard() {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'
          height={160}
          alt='Norway'
        />
      </Card.Section>

      <Group justify='space-between' mt='md' mb='xs'>
        <Text fw={500}>ノルウェー・フィヨルド・アドベンチャーズ</Text>
        <Badge color='pink'>On Sale</Badge>
      </Group>

      <Text size='sm' c='dimmed'>
        フィヨルドツアーでは、ノルウェーのフィヨルドとその周辺でのツアーやアクティビティを通じて、魔法のようなフィヨルドの風景をさらに探索できます。
      </Text>

      <Button color='blue' fullWidth mt='md' radius='md'>
        クラシックツアーを今すぐ予約
      </Button>
    </Card>
  );
}
