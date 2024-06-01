import { FileSystemTree } from "@webcontainer/api";

export const files : FileSystemTree = {
  "unzipper.js": {
    file: {
      contents: `
  import * as fs from 'fs';
  import * as path from 'path';
  import {unzip} from 'unzipit';
  
  async function unzipFile(zipFilePath, outputDir) {
      const zipBuffer = fs.readFileSync(zipFilePath);
  
      const {entries} = await unzip(zipBuffer);
  
      for (const [name, entry] of Object.entries(entries)) {
          const filePath = path.join("game", name);
          const directory = path.dirname(filePath);
  
          // Ensure the directory exists
          if (!fs.existsSync(directory)) {
              fs.mkdirSync(directory, { recursive: true });
          }
          const data = Buffer.from(await entry.arrayBuffer())
          fs.writeFileSync(filePath, data);
  
      }
  }
  
  unzipFile('game.zip', 'output/directory');
  `,
    },
  },
  "package.json": {
    file: {
      contents: `
          {
            "name": "example-app",
            "type": "module",
            "dependencies": {
              "unzipit": "latest",
              "serve": "latest"
            },
            "scripts": {
              "start": "nodemon index.js"
            }
          }`,
    },
  },
};
