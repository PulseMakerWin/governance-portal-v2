/** @jsx jsx */

import { Heading, Box, jsx, Button, Flex, Input, Label, Card, Text } from 'theme-ui';
import Head from 'next/head';
import { useBreakpointIndex } from '@theme-ui/match-media';
import PrimaryLayout from '../../components/layouts/Primary';
import Stack from '../../components/layouts/Stack';
import { useState } from 'react';
import { URL_REGEX } from '../../lib/constants';
import { ethers } from 'ethers';
import matter from 'gray-matter';
import { markdownToHtml } from '../../lib/utils';

const ExecutiveCreate = () => {
  const bpi = useBreakpointIndex();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [date, setDate] = useState('');
  const [mainnetAddress, setMainnetAddress] = useState('');
  const [kovanAddress, setKovanAddress] = useState('');
  const [error, setError] = useState();
  const [fetchFinished, setFetchFinished] = useState(false);

  const fields = [
    ['Title', title],
    ['Summary', summary],
    ['Date', date],
    ['Mainnet Address', mainnetAddress],
    ['Kovan Address', kovanAddress]
  ];

  const isValidUrl = url.match(URL_REGEX);

  const getFieldsFromUrl = async () => {
    let metadata, execMarkdown;
    setError([]);
    setFetchFinished(false);
    try {
      console.log('1');
      const rawMd = await (await fetch(url, { cache: 'no-cache' })).text();
      const { data, content } = matter(rawMd);
      metadata = data;
      execMarkdown = content;
    } catch (e) {
      setError(['failed to fetch']);
      return;
    }

    if (!metadata.title) setError(e => [...e, 'missing title']);
    if (!metadata.summary) setError(e => [...e, 'missing summary']);
    if (!execMarkdown) setError(e => [...e, 'missing markdown']);
    if (!metadata.date) setError(e => [...e, 'missing date']);
    if (
      metadata.date &&
      Math.abs(new Date(metadata.date).getTime() - Date.now()) > 1000 * 60 * 60 * 24 * 7 * 2
    )
      setError(e => [...e, 'date is more than two weeks from now']);
    if (!metadata.address) setError(e => [...e, 'missing mainnet address']);
    else {
      try {
        ethers.utils.getAddress(metadata.address);
      } catch (_) {
        setError(e => [...e, 'invalid mainnet address']);
      }
    }
    if (!metadata.kovanAddress) setError(e => [...e, 'missing kovan address']);
    else {
      try {
        ethers.utils.getAddress(metadata.kovanAddress);
      } catch (_) {
        setError(e => [...e, 'invalid kovan address']);
      }
    }

    setFetchFinished(true);
    setTitle(metadata.title);
    setSummary(metadata.summary);
    setDate(metadata.date);
    setMainnetAddress(metadata.address);
    setKovanAddress(metadata.kovanAddress);
    setMarkdown(await markdownToHtml(execMarkdown));
  };

  return (
    <PrimaryLayout shortenFooter={true} sx={{ maxWidth: 'dashboard' }}>
      <Head>
        <title>Maker Governance - Validate Executive Proposal</title>
      </Head>
      <Stack gap={3}>
        <Heading mb={2} as="h4">
          Executive Validator
        </Heading>
        <Card>
          <Stack gap={3} sx={{ p: [3, 4] }}>
            <div>
              <Box sx={{ mb: 3 }}>
                <Label htmlFor="url">URL</Label>
                <Flex sx={{ flexDirection: 'row' }}>
                  <Input name="url" mb={3} onChange={e => setUrl(e.target.value)} />
                  <Button
                    variant="smallOutline"
                    sx={{ height: '42px', width: '80px', ml: 3 }}
                    disabled={!isValidUrl}
                    onClick={getFieldsFromUrl}
                  >
                    Validate
                  </Button>
                </Flex>
                {error ? (
                  <Flex
                    color="warning"
                    sx={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'error',
                      borderRadius: '5px',
                      p: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    {error.map(e => (
                      <Flex key={e} sx={{ mr: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          sx={{
                            mr: 1,
                            border: '6px solid',
                            borderColor: 'warning',
                            borderRadius: '100px',
                            width: '12px',
                            height: '12px'
                          }}
                        ></Text>
                        <Text>{e}</Text>
                      </Flex>
                    ))}
                  </Flex>
                ) : null}
              </Box>
              {fetchFinished && (
                <table border="1px">
                  <tbody>
                    {fields.map(([name, value]) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                    <tr key={'Markdown'}>
                      <td>{'Markdown'}</td>
                      <td>
                        <div dangerouslySetInnerHTML={{ __html: markdown }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </Stack>
        </Card>
      </Stack>
    </PrimaryLayout>
  );
};

export default ExecutiveCreate;
