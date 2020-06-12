/** @jsx jsx */
import { Flex, jsx } from 'theme-ui';

type Props = {
  gap?: number | number[];
};

/**
 * Usage note: children should not specify their own margins
 */
const StackLayout = ({ children, gap = 4 }: React.PropsWithChildren<Props>) => {
  return (
    <Flex
      sx={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        '& > *:not(:last-child)': {
          // this is more specific than the owl selector so it can override theme-ui's class-based margin: 0
          // while still allowing breakpoints and without preventing !important overrides from children *sigh*
          mb: gap
        }
      }}
    >
      {children}
    </Flex>
  );
};

export default StackLayout;
