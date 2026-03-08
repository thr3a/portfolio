import { Button } from '@mantine/core';
import { useOs } from '@mantine/hooks';
import { IconShare } from '@tabler/icons-react';

export const ShareButton = ({ title }: { title: string }) => {
  const os = useOs();

  const handleShare = async () => {
    const url = window.location.href;

    if (os === 'ios' || os === 'android') {
      await navigator.share({ url, title: title });
      return;
    }

    const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(`${title}\n${url}`)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button leftSection={<IconShare size={16} />} onClick={handleShare} size='sm'>
      このサイトを共有
    </Button>
  );
};
