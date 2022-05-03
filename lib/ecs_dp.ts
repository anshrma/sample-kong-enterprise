//import * as kongDP from 'kong-data-plane';

import {aws_ec2, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as KongDP from "../../kong-data-plane/src";

interface KongDpEcsStackProps extends StackProps {
    vpc: aws_ec2.IVpc;
    cluster_dns: string;
    telemetry_dns: string;
    private_ca_arn: string;
};

export class KongDpEcs extends Stack {
    constructor(scope: Construct, id: string, props: KongDpEcsStackProps) {
        super(scope, id, props);
        const data_plane = new KongDP.KongEcs(this,'dp', {
            kongTaskProps: {
                cpu: 1024,
                memory: 2048,
                desiredCount: 1
            },
            vpc: props.vpc ,
            clusterName: "kong",
            internetFacing: true,
            privateCaArn: props.private_ca_arn,
            clusterDns: props.cluster_dns,
            telemetryDns: props.telemetry_dns
        });
    }
}
