/** @jsx jsx */
import Link from 'next/link';
import { Flex, NavLink, Container, Close, Box, IconButton, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

import { getNetwork } from '../lib/maker';
import AccountSelect from './AccountSelect';
import BallotStatus from './BallotStatus';
import { useState } from 'react';
import useBreakpoints from '../lib/useBreakpoints';
import useAccountsStore from '../stores/accounts';

const Header = (): JSX.Element => {
  const network = getNetwork();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const bpi = useBreakpoints();
  const account = useAccountsStore(state => state.currentAccount);

  return (
    <header
      sx={{
        py: 3,
        px: [3, 0],
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        variant: 'styles.header'
      }}
    >
      <Link href={{ pathname: '/', query: { network } }}>
        <IconButton aria-label="Maker home" sx={{ width: 5, height: 5, p: 0 }}>
          <Icon name="maker" size="5" sx={{ cursor: 'pointer' }} />
        </IconButton>
      </Link>

      <IconButton
        aria-label="Maker home"
        ml="auto"
        sx={{ display: [null, 'none'], height: '28px', width: '24px', p: 0 }}
        onClick={() => setShowMobileMenu(true)}
      >
        <Icon name="menu" sx={{ height: '28px', width: '24px' }} />
      </IconButton>
      <Menu shown={showMobileMenu} hide={() => setShowMobileMenu(false)}>
        <Link href={{ pathname: '/', query: { network } }}>
          <NavLink p={2} sx={{ display: [null, 'none'] }}>
            Home
          </NavLink>
        </Link>
        <Link href={{ pathname: '/polling', query: { network } }}>
          <NavLink p={2}>Polling</NavLink>
        </Link>
        <Link href={{ pathname: '/executive', query: { network } }}>
          <NavLink p={2} sx={{ ml: [0, 5] }}>
            Executive
          </NavLink>
        </Link>
        <Link href={{ pathname: '/module', query: { network } }}>
          <NavLink p={2} sx={{ ml: [0, 5], mr: [0, 5] }}>
            ES Module
          </NavLink>
        </Link>
        {bpi > 0 && account && <BallotStatus mr={3} />}
        <AccountSelect />
      </Menu>
    </header>
  );
};

const Menu = ({ children, shown, hide }) => {
  return (
    <>
      <Box ml="auto" sx={{ alignItems: 'center', display: ['none', 'flex'] }}>
        {children}
      </Box>
      {shown && (
        <Container variant="modal">
          <Close ml="auto" sx={{ display: ['block'], '> svg': { size: [4] } }} onClick={hide} />
          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              height: '50vh',
              '> a': {
                fontSize: 7
              }
            }}
          >
            {children}
          </Flex>
        </Container>
      )}
    </>
  );
};

export default Header;
