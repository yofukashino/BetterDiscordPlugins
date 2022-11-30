/**
 * @name ThemeLister
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.3
 * @invite SgKSKyh9gY
 * @website https://tharki-god.github.io/
 * @description Adds a slash command to send a list of enabled and disabled themes.
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ThemesInfo.plugin.js
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
      name: "ThemeLister",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.3",
      description:
        "Adds a slash command to send a list of enabled and disabled themes.",
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
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "ThemeLister.plugin.js",
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
        const { Themes } = BdApi;
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
        const SlashCommandAPI = (window.SlashCommandAPI ||= (() => {
          const ApplicationCommandStore = WebpackModules.getModule((m) =>
            m?.A3?.toString().includes(".Tm")
          );
          const IconUtils = WebpackModules.getByProps("getApplicationIconURL");
          const UserStore = WebpackModules.getByProps(
            "getCurrentUser",
            "getUser"
          );
          const CurrentUser = UserStore.getCurrentUser();
          const CurrentUserSection = {
            id: CurrentUser.id,
            name: CurrentUser.username,
            type: 1,
            icon: CurrentUser.avatar,
          };
          const commands = new Map();
          const register = (name, command) => {
            (command.applicationId = CurrentUser.id),
              (command.id = `${CurrentUser.username}_${
                commands.size + 1
              }`.toLowerCase());
            commands.set(name, command);
            ApplicationCommandStore.ZP.shouldResetAll = true;
          };
          const unregister = (name) => {
            commands.delete(name);
            ApplicationCommandStore.ZP.shouldResetAll = true;
          };
          Patcher.after(ApplicationCommandStore, "A3", (_, args, res) => {
            if (!res || !commands.size) return;
            if (
              !Array.isArray(res.sectionDescriptors) ||
              !res.sectionDescriptors.some(
                (section) => section.id == CurrentUserSection.id
              )
            )
              res.sectionDescriptors = Array.isArray(res.sectionDescriptors)
                ? res.sectionDescriptors.splice(1, 0, CurrentUserSection)
                : [CurrentUserSection];
            if (
              !Array.isArray(res.commands) ||
              Array.from(commands.values()).some(
                (command) => !res.commands.includes(command)
              )
            )
              res.commands = Array.isArray(res.commands)
                ? [
                    ...res.commands.filter(
                      (command) =>
                        !Array.from(commands.values()).includes(command)
                    ),
                    ...Array.from(commands.values()),
                  ]
                : Array.from(commands.values());
          });
          Patcher.after(
            ApplicationCommandStore.ZP,
            "getChannelState",
            (_, args, res) => {
              if (!res || !commands.size) return;
              if (
                !Array.isArray(res.applicationSections) ||
                !res.applicationSections.some(
                  (section) => section.id == CurrentUserSection.id
                )
              )
                res.applicationSections = Array.isArray(res.applicationSections)
                  ? [CurrentUserSection, ...res.applicationSections]
                  : [CurrentUserSection];
              if (
                !Array.isArray(res.applicationCommands) ||
                Array.from(commands.values()).some(
                  (command) => !res.applicationCommands.includes(command)
                )
              )
                res.applicationCommands = Array.isArray(res.applicationCommands)
                  ? [
                      ...res.applicationCommands.filter(
                        (command) =>
                          !Array.from(commands.values()).includes(command)
                      ),
                      ...Array.from(commands.values()),
                    ]
                  : Array.from(commands.values());
            }
          );
          Patcher.instead(
            IconUtils,
            "getApplicationIconURL",
            (_, args, res) => {
              if (args[0].id == CurrentUser.id)
                return IconUtils.getUserAvatarURL(CurrentUser);
              return res(...args);
            }
          );
          return {
            commands,
            register,
            unregister,
          };
        })());
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
            SlashCommandAPI.register(config.info.name, {
              name: "list themes",
              displayName: "list themes",
              displayDescription: "Sends a list of all themes you have.",
              description: "Sends a list of all themes you have.",
              type: 1,
              target: 1,
              execute: ([send, versions, listChoice], { channel }) => {
                try {
                  const content = this.getThemes(
                    versions.value,
                    listChoice.value
                  );
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
                    : MessageActions.receiveMessage(
                        channel.id,
                        FakeMessage.makeMessage(channel.id, content)
                      );
                } catch (err) {
                  Logger.err(err);
                  MessageActions.receiveMessage(
                    channel.id,
                    FakeMessage.makeMessage(
                      channel.id,
                      "Unable to list your themes."
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
                {
                  description: "Whether you want to add version info.",
                  displayDescription: "Whether you want to add version info.",
                  displayName: "Versions",
                  name: "Versions",
                  required: true,
                  type: 5,
                },
                {
                  description:
                    "Whether you want to send either only enabled, disabled or all themes.",
                  displayDescription:
                    "Whether you want to send either only enabled, disabled or all themes.",
                  displayName: "List",
                  name: "List",
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
          getThemes(version, list) {
            const allThemes = Themes.getAll();
            const enabled = allThemes.filter((t) => Themes.isEnabled(t.id));
            const disabled = allThemes.filter((t) => !Themes.isEnabled(t.id));
            const enabledMap = enabled
              .map((t) => (version ? `${t.name} (${t.version})` : t.name))
              .join(", ");
            const disabledMap = disabled
              .map((t) => (version ? `${t.name} (${t.version})` : t.name))
              .join(", ");
            switch (list) {
              case "enabled":
                return `**Enabled Themes(${enabled.length}):** \n ${enabledMap}`;
                break;
              case "disabled":
                return `**Disabled Themes(${disabled.length}):** \n ${disabledMap}`;
                break;
              default:
                return `**Enabled Themes(${enabled.length}):** \n ${enabledMap} \n\n **Disabled Themes(${disabled.length}):** \n ${disabledMap}`;
            }
          }
          onStop() {
            SlashCommandAPI.unregister(config.info.name);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
