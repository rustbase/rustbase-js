// https://github.com/CatsMiaow/node-grpc-typescript/blob/master/bin/proto.js (8/30/22)

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const PROTO_DIR = path.join(__dirname, '../proto');
const MODEL_DIR = path.join(__dirname, '../src/models');
const PROTOC_PATH = path.join(
    __dirname,
    '../node_modules/grpc-tools/bin/protoc'
);
const PLUGIN_PATH = path.join(
    __dirname,
    '../node_modules/.bin/protoc-gen-ts_proto'
);

fs.mkdirSync(MODEL_DIR, { recursive: true });

const protoConfig = [
    `--plugin=${PLUGIN_PATH}`,

    '--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true',

    `--ts_proto_out=${MODEL_DIR}`,
    `--proto_path=${PROTO_DIR} ${PROTO_DIR}/*.proto`,
];

execSync(`${PROTOC_PATH} ${protoConfig.join(' ')}`);
