const hre = require('hardhat');
const { network } = hre;

async function main() {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: 'https://eth-goerli.g.alchemy.com/v2/brtgDkZIuFslh0fy3-opouzt8uLNQEdB',
          blockNumber: 7810464, // One block after a particular poll was created
          chainId: 31337
        }
      }
    ]
  });
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
