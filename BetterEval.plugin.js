/**
 * @name BetterEval
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.7
 * @invite SgKSKyh9gY
 * @description Adds a slash command to evaluate javascript code locally.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterEval.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
  const config = {
    info: {
      name: "BetterEval",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.7",
      description: "Adds a slash command to evaluate javascript code locally.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterEval.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "[DANGEROUS] DO NOT USE THIS COMMAND WITH CODE YOU DO NOT UNDERSTAND.",
          "...( ＿ ＿)ノ｜",
        ],
      },
    ],
    main: "BetterEval.plugin.js",
  };
  return !window.hasOwnProperty("ZeresPluginLibrary")
  ? class {
      load() {
        BdApi.showConfirmationModal(
          "ZLib Missing",
          `The library plugin (ZeresPluginLibrary) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => this.downloadZLib(),
          }
        );
      }
      async downloadZLib() {
        const fs = require("fs");
        const path = require("path");
        const ZLib = await fetch(
          "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
        );
        if (!ZLib.ok) return this.errorDownloadZLib();
        const ZLibContent = await ZLib.text();
        try {
          await fs.writeFile(
            path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
            ZLibContent,
            (err) => {
              if (err) return this.errorDownloadZLib();
            }
          );
        } catch (err) {
          return this.errorDownloadZLib();
        }
      }
      errorDownloadZLib() {
        const { shell } = require("electron");
        BdApi.showConfirmationModal(
          "Error Downloading",
          [
            `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
          ],
          {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
              shell.openExternal(
                "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
              );
            },
          }
        );
      }
      start() {}
      stop() {}
    }
  : (([Plugin, Library]) => {
        const {
          WebpackModules,
          Modals,
          Logger,
          PluginUpdater,
          Utilities,
          DiscordModules: { MessageActions },
        } = Library;
        const SlashCommandsStore =
          WebpackModules.getByProps("BUILT_IN_COMMANDS");
        const util = require("util");
        const process = require("process");
        return class BetterEval extends Plugin {
          constructor() {
            super();
            this.firstRun = Utilities.loadData(
              config.info.name,
              "firstRun",
              true
            );
          }
          showDisclaimer() {
            Modals.showAlertModal("DISCLAIMER: THIS PLUGIN IS DANGEROUS", [
              "```DO NOT, UNDER ANY CIRCUMSTANCES, RUN CODE YOU DO NOT UNDERSTAND. IF SOMEBODY TELLS YOU TO RUN CODE, THEY ARE MOST LIKELY TRYING TO STEAL YOUR ACCOUNT OR INSTALL MALWARE ON YOUR DEVICE. UNLESS YOU FULLY UNDERSTAND WHAT A PIECE OF CODE DOES, DO NOT RUN SAID PIECE OF CODE.```\n\n\n\n\n I, the author of Better Eval, am not responsible for any harm/damage caused by using this plugin. Use the plugin at your own risk.",
            ]);
            Utilities.saveData(config.info.name, "firstRun", false);
          }
          checkForUpdates() {
            try {
              PluginUpdater.checkForUpdate(
                config.info.name,
                config.info.version,
                config.info.github_raw
              );
            } catch (err) {
              Logger.err("Plugin Updater could not be reached.", err);
            }
          }
          onStart() {
            this.checkForUpdates();
            if (this.firstRun) this.showDisclaimer();
            this.addEval();
          }
          addEval() {
            SlashCommandsStore.BUILT_IN_COMMANDS.push({
              __registerId: config.info.name,
              applicationId: "-1",
              name: "eval",
              displayName: "eval",
              displayDescription:"[DANGEROUS] Evaluates javascript code locally. DO NOT USE THIS COMMAND WITH CODE YOU DO NOT UNDERSTAND.",
              description:
                "[DANGEROUS] Evaluates javascript code locally. DO NOT USE THIS COMMAND WITH CODE YOU DO NOT UNDERSTAND.",
              id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
              type: 1,
              target: 1,
              predicate: () => true,
              execute: async ([code, isAsync], { channel }) => {
                const Embed = await this.evaluate(code.value, isAsync.value);
                MessageActions.sendBotMessage(channel.id, "", [Embed]);
              },
              options: [
                {
                  description: "Javascript code you want to evaluate.",
                  displayDescription: "Javascript code you want to evaluate.",
                  displayName: "Code",
                  name: "Code",
                  required: true,
                  type: 3,
                },
                {
                  description: "Evaluate Asynchronously.",
                  displayDescription: "Evaluate Asynchronously.",
                  displayName: "Async",
                  name: "Async",
                  required: true,
                  type: 5,
                },
              ],
            });
          }
          async evaluate(code, isAsync) {
            var result = undefined;
            var errored = false;
            if (isAsync) {
              if (
                code.includes(";") &&
                (!code.endsWith(";") ||
                  code.includes("\n") ||
                  code.split(";").length > 2)
              ) {
                code = "(async () => {" + code + "})()";
              } else {
                code = "(async () => { return " + code + "})()";
              }
            }
            var start = process.hrtime();
            try {
              result = eval(code);
              if (result instanceof Promise) {
                result = await result;
              }
            } catch (e) {
              result = e;
              errored = true;
            }
            var elapsed = process.hrtime(start);
            var elapsed_ms = elapsed[0] * 1e3 + elapsed[1] / 1e6;
            var elapsed_str = elapsed_ms + " ms";
            if (errored) {
              Logger.err(result);
            }
            result = util.inspect(result);
            return {
              type: "rich",
              title: (errored ? "Error" : "Success") + " " + elapsed_str,
              thumbnail: {
                url: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
                proxyURL:
                  "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
                width: 400,
                height: 400,
              },
              color: "6577E6",
              description: "```js\n" + result + "\n```",
              timestamp: Date.now(),
            };
          }
          onStop() {
            this.unregisterAllCommands(config.info.name);
          }
          unregisterAllCommands(caller) {
            let index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
              (cmd) => cmd.__registerId === caller
            );
            while (index > -1) {
              SlashCommandsStore.BUILT_IN_COMMANDS.splice(index, 1);
              index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
                (cmd) => cmd.__registerId === caller
              );
            }
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
