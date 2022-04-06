import { useActiveWeb3React } from 'modules/web3/hooks/useActiveWeb3React';
import useSWR from 'swr';
import Link from 'next/link';
import { Box, Text, Link as InternalLink } from 'theme-ui';
import Skeleton from 'modules/app/components/SkeletonThemed';
import { CommentsAPIResponseItem } from '../types/comments';
import { formatDateWithTime } from 'lib/datetime';

export default function AccountComments({ address }: { address: string }): React.ReactElement {
  const { network } = useActiveWeb3React();

  const { data, error, isValidating } = useSWR<{
    comments: CommentsAPIResponseItem[];
  }>(`/api/comments/${address}?network=${network}`);
  return (
    <Box>
      {isValidating && !data && (
        <Box>
          <Box mb={3}>
            <Skeleton width="100%" height={'100px'} />
          </Box>
          <Box mb={3}>
            <Skeleton width="100%" height={'100px'} />
          </Box>
          <Box mb={3}>
            <Skeleton width="100%" height={'100px'} />
          </Box>
        </Box>
      )}
      {error && (
        <Box>
          <Text>Unable to load comments.</Text>
        </Box>
      )}
      {data && data.comments.length === 0 && (
        <Box>
          <Text>No comments found.</Text>
        </Box>
      )}
      {data && data.comments.length > 0 && (
        <Box mb={3}>
          <Text
            as="p"
            variant="h2"
            sx={{
              fontSize: 4,
              fontWeight: 'semiBold'
            }}
          >
            Comments
          </Text>{' '}
          {data.comments.map(comment => (
            <Box
              sx={{ borderBottom: '1px solid', borderColor: 'secondaryMuted', py: 4 }}
              key={comment.address.address}
            >
              <Text as="p" variant="caps" color="textMuted" sx={{ lineHeight: '22px' }}>
                {formatDateWithTime(comment.comment.date)}
              </Text>
              <Text
                sx={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: comment.comment.comment }}
              ></Text>
              <Box mt={1}>
                {comment.comment.commentType === 'executive' && (
                  <Link href={`/executive/${comment.comment.spellAddress}`} passHref>
                    <InternalLink variant="nostyle">
                      <Text sx={{ color: 'accentBlue' }}>View Executive</Text>
                    </InternalLink>
                  </Link>
                )}
                {comment.comment.commentType === 'poll' && (
                  <Link href={`/polling/${comment.comment.pollId}`} passHref>
                    <InternalLink variant="nostyle">
                      <Text sx={{ color: 'accentBlue' }}>View Poll</Text>
                    </InternalLink>
                  </Link>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
