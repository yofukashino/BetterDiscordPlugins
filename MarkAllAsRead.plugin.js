/**
 * @name MarkAllAsRead
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Get an option to mark everything as read by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/MarkAllAsRead.plugin.js
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
      name: "MarkAllAsRead",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.0",
      description:
        "Get an option to mark everything as read by right clicking on the home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/MarkAllAsRead.plugin.js",
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
          "Who sliding into your DMs ~~~///(^v^)\\\\~~~",
        ],
      },
      {
        title: "v1.0.5",
        items: ["Remove option from context menu if no ping"],
      },
      {
        title: "v1.0.7",
        items: ["Blacklist server/dm from being read in settings"],
      },
      {
        title: "v1.1.6",
        items: ["Corrected text."],
      },
    ],
    main: "MarkAllAsRead.plugin.js",
  };
  const RequiredLibs = [{
    window: "ZeresPluginLibrary",
    filename: "0PluginLibrary.plugin.js",
    external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
  },
  {
    window: "BunnyLib",
    filename: "1BunnyLib.plugin.js",
    external: "https://github.com/Tharki-God/BetterDiscordPlugins",
    downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
  },
  ];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(lib => !window.hasOwnProperty(lib.window)))
        BdApi.showConfirmationModal(
          "Library Missing",
          `The library plugin (${Lib.window}) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => this.downloadLib(Lib),
          }
        );
    }
    async downloadLib(Lib) {
      const fs = require("fs");
      const path = require("path");
      const { Plugins } = BdApi;
      const LibFetch = await fetch(
        Lib.downloadUrl
      );
      if (!LibFetch.ok) return this.errorDownloadLib(Lib);
      const LibContent = await LibFetch.text();
      try {
        await fs.writeFile(
          path.join(Plugins.folder, Lib.filename),
          LibContent,
          (err) => {
            if (err) return this.errorDownloadLib(Lib);
          }
        );
      } catch (err) {
        return this.errorDownloadLib(Lib);
      }
    }
    errorDownloadZLib(Lib) {
      const { shell } = require("electron");
      BdApi.showConfirmationModal(
        "Error Downloading",
        [
          `${Lib.window} download failed. Manually install plugin library from the link below.`,
        ],
        {
          confirmText: "Download",
          cancelText: "Cancel",
          onConfirm: () => {
            shell.openExternal(
              Lib.external
            );
          },
        }
      );
    }
    start() { }
    stop() { }
  }
  return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
      const {
        Patcher,
        ContextMenu,
        Utilities,
        PluginUpdater,
        Logger,
        Toasts,
        Settings: { SettingPanel, SettingGroup, Switch },
        DiscordModules: {
          ChannelStore,
          UserStore,
          GuildStore,
          GuildChannelsStore,
          Dispatcher,
        },
      } = ZLibrary;
      const {
        HBCM,
        LibraryIcons,
        Settings: { IconSwitch },
        LibraryModules: { MentionUtils, IconUtils, AckUtils, MessageStore }
      } = BunnyLib.build(config);
      const defaultSettings = {
        blacklistedServers: {},
        blacklistedDMs: {},
        showToast: true,
      };
      return class MarkAllRead extends Plugin {
        constructor() {
          super();
          this.settings = Utilities.loadData(
            config.info.name,
            "settings",
            defaultSettings
          );
          this.initMenu = this.initMenu.bind(this);
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
          this.initiate();
        }
        initiate() {
          this.initMenu();
          Dispatcher.subscribe("MESSAGE_ACK", this.initMenu);
          Patcher.after(MentionUtils, "Hl", (_, [args], res) => {
            const { type } = ChannelStore.getChannel(
              args.rawMessage.channel_id
            );
            if (res || type == 1) this.initMenu();
          });
        }
        initMenu() {
          if (this.timer) return;
          let Menu = this.makeMenu();
          if (
            !Menu &&
            Array.from(HBCM.items.keys()).some(
              (m) => m == config.info.name
            )
          )
            HBCM.remove(config.info.name);
          else if (Menu) HBCM.insert(config.info.name, Menu);
          this.timer = setTimeout(() => (this.timer = false), 3000);
        }
        getPingedDMs() {
          return ChannelStore.getSortedPrivateChannels()
            .map((c) => c.id)
            .filter(
              (id) =>
                (id &&
                  !this.settings["blacklistedDMs"][id] &&
                  MessageStore.getMentionCount(id) > 0) ||
                MessageStore.getUnreadCount(id) > 0
            );
        }
        getPingedGuilds() {
          const PingedChannels = [];
          const guildIds = Object.keys(GuildStore.getGuilds());
          for (const id of guildIds) {
            if (this.settings["blacklistedServers"][id]) continue;
            PingedChannels.push(
              ...GuildChannelsStore.getChannels(id)
                .SELECTABLE.map((c) => c.channel.id)
                .filter((id) => MessageStore.getMentionCount(id) > 0)
            );
          }
          return PingedChannels.filter((n) => n.length > 0);
        }
        makeMenu() {
          const PingedDMs = this.getPingedDMs();
          const PingedGuilds = this.getPingedGuilds();
          const AllMentions = PingedGuilds.concat(PingedDMs).filter(
            (n) => n.length > 0
          );
          if (!AllMentions.length) return;
          const children = this.buildChildrenReaders(PingedDMs, PingedGuilds);
          return {
            label: "Mark All as Read",
            id: "mark-all-read",
            icon: () => (children ? null : LibraryIcons.Message("20", "20")),
            action: () => this.markRead(AllMentions),
            children,
          };
        }
        buildChildrenReaders(PingedDMs, PingedGuilds) {
          if (!PingedDMs.length || !PingedGuilds.length) return;
          return ContextMenu.buildMenuChildren([
            {
              label: "Mark All Guilds as Read",
              id: "mark-all-guild-read",
              icon: () => LibraryIcons.Guilds("20", "20"),
              action: () => this.markRead(PingedGuilds, "Guild"),
            },
            {
              label: "Mark All DMs as Read",
              id: "mark-all-dm-read",
              icon: () => LibraryIcons.DMs("20", "20"),
              action: () => this.markRead(PingedDMs, "DM"),
            },
          ]);
        }
        async markRead(Mentions, Mode) {
          Mentions = Mentions.map((Unread) => ({
            channelId: Unread,
            messageId: MessageStore.lastMessageId(Unread),
          }));
          await AckUtils.y5(Mentions);
          await this.initMenu();
          if (this.settings["showToast"])
            switch (Mode) {
              case "DM":
                Toasts.show(`Marked All DMs as Read`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_people_community_24_filled.png",
                  timeout: 5000,
                  type: "info",
                });

                break;
              case "Guild":
                Toasts.show(`Marked All Guilds as Read`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_server_24_filled.png",
                  timeout: 5000,
                  type: "info",
                });
                break;
              default:
                Toasts.show(`Marked Everything as Read`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_mail_read_24_filled.png",
                  timeout: 5000,
                  type: "info",
                });
            }
        }
        onStop() {
          HBCM.remove(config.info.name);
          Patcher.unpatchAll();
          Dispatcher.unsubscribe("MESSAGE_ACK", this.initMenu);
        }
        getSettingsPanel() {
          const Guilds = Object.values(GuildStore.getGuilds());
          const DMs = ChannelStore.getSortedPrivateChannels();
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Get a toast confirmation when messages get marked as read.",
              this.settings["showToast"],
              (e) => {
                this.settings["showToast"] = e;
              }
            ),
            new SettingGroup("Server Blacklist", {
              collapsible: true,
              shown: false,
            }).append(
              ...Guilds.map((guild) => {
                return new IconSwitch(
                  guild.name,
                  guild.description,
                  this.settings["blacklistedServers"][guild.id] ?? false,
                  (e) => {
                    this.settings["blacklistedServers"][guild.id] = e;
                  },
                  {
                    icon:
                      IconUtils.getGuildIconURL(guild) ??
                      IconUtils.getDefaultAvatarURL(LibraryUtils.randomNo(0, 5)),
                  }
                );
              })
            ),
            new SettingGroup("DM Blacklist", {
              collapsible: true,
              shown: false,
            }).append(
              ...DMs.map((DM) => {
                const User = UserStore.getUser(DM.recipients[0]);
                return new IconSwitch(
                  User.tag,
                  User.pronouns,
                  this.settings["blacklistedDMs"][DM.id] ?? false,
                  (e) => {
                    this.settings["blacklistedDMs"][DM.id] = e;
                  },
                  {
                    icon:
                      IconUtils.getUserAvatarURL(User) ??
                      IconUtils.getDefaultAvatarURL(LibraryUtils.randomNo(0, 5)),
                  }
                );
              })
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
          this.initMenu();
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
