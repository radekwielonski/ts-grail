#!/usr/bin/env node

const { execSync, exit } = require("child_process");
const fs = require("fs");
const path = require("path");

if (process.argv[2] === "--init") {
  console.log("Creating project structure...");

  const templatePackage = fs.readFileSync(
    path.join(__dirname, "./project-template/package.json"),
    "utf-8"
  );
  fs.writeFileSync("package.json", templatePackage);
  const templateTsConfig = fs.readFileSync(
    path.join(__dirname, "./project-template/tsconfig.json"),
    "utf-8"
  );
  fs.writeFileSync("tsconfig.json", templateTsConfig);
  const templateMain = fs.readFileSync(
    path.join(__dirname, "./project-template/main.ts"),
    "utf-8"
  );
  fs.writeFileSync("main.ts", templateMain);

  execSync(`mkdir functions`);
  const templateHandler = fs.readFileSync(
    path.join(__dirname, "./project-template/functions/handler.ts"),
    "utf-8"
  );
  fs.writeFileSync("functions/handler.ts", templateHandler);
  console.log("Files coppied, starting installation of dependencies");
  execSync(`npm install`, { stdio: "inherit" });

  console.log("Project succesfully created!");
} else if (process.argv[2] === "deploy") {
  if (process.argv[3] === "aws") {
    let profile = "";
    if (process.argv.includes("--profile")) {
      const profileIndex =
        process.argv.findIndex((arg) => arg === "--profile") + 1;

      profile = `--profile ${process.argv[profileIndex]}`;
    }
    console.log("Starting deployment...");
    execSync(
      `cdk deploy --app "npx ts-node --prefer-ts-exts main.ts" ${profile}`
    );
    console.log("App has been sythesised");
  } else {
    console.log(
      `Deployment to ${process.argv[3]} is not supported at the moment`
    );
  }
} else if (process.argv[2] === "local") {
  if (process.argv[3] === "aws") {
    console.log("Starting local env...");
    let samInstalled = false;
    try {
      execSync(`sam --version`);
      samInstalled = true;
    } catch {
      console.error(
        'Please install aws-sam-cli e.g. "brew install aws-sam-cli"'
      );
    }
    if (!samInstalled) {
      exit();
    }

    execSync(`tsc`, {
      stdio: "inherit",
    });

    execSync(`cdk synth --app "npx ts-node --prefer-ts-exts main.ts"`, {
      stdio: "inherit",
    });

    const fileName = execSync(
      `find ./cdk.out/ -type f -iname "*.template.json"`
    ).toString();
    execSync(`sam local start-api -t ${fileName}`, {
      stdio: "inherit",
    });
  } else {
    console.log(
      `Local development on ${process.argv[3]} is not supported at the moment`
    );
  }
}
