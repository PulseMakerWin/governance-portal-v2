/** @jsx jsx */
// this component passes through to @reach/tooltip on desktop,
// and on mobile, renders a button that opens a sheet

import { DialogOverlay, DialogContent } from '@reach/dialog';
import Tooltip from '@reach/tooltip';
import { slideUp } from '../lib/keyframes';

import { useBreakpointIndex } from '@theme-ui/match-media';
import { jsx, Box } from 'theme-ui';
import { useState } from 'react';

export default function ({ children, label, ...props }): JSX.Element {
  const bpi = useBreakpointIndex();
  const [isOpen, setOpen] = useState(false);
  return bpi === 0 ? (
    <Box onClick={() => setOpen(true)}>
      {children}
      <DialogOverlay isOpen={isOpen} onDismiss={() => setOpen(false)}>
        <DialogContent sx={{ variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }}>
          <Box {...props}>{label}</Box>
        </DialogContent>
      </DialogOverlay>
    </Box>
  ) : (
    <Tooltip sx={{ bg: 'white', fontSize: 3, borderRadius: 'medium' }} label={label} {...props}>
      {children}
    </Tooltip>
  );
}
