#!/usr/bin/env node
const { execSync } = require("child_process");
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
    path.join(__dirname, "./project-template/main.txt"),
    "utf-8"
  );
  fs.writeFileSync("main.ts", templateMain);
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
  } else {
    console.log(
      `Deployment to ${process.argv[3]} is not supported at the moment`
    );
  }
}
