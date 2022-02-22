#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KongCpEks } from '../lib/eks_cp';
import { KongDpEks } from '../lib/eks_dp';

const app = new cdk.App();
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-west-2',
  // process.env.CDK_DEFAULT_REGION,
};
const kong_control_plane = new KongCpEks(app, 'kong-cp', { env: devEnv });
new KongDpEks(app, 'kong-dp', {
  env: devEnv,
  cluster_dns: kong_control_plane.cluster_dns,
  vpc: kong_control_plane.control_plane.vpc,
  telemetry_dns: kong_control_plane.telemetry_dns,
  private_ca_arn: kong_control_plane.private_ca_arn,
});