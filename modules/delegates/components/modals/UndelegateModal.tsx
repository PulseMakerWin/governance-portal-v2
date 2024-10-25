/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { useState } from 'react';
import { Box } from 'theme-ui';
import { Delegate, DelegateInfo, DelegatePaginated } from '../../types';
import { useMkrDelegatedByUser } from 'modules/mkr/hooks/useMkrDelegatedByUser';
import { BoxWithClose } from 'modules/app/components/BoxWithClose';
import { ApprovalContent, InputDelegateMkr, TxDisplay } from 'modules/delegates/components';
import { useTokenAllowance } from 'modules/web3/hooks/useTokenAllowance';
import { useDelegateFree } from 'modules/delegates/hooks/useDelegateFree';
import { useApproveUnlimitedToken } from 'modules/web3/hooks/useApproveUnlimitedToken';
import { useAccount } from 'modules/app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { Tokens } from 'modules/web3/constants/tokens';
import { formatValue } from 'lib/string';
import DelegateAvatarName from '../DelegateAvatarName';
import { DialogContent, DialogOverlay } from 'modules/app/components/Dialog';
import { ExternalLink } from 'modules/app/components/ExternalLink';
import { Text } from '@theme-ui/components';

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  delegate: Delegate | DelegatePaginated | DelegateInfo;
  mutateTotalStaked: (amount?: BigNumber) => void;
  mutateMKRDelegated: () => void;
  refetchOnDelegation?: boolean;
};

export const UndelegateModal = ({
  isOpen,
  onDismiss,
  delegate,
  mutateTotalStaked,
  mutateMKRDelegated,
  refetchOnDelegation = true
}: Props): JSX.Element => {
  const { account } = useAccount();
  const voteDelegateAddress = delegate.voteDelegateAddress;
  const [mkrToWithdraw, setMkrToWithdraw] = useState(BigNumber.from(0));

  const { data: mkrDelegatedData } = useMkrDelegatedByUser(account, voteDelegateAddress);
  const sealDelegated = mkrDelegatedData?.sealDelegationAmount;
  const directDelegated = mkrDelegatedData?.directDelegationAmount;
  const { data: iouAllowance, mutate: mutateTokenAllowance } = useTokenAllowance(
    Tokens.IOU,
    parseUnits('100000000'),
    account,
    voteDelegateAddress
  );

  const { approve, tx: approveTx, setTxId: resetApprove } = useApproveUnlimitedToken(Tokens.IOU);

  const { free, tx: freeTx, setTxId: resetFree } = useDelegateFree(voteDelegateAddress);

  const [tx, resetTx] = iouAllowance ? [freeTx, resetFree] : [approveTx, resetApprove];

  const onClose = () => {
    resetTx(null);
    onDismiss();
  };

  return (
    <>
      <DialogOverlay isOpen={isOpen} onDismiss={onClose}>
        <DialogContent widthDesktop="580px" ariaLabel="Undelegate modal">
          <BoxWithClose close={onClose}>
            <Box>
              {tx ? (
                <TxDisplay
                  tx={tx}
                  setTxId={resetTx}
                  onDismiss={onClose}
                  title={'Undelegating MKR'}
                  description={`You undelegated ${formatValue(mkrToWithdraw, 'wad', 6)} from ${
                    delegate.name
                  }`}
                >
                  <Box sx={{ textAlign: 'left', margin: '0 auto', p: 3 }}>
                    <DelegateAvatarName delegate={delegate} />
                  </Box>
                </TxDisplay>
              ) : (
                <>
                  {directDelegated && iouAllowance ? (
                    <InputDelegateMkr
                      title="Withdraw from delegate contract"
                      description="Input the amount of MKR to withdraw from the delegate contract."
                      onChange={setMkrToWithdraw}
                      balance={directDelegated}
                      buttonLabel="Undelegate MKR"
                      onClick={() => {
                        free(mkrToWithdraw, {
                          mined: () => {
                            refetchOnDelegation
                              ? mutateTotalStaked()
                              : mutateTotalStaked(mkrToWithdraw.mul(-1));
                            mutateMKRDelegated();
                          }
                        });
                      }}
                      showAlert={false}
                      disclaimer={
                        sealDelegated &&
                        sealDelegated.gt(0) ? (
                          <Text variant="smallText" sx={{ color: 'secondaryEmphasis', mt: 3 }}>
                            Your {formatValue(sealDelegated)} MKR delegated through the Seal module must be undelegated from the{' '}
                            <ExternalLink title="Sky app" href="https://app.sky.money/?widget=seal">
                              <span>Sky app</span>
                            </ExternalLink>
                            .
                          </Text>
                        ) : undefined
                      }
                    />
                  ) : (
                    <ApprovalContent
                      onClick={() =>
                        approve(voteDelegateAddress, {
                          mined: () => {
                            mutateTokenAllowance();
                          }
                        })
                      }
                      title={'Approve Delegate Contract'}
                      buttonLabel={'Approve Delegate Contract'}
                      description={
                        'Approve the transfer of IOU tokens to the delegate contract to withdraw your MKR.'
                      }
                    />
                  )}
                </>
              )}
            </Box>
          </BoxWithClose>
        </DialogContent>
      </DialogOverlay>
    </>
  );
};
