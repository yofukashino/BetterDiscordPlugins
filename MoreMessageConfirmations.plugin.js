/**
 * @name MoreMessageConfirmations
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.1
 * @invite SgKSKyh9gY
 * @description Adds warnings before sending messages in certain scenarios.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MoreMessageConfirmations.plugin.js
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
module.exports = ((_) => {
    const config = {
      info: {
        name: "MoreMessageConfirmations",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.1",
        description: "Adds warnings before sending messages in certain scenarios.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MoreMessageConfirmations.plugin.js",
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
            "Mommy loves me ψ(｀∇´)ψ",
          ],
        },
        {
          title: "v1.0.1",
          items: ["Corrected text."],
        },
      ],
      main: "MoreMessageConfirmations.plugin.js",
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
            Utilities,
            PluginUpdater,
            Logger,
            Patcher,
            Settings: { SettingPanel, Slider, SettingGroup, Switch },
          } = Library;
          const ChannelPermissionStore = WebpackModules.getByProps(
            "getChannelPermissions"
          );
          const DiscordConstants = WebpackModules.getModule(
            (m) => m?.Plq?.ADMINISTRATOR == 8n
          );
          const Confirmations = WebpackModules.getModule((m) =>
            m?.v?.toString()?.includes("openWarningPopout")
          );
          const defaultSettings = {
            slowModeConfirmation: true,
            slowmodeTrigger: 600,
            uploadConfirmation: true, 
            uploadTrigger: 3,
            mentionConfirmation: true, 
            mentionTrigger: 3,
  
          };
          return class MessageConfirmations extends Plugin {
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
              this.addWarnings();
            }
            addWarnings() {
              Patcher.instead(
                Confirmations,
                "v",
                (_, [args], res) =>
                  new Promise(async (resolve) => {
                    const mentions = this.getMentions(args.content);
                    if (
                      this.settings["slowModeConfirmation"] &&
                      !this.hasPermissions(args.channel) &&
                      this.settings["slowmodeTrigger"] <=
                      args?.channel?.rateLimitPerUser                     
                    )
                      return args.openWarningPopout({
                        analyticsType: config.info.name,
                        animation: undefined,
                        channel: args.channel,
                        onCancel: () => {
                          resolve({
                            valid: false,
                            failureReason: "dont_slow_me",
                          });
                        },
                        onConfirm: () => {
                          resolve({ valid: true });
                        },
                        popoutText: {
                          body: "This will put you in Slowmode. Do you want to continue?",
                          footer: `Slowmode duration: ${this.toDaysMinutesSeconds(
                            args.channel.rateLimitPerUser
                          )}!`,
                        },
                      });
                      if (
                        this.settings["uploadConfirmation"] &&
                        this.settings["uploadTrigger"] <=
                        args?.uploads?.length                    
                      )
                        return args.openWarningPopout({
                          analyticsType: config.info.name,
                          animation: undefined,
                          channel: args.channel,
                          onCancel: () => {
                            resolve({
                              valid: false,
                              failureReason: "dont_upload_now",
                            });
                          },
                          onConfirm: () => {
                            resolve({ valid: true });
                          },
                          popoutText: {
                            body: "This will upload the selected files. Do you want to continue?",
                            footer: `Amount of files: ${args.uploads.length}!`,
                          },
                        });
                        if (
                          this.settings["mentionConfirmation"] &&
                          this.settings["mentionTrigger"] <=
                          mentions?.length                    
                        )
                          return args.openWarningPopout({
                            analyticsType: config.info.name,
                            animation: undefined,
                            channel: args.channel,
                            onCancel: () => {
                              resolve({
                                valid: false,
                                failureReason: "dont_mention_now",
                              });
                            },
                            onConfirm: () => {
                              resolve({ valid: true });
                            },
                            popoutText: {
                              body: `This will mention people. Do you want to continue?`,
                              footer: `Amount of mentions: ${mentions?.length}!`,
                            },
                          });
                    resolve(await res(args));
                  })
              );
            }
            hasPermissions(channel) {
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
            toDaysMinutesSeconds(totalSeconds) {
              const seconds = Math.floor(totalSeconds % 60);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
              const days = Math.floor(totalSeconds / (3600 * 24));
              const secondsStr = this.makeHumanReadable(seconds, "second");
              const minutesStr = this.makeHumanReadable(minutes, "minute");
              const hoursStr = this.makeHumanReadable(hours, "hour");
              const daysStr = this.makeHumanReadable(days, "day");
              return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(
                /,\s*$/,
                ""
              );
            }
            makeHumanReadable(num, singular) {
              return num > 0
                ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
                : "";
            }
            getMentions(text) {
              return [...text.matchAll(/<@!?(\d+)>/g)]
                .map((m) => m[1])
            }
            onStop() {
              Patcher.unpatchAll();
            }
  
            getSettingsPanel() {
              return SettingPanel.build(
                this.saveSettings.bind(this),
                new SettingGroup("Slowmode", {
                  collapsible: true,
                  shown: false,
                }).append(
                  new Switch(
                    "Show confirmation",
                    "Whether to show a confirmation dialog for sending a message in a channel in which slowmode applies to you.",
                    this.settings["slowModeConfirmation"],
                    (e) => {
                      this.settings["slowModeConfirmation"] = e;
                    }
                  ),
                  new Slider(
                    "Slowmode trigger",
                    "The minimum duration of slowmode, in minutes, to get a confirmation prompt.",
                    30,
                    1800,
                    this.settings["slowmodeTrigger"],
                    (e) => {
                      this.settings["slowmodeTrigger"] = e;
                    },
                    {
                      onValueRender: (value) => {
                        return this.toDaysMinutesSeconds(value);
                      },
                    }
                  )
                ),
                new SettingGroup("File upload", {
                  collapsible: true,
                  shown: false,
                }).append(
                  new Switch(
                    "Show confirmation",
                    "Whether to show a confirmation dialog for uploading files.",
                    this.settings["uploadConfirmation"],
                    (e) => {
                      this.settings["uploadConfirmation"] = e;
                    }
                  ),
                  new Slider(
                    "File amount",
                    "The minimum amount of files to get a confirmation prompt.",
                    1,
                    10,
                    this.settings["uploadTrigger"],
                    (e) => {
                      this.settings["uploadTrigger"] = Math.floor(e);
                    },
                    {
                      onValueRender: (value) => {
                        return Math.floor(value);
                      },
                    }
                  )
                ),
                new SettingGroup("User mentions", {
                  collapsible: true,
                  shown: false,
                }).append(
                  new Switch(
                    "Show confirmation",
                    "Whether to show a confirmation dialog for mentioning users.",
                    this.settings["mentionConfirmation"],
                    (e) => {
                      this.settings["mentionConfirmation"] = e;
                    }
                  ),
                  new Slider(
                    "Amount of mentions",
                    "The minimum amount of user mentions to get a confirmation prompt.",
                    1,
                    10,
                    this.settings["mentionTrigger"],
                    (e) => {
                      this.settings["mentionTrigger"] = Math.floor(e);
                    },
                    {
                      onValueRender: (value) => {
                        return Math.floor(value);
                      },
                    }
                  )
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
  
