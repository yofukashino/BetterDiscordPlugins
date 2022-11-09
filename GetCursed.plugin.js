/**
 * @name GetCursed
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description Adds a slash command to send a random cursed GIF.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/GetCursed.plugin.js
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
      name: "GetCursed",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.1",
      description: "Adds a slash command to send a random cursed GIF.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/GetCursed.plugin.js",
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
          "Getting cursed is part of life ￣へ￣",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "GetCursed.plugin.js",
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
        const SlashCommandStore = WebpackModules.getModule(
          (m) => m?.Kh?.toString?.()?.includes?.("BUILT_IN_TEXT")
          );
        const randomNo = (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min);
        const endpoints = [
          "https://g.tenor.com/v1/random?q=disturbing-gifs&key=ZVWM77CCK1QF&limit=50",
          "https://g.tenor.com/v1/random?q=cursed-gifs&key=ZVWM77CCK1QF&limit=50",
          "https://g.tenor.com/v1/random?q=weird-gifs&key=ZVWM77CCK1QF&limit=50",
        ];
        return class GetCursed extends Plugin {
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
                name: "get cursed",
                displayName: "get cursed",
                displayDescription: "Send a random cursed GIF.",
                description: "Send a random cursed GIF.",
                id: (-1 - res.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: async ([send], { channel }) => {
                  try {
                    const GIF = await this.getGif(send.value);
                    if (!GIF)
                      return MessageActions.sendBotMessage(
                        channel.id,
                        "Failed to get any cursed GIF."
                      );
                    send.value
                      ? MessageActions.sendMessage(
                          channel.id,
                          {
                            content: GIF,
                            tts: false,
                            bottom: true,
                            invalidEmojis: [],
                            validNonShortcutEmojis: [],
                          },
                          undefined,
                          {}
                        )
                      : MessageActions.sendBotMessage(channel.id, "", [GIF]);
                  } catch (err) {
                    Logger.err(err);
                    MessageActions.sendBotMessage(
                      channel.id,
                      "Failed to get any cursed GIFs."
                    );
                  }
                },
                options: [
                  {
                    description: "Whether you want to send this or not.",
                    displayDescription: "Whether you want to send this or not.",
                    displayName: "Send",
                    name: "Send",
                    required: true,
                    type: 5,
                  },
                ],
              });
              });
          }
          async getGif(send) {
            const response = await fetch(endpoints[randomNo(0, 3)]);
            if (!response.ok) return;
            const data = await response.json();
            const GIF = Object.values(data.results)[randomNo(0, 50)];
            return send
              ? GIF.itemurl
              : {
                  image: {
                    url: GIF.media[0].gif.url,
                    proxyURL: GIF.media[0].gif.url,
                    width: GIF.media[0].gif.dims[0],
                    height: GIF.media[0].gif.dims[1],
                  },
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
