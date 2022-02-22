import { Stack, StackProps, aws_eks, aws_rds, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as KongCP from 'kong-control-plane';

export class KongCpEks extends Stack {

  public readonly control_plane: aws_eks.Cluster;
  public readonly private_ca_arn : string;
  public readonly telemetry_dns : string;
  public readonly cluster_dns : string;

  constructor(scope: Construct, id: string, props: StackProps = {} ) {
    super(scope, id, props);


    const kong_control_plane = new KongCP.KongEks(this, 'KongEksCp', {
      hostedZoneName: 'kong-cp.internal',
      namespace: 'kong',
      licenseSecretsName: 'kong-license-cdk',
      controlPlaneClusterProps: {
        clusterName: 'kong-cp',
        version: aws_eks.KubernetesVersion.V1_21,
        defaultCapacity: 0,
        endpointAccess: aws_eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      },
      controlPlaneNodeProps: {
        amiType: aws_eks.NodegroupAmiType.AL2_X86_64,
        instanceTypes: [aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T3, aws_ec2.InstanceSize.LARGE)],
        minSize: 2,
      },
      rdsProps: {
        postgresversion: aws_rds.PostgresEngineVersion.VER_12_7,
        databasename: 'kongdb',
        username: 'kongadmin',
      },
    });

    this.control_plane = kong_control_plane.controlPlane;
    this.private_ca_arn = kong_control_plane.privateCaArn;
    this.telemetry_dns = kong_control_plane.telemetryDns;
    this.cluster_dns = kong_control_plane.clusterDns;
    // define resources here...
  }
}
