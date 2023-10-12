import React, { FC } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { Text, TextContent } from '@patternfly/react-core';
import SatelliteManifestPanel from '../../components/SatelliteManifestPanel';
import useSatelliteManifests from '../../hooks/useSatelliteManifests';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { Processing } from '../../components/emptyState';
import useUser from '../../hooks/useUser';
import ExternalLink from '../../components/ExternalLink';
import { NoSatelliteSubs } from '../../components/NoSatelliteSubs';
import { Alert } from '@patternfly/react-core';
import { subscriptionInventoryLink, supportLink } from '../../utilities/consts';

const SatelliteManifestPage: FC = () => {
  const { isLoading, isFetching, error, data } = useSatelliteManifests();

  const { data: user } = useUser();
  const manifestsMoreInfoLink =
    'https://access.redhat.com/documentation/en-us/subscription_central/2023/html/' +
    'creating_and_managing_manifests_for_a_connected_satellite_server/index';

  return (
    <>
      <PageHeader>
        <TextContent>
          <Text component="h1" className="pf-c-title">
            Manifests
          </Text>
          <Text component="p">
            Export subscriptions to your on-premise subscription management application.{' '}
            <ExternalLink href={manifestsMoreInfoLink}>
              Learn more about creating and managing manifests for a connected Satellite Server
            </ExternalLink>
            {!user.isEntitled && !isLoading && data?.length != 0 && (
              <Alert title="Your account has no Satellite subscriptions" isInline variant="info">
                You can view existing manifests for your account, however, an active Satellite
                subscription is required to create a new manifest.{' '}
                <a href={supportLink} target="_blank" rel="noreferrer">
                  Contact support
                </a>{' '}
                to determine if you need a new subscription. To view recently expired subscriptions,
                select the <em>Expired</em> card in your{' '}
                <a href={subscriptionInventoryLink}>subscription inventory</a>.
              </Alert>
            )}
          </Text>
        </TextContent>
      </PageHeader>
      <Main>
        <>
          {isLoading && !error && <Processing />}

          {!isLoading && !error && !user.isEntitled && data.length == 0 && <NoSatelliteSubs />}

          {!isLoading && !error && (user.isEntitled || data.length != 0) && (
            <SatelliteManifestPanel data={data} user={user} isFetching={isFetching} />
          )}

          {error && <Unavailable />}
        </>
      </Main>
    </>
  );
};

export default SatelliteManifestPage;
