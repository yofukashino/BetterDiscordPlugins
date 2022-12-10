/**
 * @name DiscordStatus
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.5
 * @invite SgKSKyh9gY
 * @description Adds a slash command to get Discord's status from https://discordstatus.com.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordStatus.plugin.js
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
      name: "DiscordStatus",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.5",
      description:
        "Adds a slash command to get Discord's status from https://discordstatus.com.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordStatus.plugin.js",
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
          "Get those stats nerd （︶^︶）",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Reindent"],
      },
      {
        title: "v1.0.5",
        items: ["Fully working"],
      },
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "DiscordStatus.plugin.js",
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
      start() { }
      stop() { }
    }
    : (([Plugin, Library]) => {
      const {
        WebpackModules,
        PluginUpdater,
        Logger,
        Patcher,
        DiscordModules: { MessageActions },
      } = Library;
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
      const capitalize = (text) => text[0].toUpperCase() + text.slice(1);
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
          this.pplicationCommandStore.ZP.shouldResetAll = true;
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
      return class Status extends Plugin {
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
            name: "discord status",
            displayName: "discord status",
            displayDescription:
              "Returns Discord's status from https://discordstatus.com.",
            description:
              "Returns Discord's status from https://discordstatus.com.",
            target: 1,
            type: 1,
            execute: async (_, { channel }) => {
              try {
                const stats = await this.stats();
                if (!stats)
                  MessageActions.receiveMessage(
                    channel.id,
                    FakeMessage.makeMessage(
                      channel.id,
                      "Unable to get Discord's status."
                    )
                  );
                MessageActions.receiveMessage(
                  channel.id,
                  FakeMessage.makeMessage(channel.id, "", [stats])
                );
              } catch (err) {
                Logger.err(err);
                MessageActions.receiveMessage(
                  channel.id,
                  FakeMessage.makeMessage(
                    channel.id,
                    "Unable to get Discord's status."
                  )
                );
              }
            },
            options: [],
          });
        }
        async stats() {
          const response = await fetch(
            "https://discordstatus.com/api/v2/summary.json"
          );
          if (!response.ok) return;
          const { status, components, page } = await response.json();
          return {
            type: "rich",
            title: status.description,
            description:
              "[Discord Status](https://discordstatus.com/)\n" +
              "**Current Incident:**\n" +
              status.indicator,
            color: "6577E6",
            thumbnail: {
              url: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
              proxyURL:
                "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
              width: 400,
              height: 400,
            },
            fields: components.map((component) => ({
              name: component.name,
              value: capitalize(component.status),
              inline: true,
            })),
            timestamp: page.updated_at,
          };
        }
        onStop() {
          SlashCommandAPI.unregister(config.info.name);
        }
      };
      return plugin(Plugin, Library);
    })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
