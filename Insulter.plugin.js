/**
 * @name Insulter
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.2
 * @invite SgKSKyh9gY
 * @description Adds a slash command to send an insult.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Insulter.plugin.js
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
      name: "Insulter",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.2",
      description: "Adds a slash command to send an insult.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Insulter.plugin.js",
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
          "I am useless and should die ＼（〇_ｏ）／",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "Insulter.plugin.js",
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
        const FakeMessage = {
          DiscordConstants: WebpackModules.getModule(
            (m) => m?.Plq?.ADMINISTRATOR == 8n
          ),
          TimestampUtils: WebpackModules.getByProps("fromTimestamp"),
          UserStore: WebpackModules.getByProps("getCurrentUser", "getUser"),
          get makeMessage() {
            return (channelId, content, embeds) => ({
              id: this.TimestampUtils.fromTimestamp(Date.now()),
              type: this.DiscordConstants.uaV.DEFAULT,
              flags: this.DiscordConstants.iLy.EPHEMERAL,
              content: content,
              channel_id: channelId,
              author: this.UserStore.getCurrentUser(),
              attachments: [],
              embeds: null != embeds ? embeds : [],
              pinned: false,
              mentions: [],
              mention_channels: [],
              mention_roles: [],
              mention_everyone: false,
              timestamp: new Date().toISOString(),
              state: this.DiscordConstants.yb.SENT,
              tts: false,
            });
          },
        };
        return class insult extends Plugin {
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
                name: "insult",
                displayName: "insult",
                displayDescription: "Sends an insult.",
                description: "Sends an insult.",
                id: (-1 - res.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: async ([send], { channel }) => {
                  try {
                    const insult = await this.getInsult();
                    if (!insult)
                      return MessageActions.sendBotMessage(
                        channel.id,
                        "Unable to get any insult for you, dumb cunt."
                      );
                    send.value
                      ? MessageActions.sendMessage(
                          channel.id,
                          {
                            content: insult,
                            tts: false,
                            bottom: true,
                            invalidEmojis: [],
                            validNonShortcutEmojis: [],
                          },
                          undefined,
                          {}
                        )
                      : MessageActions.receiveMessage(
                          channel.id,
                          FakeMessage.makeMessage(channel.id, insult)
                        );
                  } catch (err) {
                    Logger.err(err);
                    MessageActions.receiveMessage(
                      channel.id,
                      FakeMessage.makeMessage(
                        channel.id,
                        "Unable to get any insult for you, dumb cunt."
                      )
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
          async getInsult() {
            const response = await fetch(
              "https://insult.mattbas.org/api/insult"
            );
            if (!response.ok) return;
            return await response.text();
          }
          onStop() {
            Patcher.unpatchAll();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
