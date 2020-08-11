/** @jsx jsx */
import { Box, Flex, jsx } from 'theme-ui';

import Footer from '../Footer';

type Props = {
  shortenFooter?: boolean;
  sxAlt?: {
    maxWidth: string;
  };
};

const PrimaryLayout = ({ children, shortenFooter, ...props }: React.PropsWithChildren<Props>) => {
  return (
    <Flex sx={{ mx: 'auto', width: '100%', flexDirection: 'column', minHeight: '100vh' }} {...props}>
      <Box as="main" sx={{ width: '100%', flex: '1 1 auto', variant: 'layout.main' }}>
        {children}
      </Box>
      <Footer shorten={shortenFooter || false} />
    </Flex>
  );
};

export default PrimaryLayout;
