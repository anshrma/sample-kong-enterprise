import { Stack, StackProps, aws_ecs, aws_rds, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
//import * as KongCP from 'kong-control-plane';

import {Vpc} from "aws-cdk-lib/aws-ec2";
import {PostgresEngineVersion} from "aws-cdk-lib/aws-rds";
import * as KongCP from "../../kong-control-plane/src";
export class KongCpEcs extends Stack {

    public readonly control_plane: aws_ecs.Cluster;
    public readonly private_ca_arn : string;
    public readonly telemetry_dns : string;
    public readonly cluster_dns : string;

    constructor(scope: Construct, id: string, props: StackProps = {} ) {
        super(scope, id, props);


        // The code that defines your stack goes here
        const vpc = new Vpc(
            this,
            "kongVpc",
            {
                enableDnsSupport: true,
                cidr: "10.0.0.0/16",
                enableDnsHostnames: true,
         });

        const kong_control_plane = new KongCP.KongEcs(this,'cp', {
            hostedZoneName: "kong-cp.internal",
            kongFeaturesProps: {
                kongBootstrapMigration: true,
                adminProps: {
                    enabled: true,
                },
                devPortalProps: {
                    enabled: true
                },
                kongManagerProps: {
                    enabled: true
                },
                clusterProps: {
                    enabled: true,
                },
                clusterTelemetryProps: {
                    enabled: true
                }
            },
            kongTaskProps: {
                cpu: 1024,
                memory: 2048,
                desiredCount: 1
            },
            vpc: vpc,
            clusterName: "kong-cp",
            internetFacing: true,
            licenseSecret: "kong-license1",
            rdsProps: {
                username: "kong",
                databasename: "kong",
                postgresversion: PostgresEngineVersion.VER_12
            }
        });

        this.control_plane = kong_control_plane.controlPlane;
        this.private_ca_arn = kong_control_plane.privateCaArn;
        this.telemetry_dns = kong_control_plane.telemetryDns;
        this.cluster_dns = kong_control_plane.clusterDns;
        // define resources here...
    }
}


