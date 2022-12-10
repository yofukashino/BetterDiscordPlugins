/**
 * @name BunnyGirls
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.5
 * @invite SgKSKyh9gY
 * @description Adds a slash command to send a random bunny girl GIF.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BunnyGirls.plugin.js
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
      name: "BunnyGirls",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.5",
      description: "Adds a slash command to send a random bunny girl GIF.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BunnyGirls.plugin.js",
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
          "I know why you want bunny girls (⊙x⊙;)",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Code Defractor", "More Random"],
      },
      {
        title: "v1.0.3",
        items: ["Fixed Erros"],
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
    main: "BunnyGirls.plugin.js",
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
      const randomNo = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
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
      return class BunnyGirls extends Plugin {
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
            name: "bunny girls",
            displayName: "bunny girls",
            displayDescription: "Send a random bunny girl GIF.",
            description: "Send a random bunny girl GIF.",
            type: 1,
            target: 1,
            execute: async ([send], { channel }) => {
              try {
                const GIF = await this.getGif(send.value);
                if (!GIF)
                  return MessageActions.receiveMessage(
                    channel.id,
                    FakeMessage.makeMessage(
                      channel.id,
                      "Failed to get any bunny girl GIF."
                    )
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
                  : MessageActions.receiveMessage(
                    channel.id,
                    FakeMessage.makeMessage(channel.id, "", [GIF])
                  );
              } catch (err) {
                Logger.err(err);
                MessageActions.receiveMessage(
                  channel.id,
                  FakeMessage.makeMessage(
                    channel.id,
                    "Failed to get any bunny girl GIF."
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
        }
        async getGif(send) {
          const response = await fetch(
            "https://g.tenor.com/v1/random?q=bunny-girls&key=ZVWM77CCK1QF&limit=50"
          );
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
          SlashCommandAPI.unregister(config.info.name);
        }
      };
      return plugin(Plugin, Library);
    })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
