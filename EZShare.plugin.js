/**
 * @name EZShare
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.0.1
 * @invite SgKSKyh9gY
 * @description Adds a slash command to share plugins and themes with additional information.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/EZShare.plugin.js
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
        name: "EZShare",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "1025214794766221384",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.1",
        description:
          "Adds a slash command to share plugins and themes with additional information.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/EZShare.plugin.js",
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
            "Well share those illegal plugins with ezzz now ...( ＿ ＿)ノ｜",
          ],
        },
        {
          title: "v1.0.1",
          items: ["Corrected text."],
        }
      ],
      main: "EZShare.plugin.js",
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
            Utilities,
            Settings: { SettingPanel, Switch },
            DiscordModules: { MessageActions },
          } = Library;
          const { Plugins, Themes } = BdApi;  
          const fs = require("fs");
          const path = require("path");    
          const UploadModule = WebpackModules.getByProps("cancel", "upload");
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
          const defaultSettings = {
            plugins: true,
            themes: true,
          };
          const ApplicationCommandAPI = new class {
            constructor() {
              this.version = "1.0.0";
              this.ApplicationCommandStore = WebpackModules.getModule((m) =>
                m?.ZP?.getApplicationSections
              );
              this.IconUtils = WebpackModules.getByProps("getApplicationIconURL");
              this.UserStore = WebpackModules.getByProps(
                "getCurrentUser",
                "getUser"
              );
              this.CurrentUser = this.UserStore.getCurrentUser();
              this.CurrentUserSection = {
                id: this.CurrentUser.id,
                name: this.CurrentUser.username,
                type: 1,
                icon: this.CurrentUser.avatar,
              }
              this.commands = window?.SlashCommandAPI?.commands ?? new Map();
              Patcher.after(this.ApplicationCommandStore, "JK", (_, args, res) => {
                if (!res || !this.commands.size) return;
                if (
                  !Array.isArray(res.sectionDescriptors) ||
                  !res.sectionDescriptors.some(
                    (section) => section.id == this.CurrentUserSection.id
                  )
                )
                  res.sectionDescriptors = Array.isArray(res.sectionDescriptors)
                    ? res.sectionDescriptors.splice(1, 0, this.CurrentUserSection)
                    : [this.CurrentUserSection];
                if (
                  !Array.isArray(res.commands) ||
                  Array.from(this.commands.values()).some(
                    (command) => !res.commands.includes(command)
                  )
                )
                  res.commands = Array.isArray(res.commands)
                    ? [
                      ...res.commands.filter(
                        (command) =>
                          !Array.from(this.commands.values()).includes(command)
                      ),
                      ...Array.from(this.commands.values()),
                    ]
                    : Array.from(this.commands.values());
              });
              Patcher.after(
                this.ApplicationCommandStore.ZP,
                "getChannelState",
                (_, args, res) => {
                  if (!res || !this.commands.size) return;
                  if (
                    !Array.isArray(res.applicationSections) ||
                    !res.applicationSections.some(
                      (section) => section.id == this.CurrentUserSection.id
                    )
                  )
                    res.applicationSections = Array.isArray(res.applicationSections)
                      ? [this.CurrentUserSection, ...res.applicationSections]
                      : [this.CurrentUserSection];
                  if (
                    !Array.isArray(res.applicationCommands) ||
                    Array.from(this.commands.values()).some(
                      (command) => !res.applicationCommands.includes(command)
                    )
                  )
                    res.applicationCommands = Array.isArray(res.applicationCommands)
                      ? [
                        ...res.applicationCommands.filter(
                          (command) =>
                            !Array.from(this.commands.values()).includes(command)
                        ),
                        ...Array.from(this.commands.values()),
                      ]
                      : Array.from(this.commands.values());
                }
              );
              Patcher.instead(
                this.IconUtils,
                "getApplicationIconURL",
                (_, args, res) => {
                  if (args[0].id == this.CurrentUser.id)
                    return IconUtils.getUserAvatarURL(this.CurrentUser);
                  return res(...args);
                }
              );
            }
            register(name, command) {
              (command.applicationId = this.CurrentUser.id),
                (command.id = `${this.CurrentUser.username}_${this.commands.size + 1
                  }`.toLowerCase());
              this.commands.set(name, command);
              this.ApplicationCommandStore.ZP.shouldResetAll = true;
            };
            unregister(name) {
              this.commands.delete(name);
              Athis.pplicationCommandStore.ZP.shouldResetAll = true;
            }
            shouldUpdate(currentApiVersion = window?.SlashCommandAPI?.version, pluginApiVersion = this.version) {
              if (!currentApiVersion) return true;
              else if (!pluginApiVersion) return false;
              currentApiVersion = currentApiVersion.split(".").map((e) => parseInt(e));
              pluginApiVersion = pluginApiVersion.split(".").map((e) => parseInt(e));
              if ((pluginApiVersion[0] > currentApiVersion[0]) || (pluginApiVersion[0] == currentApiVersion[0] && pluginApiVersion[1] > currentApiVersion[1]) || (pluginApiVersion[0] == currentApiVersion[0] && pluginApiVersion[1] == currentApiVersion[1] && pluginApiVersion[2] > currentApiVersion[2])) return true;
              return false;
            }
          }
          const SlashCommandAPI = ApplicationCommandAPI.shouldUpdate() ? window.SlashCommandAPI = ApplicationCommandAPI : window.SlashCommandAPI;    
          return class EZShare extends Plugin {
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
              this.addCommand();
            }
            addCommand() {
                if (this.settings["plugins"])
                  SlashCommandAPI.register(`${config.info.name}_plugins`, {
                    name: "share plugin",
                    displayName: "share plugin",
                    displayDescription:
                      "Share a plugin with additional information.",
                    description:
                      "Share a plugin with additional information.",
                    type: 1,
                    target: 1,
                    execute: ([send, info, pluginID], { channel }) => {
                      try {
                        const Plugin = Plugins.get(pluginID.value);
                        if (send.value) {
                          const PluginData = fs.readFileSync(path.join(Plugins.folder, Plugin.filename), 'utf8');
                          const PluginText = new Blob([PluginData], { type: "text/plain" });
                          const JSFileToUpload = new File([PluginText], Plugin.filename);
                          UploadModule.upload({
                            channelId: channel.id,
                            file: JSFileToUpload,
                            draftType: null,
                            message: "",
                          });
                          info.value
                            ? MessageActions.sendMessage(
                                channel.id,
                                {
                                  content: `**${Plugin.name}** \n ${
                                    Plugin.description
                                  } \n\n ${
                                    Plugin.filename
                                      ? `File name: ${Plugin.filename} \n`
                                      : ""
                                  } ${
                                    Plugin.version
                                      ? `Version: ${Plugin.version} \n`
                                      : ""
                                  } ${
                                    Plugin.updateUrl
                                      ? `Download link: ${Plugin.updateUrl} \n`
                                      : ""
                                  } ${
                                    Plugin.source
                                      ? `Source website: ${Plugin.source} \n`
                                      : ""
                                  } ${
                                    Plugin.invite
                                      ? `Support server: https://discord.gg/${Plugin.invite}`
                                      : ""
                                  }`,
                                  tts: false,
                                  invalidEmojis: [],
                                  validNonShortcutEmojis: [],
                                },
                                undefined,
                                {}
                              )
                            : Plugin.updateUrl
                            ? MessageActions.sendMessage(
                                channel.id,
                                {
                                  content: Plugin.updateUrl,
                                  tts: false,
                                  invalidEmojis: [],
                                  validNonShortcutEmojis: [],
                                },
                                undefined,
                                {}
                              )
                            : MessageActions.receiveMessage(
                                channel.id,
                                FakeMessage.makeMessage(
                                  channel.id,
                                  "Unable to find the corresponding download link."
                                )
                              );
                        } else
                          info.value
                            ? MessageActions.receiveMessage(
                                channel.id,
                                FakeMessage.makeMessage(channel.id, "", [
                                  {
                                    type: "rich",
                                    title: Plugin.name,
                                    description: Plugin.description,
                                    color: "6577E6",
                                    thumbnail: {
                                      url: "https://tharki-god.github.io/assets/connections/plugin.png",
                                      proxyURL:
                                        "https://tharki-god.github.io/assets/connections/plugin.png",
                                      width: 400,
                                      height: 400,
                                    },
                                    fields: [
                                      ...(Plugin.filename
                                        ? [
                                            {
                                              name: "File name",
                                              value: Plugin.filename,
                                              inline: false,
                                            },
                                          ]
                                        : []),
                                      ...(Plugin.version
                                        ? [
                                            {
                                              name: "Version",
                                              value: Plugin.version,
                                              inline: false,
                                            },
                                          ]
                                        : []),
                                      ...(Plugin.updateUrl
                                        ? [
                                            {
                                              name: "Download link",
                                              value: Plugin.updateUrl,
                                              inline: false,
                                            },
                                          ]
                                        : []),
                                      ...(Plugin.source
                                        ? [
                                            {
                                              name: "Source website",
                                              value: Plugin.source,
                                              inline: false,
                                            },
                                          ]
                                        : []),
                                      ...(Plugin.invite
                                        ? [
                                            {
                                              name: "Support server",
                                              value: `https://discord.gg/${Plugin.invite}`,
                                              inline: false,
                                            },
                                          ]
                                        : []),
                                    ],
                                  },
                                ])
                              )
                            : MessageActions.receiveMessage(
                                channel.id,
                                FakeMessage.makeMessage(
                                  channel.id,
                                  Plugin.updateUrl ??
                                    "Unable to find the corresponding download link."
                                )
                              );
                      } catch (err) {
                        Logger.err(err);
                        MessageActions.receiveMessage(
                          channel.id,
                          FakeMessage.makeMessage(
                            channel.id,
                            "Unable to fetch information about the plugin."
                          )
                        );
                      }
                    },
                    options: [
                      {
                        description: "Whether you want to send this or not.",
                        displayDescription:
                          "Whether you want to send this or not.",
                        displayName: "Send",
                        name: "Send",
                        required: true,
                        type: 5,
                      },
                      {
                        description:
                          "Whether you want to send additional information related to the plugin.",
                        displayDescription:
                          "Whether you want to send additional information related to the plugin.",
                        displayName: "Additional Info",
                        name: "Additional Info",
                        required: true,
                        type: 5,
                      },
                      {
                        description: "Which plugin you want to share.",
                        displayDescription: "Which plugin you want to share.",
                        displayName: "Plugin",
                        name: "Plugin",
                        required: true,
                        choices: Plugins.getAll().map(({ name, id }) => ({
                          name,
                          displayName: name,
                          value: id,
                        })),
                        type: 3,
                      },
                    ],
                  });
                if (this.settings["themes"])
                  SlashCommandAPI.register(`${config.info.name}_themes`, {
                    name: "share theme",
                    displayName: "share theme",
                    displayDescription:
                      "Share a theme with additional information.",
                    description:
                      "Share a theme with additional information.",
                    type: 1,
                    target: 1,
                    execute: ([send, info, themeID], { channel }) => {
                      try {
                        const Theme = Themes.get(themeID.value);
                        if (send.value) {
                          const ThemeData = fs.readFileSync(path.join(Themes.folder, Theme.filename), 'utf8');
                          const ThemeText = new Blob([ThemeData], { type: "text/plain" });
                          const CSSFileToUpload = new File([ThemeText], Theme.filename);
                          UploadModule.upload({
                            channelId: channel.id,
                            file: CSSFileToUpload,
                            draftType: null,
                            message: "",
                          }); info.value
                          ? MessageActions.sendMessage(
                              channel.id,
                              {
                                content: `**${Plugin.name}** \n ${
                                  Plugin.description
                                } \n\n ${
                                  Plugin.filename
                                    ? `File name: ${Plugin.filename} \n`
                                    : ""
                                } ${
                                  Plugin.version
                                    ? `Version: ${Plugin.version} \n`
                                    : ""
                                } ${
                                  Plugin.updateUrl
                                    ? `Download link: ${Plugin.updateUrl} \n`
                                    : ""
                                } ${
                                  Plugin.source
                                    ? `Source website: ${Plugin.source} \n`
                                    : ""
                                } ${
                                  Plugin.invite
                                    ? `Support server: https://discord.gg/${Plugin.invite}`
                                    : ""
                                }`,
                                tts: false,
                                invalidEmojis: [],
                                validNonShortcutEmojis: [],
                              },
                              undefined,
                              {}
                            )
                          : Plugin.updateUrl
                          ? MessageActions.sendMessage(
                              channel.id,
                              {
                                content: Plugin.updateUrl,
                                tts: false,
                                invalidEmojis: [],
                                validNonShortcutEmojis: [],
                              },
                              undefined,
                              {}
                            )
                          : MessageActions.receiveMessage(
                              channel.id,
                              FakeMessage.makeMessage(
                                channel.id,
                                "Unable to find the corresponding download link."
                              )
                            );
                           } else info.value
                           ? MessageActions.receiveMessage(
                               channel.id,
                               FakeMessage.makeMessage(channel.id, "", [
                                 {
                                   type: "rich",
                                   title: Theme.name,
                                   description: Theme.description,
                                   color: "6577E6",
                                   thumbnail: {
                                     url: "https://tharki-god.github.io/files-random-host/ic_fluent_color_24_filled.png",
                                     proxyURL:
                                       "https://tharki-god.github.io/files-random-host/ic_fluent_color_24_filled.png",
                                     width: 400,
                                     height: 400,
                                   },
                                   fields: [
                                     ...(Theme.filename
                                       ? [
                                           {
                                             name: "File name",
                                             value: Theme.filename,
                                             inline: false,
                                           },
                                         ]
                                       : []),
                                     ...(Theme.version
                                       ? [
                                           {
                                             name: "Version",
                                             value: Theme.version,
                                             inline: false,
                                           },
                                         ]
                                       : []),
                                     ...(Theme.updateUrl
                                       ? [
                                           {
                                             name: "Download link",
                                             value: Theme.updateUrl,
                                             inline: false,
                                           },
                                         ]
                                       : []),
                                     ...(Theme.source
                                       ? [
                                           {
                                             name: "Source website",
                                             value: Theme.source,
                                             inline: false,
                                           },
                                         ]
                                       : []),
                                     ...(Theme.invite
                                       ? [
                                           {
                                             name: "Support server",
                                             value: `https://discord.gg/${Theme.invite}`,
                                             inline: false,
                                           },
                                         ]
                                       : []),
                                   ],
                                 },
                               ])
                             )
                           : MessageActions.receiveMessage(
                               channel.id,
                               FakeMessage.makeMessage(
                                 channel.id,
                                 Plugin.updateUrl ??
                                   "Unable to find the corresponding download link."
                               )
                             )
                      } catch (err) {
                        Logger.err(err);
                        MessageActions.receiveMessage(
                          channel.id,
                          FakeMessage.makeMessage(
                            channel.id,
                            "Unable to fetch information about the theme."
                          )
                        );
                      }
                    },
                    options: [
                      {
                        description: "Whether you want to send this or not.",
                        displayDescription:
                          "Whether you want to send this or not.",
                        displayName: "Send",
                        name: "Send",
                        required: true,
                        type: 5,
                      },
                      {
                        description:
                          "Whether you want to send additional information related to the theme.",
                        displayDescription:
                          "Whether you want to send additional information related to the theme.",
                        displayName: "Additional Info",
                        name: "Additional Info",
                        required: true,
                        type: 5,
                      },
                      {
                        description: "Which theme you want to share.",
                        displayDescription: "Which theme you want to share.",
                        displayName: "Theme",
                        name: "Theme",
                        required: true,
                        choices: Themes.getAll().map(({ name, id }) => ({
                          name,
                          displayName: name,
                          value: id,
                        })),
                        type: 3,
                      },
                    ],
                  });
            }
            onStop() {
              SlashCommandAPI.unregister(`${config.info.name}_plugins`);
              SlashCommandAPI.unregister(`${config.info.name}_themes`);
            }
            getSettingsPanel() {
              return SettingPanel.build(
                this.saveSettings.bind(this),
                new Switch(
                  "Plugins",
                  "Get a slash command for sharing plugins.",
                  this.settings["plugins"],
                  (e) => {
                    this.settings["plugins"] = e;
                  }
                ),
                new Switch(
                  "Themes",
                  "Get a slash command for sharing themes.",
                  this.settings["themes"],
                  (e) => {
                    this.settings["themes"] = e;
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
  