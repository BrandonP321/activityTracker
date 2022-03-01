/**
 * Watches for file changes on specified files/directories and executes provided script on change.
 * Does not work on Linux machines,
 * CURRENTLY USING NODEMON UNTIL I FIGURE OUT WHY NODE-WATCH ISN'T WORKING
 */

// import watch from "node-watch";
// import { ConfigSystem } from "../src/config/ConfigSystem";
// import { MasterConfigInstance } from "../src/config/Master.config";
import { generateMasterConfig } from "./generateMasterConfig";

// interface FileWatcher {
//   path: string;
//   script: (env: any, config: ConfigSystem) => void;
// }

// const systemsDir: FileWatcher = { path: `${__dirname}/../src/config/systems`, script: generateMasterConfig };
// const masterConfigFile: FileWatcher = { path: `${__dirname}/../src/config/Master.config.ts`, script: generateMasterConfig };

// const allWatchers = [systemsDir, masterConfigFile]

// console.log("Watching for autoconfig file changes");

// watch(systemsDir.path, {recursive: true}, () => {
//   console.log("FILE CHANGE");
//   generateMasterConfig("live", createNewConfigInstance());
// })

// allWatchers.forEach(w => {
//   watch(w.path, { recursive: true }, function() {
//     console.log(`Generating codegen for File change at ${w.path}`);
//     return function() {
//       w.script("live", MasterConfigInstance);
//     }
//   }() )
// })

// build a config file for each environment
generateMasterConfig("live");
generateMasterConfig("dev");
generateMasterConfig("stage");
generateMasterConfig("local");