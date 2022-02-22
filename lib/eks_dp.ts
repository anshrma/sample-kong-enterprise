import { Stack, StackProps, aws_eks, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as KongDP from 'kong-data-plane';

interface KongDpEksStackProps extends StackProps {
  vpc: aws_ec2.IVpc;
  cluster_dns: String;
  telemetry_dns: String;
  private_ca_arn: string;

}

export class KongDpEks extends Stack {
  constructor(scope: Construct, id: string, props: KongDpEksStackProps) {
    super(scope, id, props);

    new KongDP.KongEks(this, 'KongEksDp', {
      licenseSecretsName: 'kong-license-cdk',
      dataPlaneClusterProps: {
        clusterName: 'kong-dp',
        version: aws_eks.KubernetesVersion.V1_21,
        defaultCapacity: 0,
        endpointAccess: aws_eks.EndpointAccess.PUBLIC_AND_PRIVATE,
        vpc: props.vpc,
      },
      dataPlaneNodeProps: {
        amiType: aws_eks.NodegroupAmiType.AL2_X86_64,
        instanceTypes: [aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T3, aws_ec2.InstanceSize.LARGE)],
        minSize: 2,
      },
      clusterDns: props.cluster_dns,
      telemetryDns: props.telemetry_dns,
      privateCaArn: props.private_ca_arn,
    });

    // define resources here...
  }
}