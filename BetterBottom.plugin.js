/**
 * @name BetterBottom
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description Adds a slash command to send a random cursed GIF.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterBottom.plugin.js
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
      name: "BetterBottom",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.1",
      description: "Adds a slash command to send random cursed gif.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterBottom.plugin.js",
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
    main: "BetterBottom.plugin.js",
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
          Logger,
          PluginUpdater,
          Utilities,
          Patcher,
          DiscordModules: { MessageActions},
          Settings: { SettingPanel, Switch, Textbox },
        } = Library;
        const request = require("request");
        const SlashCommandStore = WebpackModules.getModule(
          (m) => m?.Kh?.toString?.()?.includes?.("BUILT_IN_TEXT")
        );
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const DiscordConstants = WebpackModules.getModule(
          (m) => m?.Plq?.ADMINISTRATOR == 8n
        );
        const characterLimit = new RegExp(
          `.{1,${DiscordConstants.qhL}}`,
          "g"
        );
        const UploadModule = WebpackModules.getByProps("cancel", "upload");
        const FileModule = WebpackModules.getByProps(
          "classifyFile",
          "makeFile"
        );
        const defaultSettings = {
          encoder: true,
          decoder: true,
          split: true,
          uploadAsFile: true,
          fileName: "bottom.txt",
        };
        return class BetterBottom extends Plugin {
          constructor() {
            super();
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
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
          start() {
            this.checkForUpdates();
            if (this.settings["encoder"]) this.addEncoder();
            if (this.settings["decoder"]) this.addDecoder();
          }
          addEncoder() {
            Patcher.after(SlashCommandStore, "Kh", (_, args, res) => {
              if (args[0] !== 1) return;
              res.push({
                __registerId: config.info.name,
                applicationId: "-1",
                name: "bottom encode",
                displayName: "bottom encode",
                displayDescription: "Convert text to bottom.",
                description: "Convert text to bottom.",
                id: (-1 - res.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: async ([send, toEncode], { channel }) => {
                  try {
                    const body = await this.bottom("encode", toEncode.value);
                    if (body.message)
                      return MessageActions.sendBotMessage(
                        channel.id,
                        body.message
                      );
                    this.sendAccordingly(send.value, channel, body.encoded);
                  } catch (err) {
                    Logger.err(err);
                    MessageActions.sendBotMessage(
                      channel.id,
                      "Could not convert the text to bottom."
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
                  {
                    description: "The text you want to encode.",
                    displayDescription: "The text you want to encode.",
                    displayName: "Text",
                    name: "Text",
                    required: true,
                    type: 3,
                  },
                ],
              });
            });
          }
          addDecoder() {
            Patcher.after(SlashCommandStore, "Kh", (_, args, res) => {
              if (args[0] !== 1) return;
              res.push({
                __registerId: config.info.name,
                applicationId: "-1",
                name: "bottom decode",
                displayName: "bottom decode",
                displayDescription: "Convert bottom to text for understanding.",
                description: "Convert bottom to text for understanding.",
                id: (-1 - res.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: async ([send, toDecode], { channel }) => {
                  try {
                    const body = await this.bottom("decode", toDecode.value);
                    if (body.message)
                      return MessageActions.sendBotMessage(
                        channel.id,
                        body.message
                      );
                    this.sendAccordingly(send.value, channel, body.decoded);
                  } catch (err) {
                    Logger.err(err);
                    MessageActions.sendBotMessage(
                      channel.id,
                      "Could not convert the bottom to text."
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
                  {
                    description: "The bottom you want to decode.",
                    displayDescription: "The bottom you want to decode.",
                    displayName: "Bottom",
                    name: "Bottom",
                    required: true,
                    type: 3,
                  },
                ],
              });
            });
          }
          async sendAccordingly(send, channel, content) {
            const splitMessages = content.match(characterLimit);
            if (!send) {
              for (const message of splitMessages) {
                MessageActions.sendBotMessage(channel.id, message);
              }
              return;
            }
            if (content?.length < DiscordConstants?.qhL)
              return MessageActions.sendMessage(
                channel.id,
                {
                  content: content,
                  tts: false,
                  bottom: true,
                  invalidEmojis: [],
                  validNonShortcutEmojis: [],
                },
                undefined,
                {}
              );
            if (
              this.settings["split"] && (!channel.rateLimitPerUser ||
              this.canSendSplitMessage(channel))
            ) {
              for (const message of splitMessages) {
                MessageActions.sendMessage(
                  channel.id,
                  {
                    content: message,
                    tts: false,
                    bottom: true,
                    invalidEmojis: [],
                    validNonShortcutEmojis: [],
                  },
                  undefined,
                  {}
                );
              }
              return;
            } else if (
              this.settings["uploadAsFile"] &&
              channel.rateLimitPerUser &&
              !this.canSendSplitMessage(channel) && this.canSendFiles(channel)
            ) {
              const txt = new Blob([content], { type: "text/plain" });
              const fileToUpload = new File([txt], this.settings["fileName"]);
              UploadModule.upload({
                channelId: channel.id,
                file: fileToUpload,
                draftType: null,
                message: "",
              });
            } else
              MessageActions.sendBotMessage(
                channel.id,
                "The message is too long to send.\n(Enable Split message and upload as file in the settings to be able to send longer messages.)"
              );
          }
          canSendSplitMessage(channel) {
            return (
              ChannelPermissionStore.can(
                DiscordConstants.Plq.MANAGE_MESSAGES,
                channel
              ) ||
              ChannelPermissionStore.can(
                DiscordConstants.Plq.MANAGE_CHANNELS,
                channel
              )
            );
          }
          canSendFiles(channel) {
            return ChannelPermissionStore.can(
                DiscordConstants.Plq.ATTACH_FILES,
                channel
              );
          }
          bottom(type, content) {
            return new Promise((resolve, reject) => {
              const options = [
                `https://bottom.daggy.workers.dev/${encodeURI(
                  type == "encode"
                    ? `encode?text=${content}`
                    : `decode?bottom=${content}`
                )}`,
                { json: true },
              ];
              request.get(...options, (err, res, body) => {
                if (err || (res.statusCode < 200 && res.statusCode > 400)) 
                  return reject("An unknown error occurred.");              
              resolve(JSON.parse(body));
            });
          });
          }
          onStop() {
            Patcher.unpatchAll();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Encode",
                "Enable command to encode bottom.",
                this.settings["encoder"],
                (e) => {
                  this.settings["encoder"] = e;
                }
              ),
              new Switch(
                "Decode",
                "Enable command to decode bottom.",
                this.settings["decoder"],
                (e) => {
                  this.settings["decoder"] = e;
                }
              ),
              new Switch(
                "Split message",
                "Split a message into multiple messages if it is larger than the character limit and Slowmode is not enabled on the selected channel.",
                this.settings["split"],
                (e) => {
                  this.settings["split"] = e;
                }
              ),
              new Switch(
                "Upload as file",
                "Upload a message as a file if it is larger than the character limit and Slowmode is enabled on the selected channel.",
                this.settings["uploadAsFile"],
                (e) => {
                  this.settings["uploadAsFile"] = e;
                }
              ),
              new Textbox(
                "File name",
                "The file name (with extension) to use when uploading a message as a file.",
                this.settings["fileName"],
                (e) => {
                  this.settings["fileName"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
