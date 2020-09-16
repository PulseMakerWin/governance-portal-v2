/** @jsx jsx */
import { useState } from 'react'
import useSWR from 'swr';
import { Grid, Button, Flex, Close, Text, Textarea, Box, Label, Spinner, Link as ExternalLink, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import Bignumber from 'bignumber.js'
import SpellData from '../../types/spellData'
import getMaker, { getNetwork } from '../../lib/maker'
import useTransactionStore, {transactionsApi, transactionsSelectors} from '../../stores/transactions'
import { getEtherscanLink } from '../../lib/utils';
// import ProposalPage from '../../pages/executive/[proposal-id]';

const VoteModal = ({ showDialog, close, proposal, lockedMkr }) => {
  const [pending, setPending] = useState(false)
  const [mined, setMined] = useState(false)
  const [txId, setTxId] = useState(null)
  const bpi = useBreakpointIndex()
  const { data: spellData } = useSWR<SpellData>(
    `/api/executive/analyze-spell/${proposal.address}?network=${getNetwork()}`
  )
  const [track, tx] = useTransactionStore(state => [state.track, txId && transactionsSelectors.getTransaction(state, txId)])
  
  const votingWeight = lockedMkr?.toBigNumber().toFormat(6)
  const mkrSupporting = spellData ? new Bignumber(spellData.mkrSupport).toFormat(3) : 0
  const afterVote = lockedMkr && spellData ? lockedMkr.toBigNumber().plus(new Bignumber (spellData.mkrSupport)).toFormat(3) : 0
  
  const GridBox = ({bpi, children}) => 
  <Box sx={bpi === 0 ? {height: '64px', p: 2, px: 3, width: '100%', borderBottom: '1px solid #D4D9E1'} : {height: '78px', px: 3, py: 2, borderRight: '1px solid #D4D9E1'}}>
  {children}
  </Box>

  const vote = async () => {
    const maker = await getMaker()
    const voteTxCreator = () => maker.service('chief').vote(proposal.address)
    const txId = await track(voteTxCreator, 'Voting on executive proposal', {
      pending: () => setPending(true),
      mined: (txId) => {setPending(false); setMined(true); transactionsApi.getState().setMessage(txId, 'Voted on executive proposal')}
    })
    setTxId(txId)
  }
  
    ;

  return (
    <DialogOverlay style={{ background: 'hsla(237.4%, 13.8%, 32.7%, 0.9)' }} isOpen={showDialog} onDismiss={close}>
      <DialogContent
        aria-label='Executive Vote'
        sx={bpi === 0 ?
          { variant: 'dialog.mobile' }
            : { borderRadius: '8px', boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)', width: '50em', p: 4 }
        }
      >
        {!pending && !mined &&
        <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Close aria-label='close' sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }} onClick={close} />
        
          <Text variant='heading' sx={{fontSize: '24px'}}>Confirm Vote</Text>
          <Text sx={{marginTop: 3, color: 'onSecondary', fontSize: '18px'}}>You are voting for the following executive proposal:</Text>
          <Box sx={{mt: 2, p: 3, width: '100%', mx: 3, backgroundColor: 'background', textAlign: 'center', fontSize: '18px'}}>
            <Text>{proposal.title}</Text>
          </Box>
          <Grid columns={[1, 3, 3, 3]} gap={0} sx={{width: '100%', height: ['195px', '78px'], borderRadius: 'small', border: '1px solid #D4D9E1', mt: 3, flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
          <GridBox bpi={bpi}>
                          <Text color='onSecondary' sx={{fontSize: 3}}>Your voting weight</Text>
                          <Text color='#434358' mt={[1, 2]} sx={{fontSize: 3, fontWeight: 'medium'}}>{votingWeight} MKR</Text>
            </GridBox>
            <GridBox bpi={bpi}>
              <Text color='onSecondary' sx={{fontSize: 3}}>MKR supporting</Text>
              <Text color='#434358' mt={[1, 2]} sx={{fontSize: 3, fontWeight: 'medium'}}>
                {mkrSupporting} MKR
              </Text>
            </GridBox>
            <Box sx={{height: ['64px','78px'], p: 3, pt: 2, }}>
              <Text color='onSecondary' sx={{fontSize: 3}}>After vote cast</Text>
              <Text color='#434358' mt={[1, 2]} sx={{fontSize: 3, fontWeight: 'medium'}}>{afterVote} MKR</Text>
            </Box>
          </Grid>
          <Box as='form' sx={{ width: '100%', mt: [3, 4] }}>
            <Label htmlFor='reason'>Why are you voting for this proposal?</Label>
            <Textarea sx={{height: '96px'}} name='reason' defaultValue={`Optional. 250 character max. You'll be prompted to sign a message with your wallet`} />
            <Button variant='primary' sx={{width: '100%', mt: 3}} onClick={vote}>
              Submit Vote
            </Button>
          </Box>
        </Flex>}
        {
          pending && <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Close aria-label='close' sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }} onClick={close} />
        
          <Text variant='heading' sx={{fontSize: '24px'}}>Sign Transaction</Text>
          <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
            <Spinner
                size={'60px'}
                sx={{
                  color: 'primary',
                  alignSelf: 'center',
                }}
             />
            <Text sx={{mt: 3, color: 'onSecondary', fontWeight: 'medium', fontSize: '16px'}}>Please use your wallet to sign this transaction.</Text>
            <Button variant='textual' sx={{mt: 3, color: 'muted', fontSize: '14px'}}>Cancel vote submission</Button>
          </Flex>
          
        </Flex>
        }
        {
          mined && <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Close aria-label='close' sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }} onClick={close} />
        
          <Text variant='heading' sx={{fontSize: '24px'}}>Transaction Sent!</Text>
          <Flex sx={{flexDirection: 'column', alignItems: 'center', mt: 5}}>
            <Icon name="reviewCheck" size={5} />
            <Text variant='heading' sx={{fontSize: '18px', mt: 3}}>Transaction Sent!</Text>
            <Text sx={{mt: 3, color: 'onSecondary', fontWeight: 'medium', fontSize: '16px'}}>Proposal will update once the blockchain has confirmed the tx.</Text>
            \<ExternalLink
              target="_blank"
              href={getEtherscanLink(getNetwork(), tx.hash, 'transaction')}
              sx={{ p: 0 }}
            >
              <Text mt={3} px={4} mb={4} sx={{ textAlign: 'center', fontSize: 14, color: 'accentBlue' }}>
                View on Etherscan
                <Icon name="arrowTopRight" pt={2} color="accentBlue" />
              </Text>
            </ExternalLink>
            <Button onClick={close} sx={{mt: 5, borderColor: 'primary', width: '100%', color: 'primary'}} variant="outline">
              Close
              </Button>
    
        </Flex>
          </Flex>
        }
      </DialogContent>
    </DialogOverlay>
  );
};

export default VoteModal;
