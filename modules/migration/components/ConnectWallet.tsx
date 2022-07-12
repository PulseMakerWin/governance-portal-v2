import { Flex, Text, Label } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { useLinkedDelegateInfo } from 'modules/migration/hooks/useLinkedDelegateInfo';
import { ExternalLink } from 'modules/app/components/ExternalLink';

export function ConnectWallet(): JSX.Element {
  const { newOwnerAddress } = useLinkedDelegateInfo();
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text as="h3" sx={{ fontWeight: 'semiBold' }}>
          Please switch from your old delegate address to your new delegate address
        </Text>
        <Label sx={{ mt: 4 }}>Your new address</Label>
        <Text variant="secondary">{newOwnerAddress}</Text>
      </Flex>
      <Flex sx={{ width: '100%', my: 4 }}>
        <img src="/assets/switch-account-metamask.gif" />
      </Flex>
      <ExternalLink href={'#'} title="Read more">
        <Flex sx={{ alignItems: 'center' }}>
          <Text>Read more how to switch accounts in MetaMask</Text>
          <Icon ml={2} name="arrowTopRight" size={2} />
        </Flex>
      </ExternalLink>
      <Flex sx={{ alignItems: 'center' }}>
        <Text variant="secondary" sx={{ my: 3 }}>
          If you are having trouble switching accounts, please reach out for support on our{' '}
          <ExternalLink href="https://discord.gg/tQ5wnN6Ms4" title="Discord" styles={{ color: 'accentBlue' }}>
            <Text>Discord</Text>
          </ExternalLink>
        </Text>
        <Icon name={'discord'} sx={{ ml: 2 }} />
      </Flex>
    </Flex>
  );
}
