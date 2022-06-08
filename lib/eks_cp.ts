import { Stack, StackProps, aws_eks, aws_rds, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as KongCP from 'kong-control-plane';
// import * as KongCP from '../../kong-control-plane/src';

interface KongCpEksStackProps extends StackProps {
  licese_secret_name : string;
}

export class KongCpEks extends Stack {

  public readonly control_plane: aws_eks.Cluster;
  public readonly private_ca_arn : string;
  public readonly telemetry_dns : string;
  public readonly cluster_dns : string;
  public readonly prometheus_endpoint : string | undefined;

  constructor(scope: Construct, id: string, props: KongCpEksStackProps ) {
    super(scope, id, props);


    const kong_control_plane = new KongCP.KongEks(this, 'KongEksCp', {
      hostedZoneName: 'kong-cp.internal',
      namespace: 'kong',
      licenseSecretsName:props.licese_secret_name,
      controlPlaneClusterProps: {
        kongTelemetryOptions: {
          createPrometheusWorkspace: true,
        },
        eksClusterProps:{
          clusterName: 'kong-cp',
          version: aws_eks.KubernetesVersion.V1_21,
          defaultCapacity: 0,
          endpointAccess: aws_eks.EndpointAccess.PUBLIC_AND_PRIVATE,
        },
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
    this.prometheus_endpoint = kong_control_plane.prometheusEndpoint;
    // define resources here...
  }
}
