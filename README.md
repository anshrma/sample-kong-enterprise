# Sample Application - Kong Enterprise on AWS

This repository hosts code samples that you can use to get started for creating Kong Enterprise Platform on EKS using kong-control-plane, kong-data-plane and kong-core AWS CDK Construct. 

Please let us know if you need more samples by opening an issue here and we would priortize it.

## Sample use cases

You can pick and choose the desired use case. 

|Use Case | Sample Code to refer  |
--- | --- |
|Control Plane on Amazon Linux2 | /lib/eks_cp.ts|
|Data Plane on Amazon Linux2 | /lib/eks_dp.ts|

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


