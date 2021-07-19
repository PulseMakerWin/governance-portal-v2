import { act, fireEvent, configure } from '@testing-library/react';
import getMaker from '../../lib/maker';
import DelegatesPage from '../../pages/delegates';
import {
  injectProvider,
  connectAccount,
  renderWithAccountSelect as render,
  createDelegate,
  nextAccount,
  DEMO_ACCOUNT_TESTS
} from '../helpers';
import mixpanel from 'mixpanel-browser';
import { SWRConfig } from 'swr';
import * as utils from '../../lib/utils';

const DELEGATE_ADDRESS = '0xfcdD2B5501359B70A20e3D79Fd7C41c5155d7d07';

const MOCK_DELEGATES = [
  {
    address: DEMO_ACCOUNT_TESTS,
    description: 'I AM DELEGATEMAN',
    expirationDate: '2022-07-08T14:00:24.000Z',
    expired: false,
    id: '0xc8829647c8e4131a01354ccac993388568d12d00',
    lastVote: '2021-07-19T23:40:18.158Z',
    name: 'Lee Robinson',
    picture:
      'https://raw.githubusercontent.com/makerdao-dux/voting-delegates/main/delegates/0xc8829647c8e4131a01354ccac993388568d12d00/profile.jpg',
    status: 'active',
    voteDelegateAddress: DELEGATE_ADDRESS
  }
];

const mockGetUsers = jest.spyOn(utils, 'fetchJson');
mockGetUsers.mockResolvedValue(MOCK_DELEGATES);

jest.mock('@theme-ui/match-media', () => {
  return {
    useBreakpointIndex: jest.fn(() => 3)
  };
});

const { click } = fireEvent;
let component, maker;

async function setup(maker) {
  const comp = render(
    <SWRConfig value={{ dedupingInterval: 0, refreshInterval: 10 }}>
      <DelegatesPage delegates={[]} />
    </SWRConfig>
  );

  await act(async () => {
    // This sets the account in state
    await connectAccount(comp, maker.currentAccount().address);
  });
  return comp;
}

describe('Delegate Create page', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    configure({ asyncUtilTimeout: 4500 });
    maker = await getMaker();
    injectProvider();
    await createDelegate(maker);
    // Change to a new, non-delegate account
    await nextAccount(maker);
    mixpanel.track = () => {};
  });

  beforeEach(async () => {
    await act(async () => {
      component = await setup(maker);
    });
  });

  // //TODO does it need to be async?
  // afterEach(async () => {
  //   await act(async () => {
  //     await accountsApi.getState().disconnectAccount();
  //   });
  // });

  test('can delegate MKR to a delegate', async () => {
    const delegateButton = await component.findByText('Recognized delegates');
    // act(() => {
    //   click(delegateButton);
    // });
    // // Transaction is initialized
    // await component.findByText('Confirm transaction');
    // // Transaction state moved to pending
    // await component.findByText('Transaction pending');
    // // Transaction state moved to mined
    // await component.findByText('Transaction Sent');
    // const closeButton = component.getByText('Close');
    // act(() => {
    //   click(closeButton);
    // });
    // await component.findByText(DELEGATE_ADDRESS);
  });
});
