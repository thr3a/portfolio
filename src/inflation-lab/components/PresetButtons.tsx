import { Button, Group } from '@mantine/core';

type PresetData = {
  label: string;
  pastYear: number;
  pastPrice: number;
  currentYear: number;
  currentPrice: number;
};

type PresetButtonsProps = {
  onPresetClick: (preset: PresetData) => void;
};

const PRESETS: PresetData[] = [
  {
    label: '切手の価格',
    pastYear: 2000,
    pastPrice: 50,
    currentYear: 2025,
    currentPrice: 85
  },
  {
    label: 'コメ5kg',
    pastYear: 2000,
    pastPrice: 1978,
    currentYear: 2025,
    currentPrice: 4416
  }
];

export const PresetButtons = ({ onPresetClick }: PresetButtonsProps) => {
  return (
    <Group gap='xs'>
      {PRESETS.map((preset) => (
        <Button key={preset.label} variant='light' size='xs' onClick={() => onPresetClick(preset)}>
          {preset.label}
        </Button>
      ))}
    </Group>
  );
};
