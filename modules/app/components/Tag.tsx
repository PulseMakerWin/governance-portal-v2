import { Box, Text } from 'theme-ui';
import { Tag } from '../types/tag.dt';
import TooltipComponent from './Tooltip';

export default function TagComponent({
  tag,
  backgroundColor = 'tagColorSeventeenBg',
  color = 'tagColorSeventeen'
}: {
  tag: Tag;
  backgroundColor?: string;
  color?: string;
}): React.ReactElement {
  return (
    <Box
      sx={{
        backgroundColor,
        borderRadius: '12px',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        color
      }}
    >
      <TooltipComponent label={tag.description}>
        <Text sx={{ fontSize: 2 }}>{tag.shortname}</Text>
      </TooltipComponent>
    </Box>
  );
}
