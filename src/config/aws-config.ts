import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-west-2',
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'us-west-2_NcTa0wCic',
      userPoolClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID || 'fla00aofh9fd5g1o76f8614lk',
      authenticationFlowType: 'USER_SRP_AUTH',
      aws_cognito_identity_pool_id: undefined,
    },
  },
};

Amplify.configure(awsConfig);

export default awsConfig;
