import { Stack, StackProps, aws_ecs, aws_rds, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
//import * as KongCP from 'kong-control-plane';
import * as KongCP from "../../kong-control-plane/src";

import {Vpc} from "aws-cdk-lib/aws-ec2";
import {PostgresEngineVersion} from "aws-cdk-lib/aws-rds";
export class KongCpEcs extends Stack {

    public readonly control_plane: aws_ecs.Cluster;
    public readonly private_ca_arn : string;
    public readonly telemetry_dns : string;
    public readonly cluster_dns : string;

    constructor(scope: Construct, id: string, props: StackProps = {} ) {
        super(scope, id, props);

        const kong_control_plane = new KongCP.KongEcs(this,'KongEcsCp', {
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
            clusterName: "kong-cp",
            internetFacing: true,
            licenseSecret: "kong-license-cdk",
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


