/**
 * @name ThemesInfo
 * @author Kirai, Ahlawat
 * @authorId 872383230328832031
 * @version 1.0.5
 * @invite SgKSKyh9gY
 * @website https://tharki-god.github.io/
 * @description Adds a Slash command to send list of enabled and disabled Themes.
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ThemesInfo.plugin.js
 */
/*@cc_on
@if (@_jscript)
// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
var pathSelf = WScript.ScriptFullName;
// Put the user at ease by addressing them in the first person
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
// Show the user where to put plugins in the future
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
    const config = {
      info: {
        name: "ThemesInfo",
        authors: [
          {
            name: "Kirai",
            discord_id: "872383230328832031",
            github_username: "HiddenKirai",
          },
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.5",
        description:
          "Adds a Slash command to send list of enabled and disabled Themes.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ThemesInfo.plugin.js",
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
            "This is the initial release of the plugin.",
            "This should be built into better discord.",
          ],
        },
      ],
      main: "ThemesInfo.plugin.js",
    };
    return !global.ZeresPluginLibrary
      ? class {
          constructor() {
            this._config = config;
          }
          getName() {
            return config.info.name;
          }
          getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
          }
          getDescription() {
            return config.info.description;
          }
          getVersion() {
            return config.info.version;
          }
          load() {
            try {
              global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(
                config.info.name,
                config.info.version,
                config.info.github_raw
              );
            } catch (err) {
              console.error(
                this.getName(),
                "Plugin Updater could not be reached.",
                err
              );
            }
            BdApi.showConfirmationModal(
              "Library Missing",
              `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
              {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                  require("request").get(
                    "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                    async (error, response, body) => {
                      if (error) {
                        return BdApi.showConfirmationModal("Error Downloading", [
                          "Library plugin download failed. Manually install plugin library from the link below.",
                          BdApi.React.createElement(
                            "a",
                            {
                              href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                              target: "_blank",
                            },
                            "Plugin Link"
                          ),
                        ]);
                      }
                      await new Promise((r) =>
                        require("fs").writeFile(
                          require("path").join(
                            BdApi.Plugins.folder,
                            "0PluginLibrary.plugin.js"
                          ),
                          body,
                          r
                        )
                      );
                    }
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
            DiscordModules: { MessageActions },
          } = Library;
          const SlashCommandsStore =
            WebpackModules.getByProps("BUILT_IN_COMMANDS");
          return class ThemesInfo extends Plugin {
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
              SlashCommandsStore.BUILT_IN_COMMANDS.push({
                __registerId: config.info.name,
                applicationId: "-1",
                name: "list themes",
                displayName: "list themes",
                description: "Sends a list of all themes you have.",
                id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
                type: 1,
                target: 1,
                predicate: () => true,
                execute: ([send, listChoice], { channel }) => {
                  try {
                    const content = this.getThemes(listChoice.value);
                    send.value
                      ? MessageActions.sendMessage(
                          channel.id,
                          {
                            content,
                            tts: false,
                            invalidEmojis: [],
                            validNonShortcutEmojis: [],
                          },
                          undefined,
                          {}
                        )
                      : MessageActions.sendBotMessage(channel.id, content);
                  } catch (err) {
                    Logger.err(err);
                  }
                },
                options: [
                  {
                    description: "Weather you want to send this or not.",
                    displayDescription: "Weather you want to send this or not.",
                    displayName: "Send",
                    name: "Send",
                    required: true,
                    type: 5,
                  },
                  {
                    description:
                      "If you want to send either only enabled or disabled.",
                    displayDescription:
                      "If you want to send either only enabled or disabled.",
                    displayName: "Which List",
                    name: "Which List",
                    required: true,
                    choices: [
                      {
                        name: "Enabled",
                        displayName: "Enabled",
                        value: "enabled",
                      },
                      {
                        name: "Disabled",
                        displayName: "Disabled",
                        value: "disabled",
                      },
                      {
                        name: "Both",
                        displayName: "Both",
                        value: "default",
                      },
                    ],
                    type: 3,
                  },
                ],
              });
            }
            getThemes(list) {
              const allThemes = BdApi.Themes.getAll();
              const enabled = allThemes.filter((p) =>
                BdApi.Themes.isEnabled(p.id)
              );
              const disbaled = allThemes.filter(
                (p) => !BdApi.Themes.isEnabled(p.id)
              );
              const enabledMap = enabled.map((t) => t.name).join(", ");
              const disabledMap = disbaled.map((t) => t.name).join(", ");
              switch (list) {
                case "enabled":
                  return `**Enabled Themes(${enabled.length}):** \n ${enabledMap}`;
                  break;
                case "disabled":
                  return `**Disabled Themes(${disbaled.length}):** \n ${disabledMap}`;
                  break;
                default:
                  return `**Enabled Themes(${enabled.length}):** \n ${enabledMap} \n\n **Disabled Themes(${disbaled.length}):** \n ${disabledMap}`;
              }
            }
            onStop() {
              this.unregisterAllCommands(this.getName());
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
        })(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  