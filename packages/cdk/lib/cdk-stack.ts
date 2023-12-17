import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.DockerImageFunction(this, "MyFunction", {
      code: lambda.DockerImageCode.fromImageAsset(`${__dirname}/../../lambda`, {
        exclude: ["cdk.out", "node_modules"],
        buildArgs: {
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
          AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN || "",
          AWS_LWA_READINESS_CHECK_PATH:
            process.env.AWS_LWA_READINESS_CHECK_PATH || "",
        },
      }),
    });

    myLambda.addFunctionUrl();
  }
}
