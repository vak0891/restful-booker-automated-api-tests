# Restful Booker API Test Automation

## Pre-requisites

Node, Yarn, Mocha, Mocha-reporter installed globally

#### Node in macOS

If you are on macOS you can install it through brew (first make sure you have brew.sh installed)

Then do:
```
brew search node
```
Just to verify node@10 is on the 'Formulaes' and we can install it without errors.

After you see it do:

```
brew install node@10
```
After that you probably have to add it to your $PATH to be able to use node on the terminal
```
echo 'export PATH="/usr/local/opt/node@10/bin:$PATH"' >> ~/.bash_profile
```
Then:
```
source ~/.bash_profile
```

If installation was succesfull check for the version:
```
$ node --version
=> v10.16.3
```

## Yarn

Once you have Node.js installed successfully you can install yarn gobally:
```
npm install -g yarn
```
Let's check yarn's version to check installation was successful:
```
$  yarn --version
=> Version 1.17.3
```

## Mocha

Once yarn is installed, install Mocha through it:

```
yarn global add mocha
```

## How to run the tests

To run the all the tests use following command:

```
yarn test
```

## Project structure

Following structure is how test repository is organized: 

```
.
├── README.md
├── mocks/
├── node_modules/
├── package.json
├── support/
├── test/
└── yarn.lock
```
- **test**: test location folder, mocha look automatically into the folder and runt all the test located there.
- **support**: helper functions folder, use this folder to add your own functions that can be reused by various test.
- **mocks**: folder dedicated for test data and mocks.