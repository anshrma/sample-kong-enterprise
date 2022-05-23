#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KongCpEks } from '../lib/eks_cp';
import { KongCpEcs } from '../lib/ecs_cp';

import { KongDpEks } from '../lib/eks_dp';
import { KongDpEcs } from "../lib/ecs_dp";

const app = new cdk.App();
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region:  process.env.CDK_DEFAULT_REGION,
  licese_secret_name : 'kong-license-cdk',
};
const kong_control_plane_eks = new KongCpEks(app, 'kong-cp-eks', { 
  env: devEnv,
  licese_secret_name: devEnv.licese_secret_name, 
});
const kong_control_plane_ecs = new KongCpEcs(app, 'kong-cp-ecs', { env: devEnv });

new KongDpEks(app, 'kong-dp-eks', {
  env: devEnv,
  cluster_dns: kong_control_plane_eks.cluster_dns,
  vpc: kong_control_plane_eks.control_plane.vpc,
  telemetry_dns: kong_control_plane_eks.telemetry_dns,
  private_ca_arn: kong_control_plane_eks.private_ca_arn,
  licese_secret_name: devEnv.licese_secret_name,
  prometheus_endpoint: 'https://aps-workspaces.us-east-1.amazonaws.com/workspaces/ws-b9eedac3-ae00-41dd-9812-2d7f3238bdb0/api/v1/remote_write',
});

new KongDpEcs(app, 'kong-dp-ecs', {
  env: devEnv,
  cluster_dns: kong_control_plane_ecs.cluster_dns,
  vpc: kong_control_plane_ecs.control_plane.vpc,
  telemetry_dns: kong_control_plane_ecs.telemetry_dns,
  private_ca_arn: kong_control_plane_ecs.private_ca_arn,
});

new KongDpEcs(app, 'kong-dp-ecs-with-eks-cp', {
  env: devEnv,
  cluster_dns: kong_control_plane_eks.cluster_dns,
  vpc: kong_control_plane_eks.control_plane.vpc,
  telemetry_dns: kong_control_plane_eks.telemetry_dns,
  private_ca_arn: kong_control_plane_eks.private_ca_arn,
});


