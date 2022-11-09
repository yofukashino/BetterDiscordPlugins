/**
 * @name IP
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description Adds a slash command to get your IP address and some additional data associated with it.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/IP.plugin.js
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
      name: "IP",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.1",
      description: "Adds a slash command to get your IP address and some additional data associated with it.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/IP.plugin.js",
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
          "Don't do it on stream (⊙_⊙)？",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "IP.plugin.js",
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
          PluginUpdater,
          Logger,
          Patcher,
          DiscordModules: { MessageActions },
        } = Library;
        const SlashCommandStore = WebpackModules.getModule((m) =>
          m?.Kh?.toString?.()?.includes?.("BUILT_IN_TEXT")
        );
        return class IP extends Plugin {
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
          start() {
            this.checkForUpdates();
            this.addCommand();
          }
          addCommand() {
            Patcher.after(SlashCommandStore, "Kh", (_, args, res) => {
              if (args[0] !== 1) return;
              res.push({
                applicationId: "-1",
                name: "ip",
                displayName: "ip",
                displayDescription: "Fetch your IP address and additional information associated with it.",
                description: "Fetch your IP address and additional information associated with it.",
                id: (-1 - res.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: async (_, { channel }) => {
                  try {
                    let embed = await this.getIP();
                    MessageActions.sendBotMessage(channel.id, "", [embed]);
                  } catch (err) {
                    Logger.err(err);
                  }
                },
                options: [],
              });
            });
          }
          async getIP() {
            const response = await fetch("https://ipapi.co/json");
            const data = await response.json();
            return {
              type: "rich",
              title: "Your IP address and associated information:",
              description: "",
              color: "6577E6",
              thumbnail: {
                url: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
                proxyURL:
                  "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
                width: 400,
                height: 400,
              },
              fields: [
                {
                  name: `IP Address`,
                  value: data.ip,
                  inline: true,
                },
                {
                  name: `Version`,
                  value: data.version,
                  inline: true,
                },
                {
                  name: `ISP`,
                  value: data.org,
                  inline: true,
                },
                {
                  name: `City`,
                  value: data.city,
                  inline: true,
                },
                {
                  name: `Country`,
                  value: data.country_name,
                  inline: true,
                },
                {
                  name: `Timezone`,
                  value: data.timezone,
                  inline: true,
                },
                {
                  name: `UTC Offset`,
                  value: data.utc_offset,
                  inline: true,
                },
                {
                  name: `Calling Code`,
                  value: data.country_calling_code,
                  inline: true,
                },
                {
                  name: `Currency`,
                  value: data.currency,
                  inline: true,
                },
                {
                  name: `Postal Code`,
                  value: data.postal,
                  inline: true,
                },
              ],
            };
          }
          onStop() {
            Patcher.unpatchAll();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
