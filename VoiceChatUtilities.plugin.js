/**
 * @name VoiceChatUtilities
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Useful voice chat utilities for server administrators.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/VoiceChatUtilities.plugin.js
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
      name: "VoiceChatUtilities",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        }
      ],
      version: "1.3.0",
      description: "Useful voice chat utilities for server administrators.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/VoiceChatUtilities.plugin.js",
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
          "Fuck me, This took time but was worth it.",
          "Well Now Do it in mass (●ˇ∀ˇ●)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Bug Fixes"],
      },
      {
        title: "v1.0.2",
        items: ["Added Icons", "Refractor", "Beautify"],
      },
      {
        title: "v1.0.4",
        items: ["Added More Options"],
      },
      {
        title: "v1.0.5",
        items: ["Made it Toogleable"],
      },
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "VoiceChatUtilities.plugin.js",
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
        PluginUpdater,
        Logger,
        Utilities,
        Settings: { SettingPanel, Slider, Switch },
        DiscordModules: {
          UserStore,
          GuildChannelsStore,
          ChannelStore,
          SelectedChannelStore,
        },
      } = ZLibrary;
      const { ContextMenu } = BdApi;
      const {
        LibraryIcons,
        LibraryUtils,
        LibraryModules: {
          DiscordNative: { clipboard },
          RequestsUtils,
          SortedVoiceStateStore,
          DiscordConstants,
          ChannelPermissionStore
        } } = BunnyLib.build(config);
      const defaultSettings = {
        BulkActionsdelay: 0.25,
        voicechatcopyids: true,
        exceptSelf: false,
        fastMove: true,
      };
      return class VoiceChatUtilities extends Plugin {
        constructor() {
          super();
          this.settings = Utilities.loadData(
            config.info.name,
            "settings",
            defaultSettings
          );
          this.addVCUtils = this.addVCUtils.bind(this);
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
        onStart() {
          this.checkForUpdates();
          ContextMenu.patch("channel-context", this.addVCUtils)
        }

        addVCUtils(menu, { channel }) {
          menu.props.children = [...menu.props.children, this.moveAll(channel), this.massUtils(channel)];

        }
        moveAll(channel) {
          const currentChannel = this.getVoiceChannel();
          const ChannelMembers = currentChannel?.members;
          if (
            !currentChannel ||
            !this.settings["fastMove"] ||
            channel.type !== 2 ||
            currentChannel.channel.guild_id !== channel.guild_id ||
            ChannelMembers < 1 ||
            ChannelMembers.length == 1 ||
            currentChannel.channel.id == channel.id ||
            !ChannelPermissionStore.can(
              DiscordConstants.Plq.MOVE_MEMBERS,
              channel
            ) ||
            !ChannelPermissionStore.can(
              DiscordConstants.Plq.CONNECT,
              channel
            )
          ) return;
          return ContextMenu.buildItem({
            label: "Fast Move",
            id: "fast-move",
            action: async () => {
              for (const member of ChannelMembers) {
                RequestsUtils.patch({
                  url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                  body: {
                    channel_id: channel.id,
                  },
                });
                if (this.settings["BulkActionsdelay"] != 0)
                  await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
              }
            },
          });
        }
        massUtils(channel) {
          if (channel.type !== 2) return;
          const children = [];
          const User = UserStore.getCurrentUser();
          const currentChannel = this.getVoiceChannel();
          const ChannelMembers =
            currentChannel?.channel.id === channel.id
              ? currentChannel?.members
              : this.getVoiceChannelMembers(channel?.guild_id, channel.id);
          const voiceChannels = GuildChannelsStore.getChannels(
            channel?.guild_id
          ).VOCAL.map(({ channel }) => channel);
          if (ChannelMembers < 1 || ChannelMembers.length == 1) return;
          let exceptSelf =
            this.settings["exceptSelf"] &&
            SelectedChannelStore.getVoiceChannelId() == channel.id;
          if (this.settings["voicechatcopyids"]) {
            children.push({
              id: "copy-all-vc-members",
              label: "Copy All User IDs",
              icon: () => LibraryIcons.MassCopy("18", "18"),
              action: async () => {
                clipboard.copy(ChannelMembers.join(",\n"));
              },
            });
          }
          if (
            ChannelPermissionStore.can(
              DiscordConstants.Plq.MOVE_MEMBERS,
              channel
            )
          ) {
            children.push({
              id: "disconnect-all-vc",
              label: "Disconnect All",
              icon: () => LibraryIcons.Disconnect("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      channel_id: null,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            });
            if (exceptSelf)
              children.push({
                id: "disconnect-all-vc-except-self",
                label: "Disconnect All Except Self",
                icon: () => LibraryIcons.Disconnect("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    if (member == User.id) continue;
                    RequestsUtils.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        channel_id: null,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
            children.push({
              type: "submenu",
              id: "move-all-vc",
              label: "Move All",
              items: this.getMoveableChannels(
                channel,
                voiceChannels,
                ChannelMembers,
                false
              ),
            });
            if (exceptSelf)
              children.push({
                type: "submenu",
                id: "move-all-vc-except-self",
                label: "Move All Except Self",
                items: this.getMoveableChannels(
                  channel,
                  voiceChannels,
                  ChannelMembers,
                  User
                ),
              });
          }
          if (
            ChannelPermissionStore.can(
              DiscordConstants.Plq.MUTE_MEMBERS,
              channel
            )
          ) {
            children.push({
              id: "mute-all-vc",
              label: "Mute All",
              icon: () => LibraryIcons.Mute("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      mute: true,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            });
            if (exceptSelf)
              children.push({
                id: "mute-all-vc-except-self",
                label: "Mute All Except Self",
                icon: () => LibraryIcons.Mute("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    if (member == User.id) continue;
                    RequestsUtils.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        mute: true,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
            children.push({
              id: "unmute-all-vc",
              label: "Unmute All",
              icon: () => LibraryIcons.Unmute("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      mute: false,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            });
            if (exceptSelf)
              children.push({
                id: "unmute-all-vc-except-self",
                label: "Unmute All Except Self",
                icon: () => LibraryIcons.Unmute("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    if (member == User.id) continue;
                    RequestsUtils.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        mute: false,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
          }
          if (
            ChannelPermissionStore.can(
              DiscordConstants.Plq.DEAFEN_MEMBERS,
              channel
            )
          ) {
            children.push({
              id: "defen-all-vc",
              label: "Deafen All",
              icon: () => LibraryIcons.Deaf("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      deaf: true,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            });

            if (exceptSelf)
              children.push({
                id: "deafen-all-vc-except-self",
                label: "Deafen All Except Self",
                icon: () => LibraryIcons.Deaf("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    if (member == User.id) continue;
                    RequestsUtils.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        deaf: true,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
            children.push({
              id: "undeafen-all-vc",
              label: "Undeafen All",
              icon: () => LibraryIcons.Undeaf("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      deaf: false,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            });
            if (exceptSelf)
              children.push({
                id: "undeafen-all-vc-except-self",
                label: "Undeafen All Except Self",
                icon: () => LibraryIcons.Undeaf("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    if (member == User.id) continue;
                    RequestsUtils.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        deaf: false,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
          }
          if (!children?.length) return;
          return ContextMenu.buildItem(
            {
              type: "submenu",
              label: "Mass VC Utilities",
              id: "mass-vc-utilities",
              action: () => {
                Logger.info(`Teri Mummy Meri Hoja ${User.username}`); //what
              },
              items: children,
            },
          );
        }
        getMoveableChannels(channel, voiceChannels, ChannelMembers, User) {
          voiceChannels = voiceChannels.filter(
            (vc) =>
              vc.id !== channel.id &&
              ChannelPermissionStore.can(
                DiscordConstants.Plq.CONNECT,
                vc
              )
          );
          if (!voiceChannels.length)
            return [{
              label: "No VC Available",
              id: "no-vc",
              icon: () => LibraryIcons.NoVC("18", "18"),
              action: () => {
                Logger.info(`Teri Mummy Meri Hoja ${User.username}`); //what
              },
            }];
          return voiceChannels.map((channel) => {
            return {
              label: channel.name,
              id: channel.id,
              icon: () => LibraryIcons.VC("18", "18"),
              action: async () => {
                for (const member of ChannelMembers) {
                  if (member == User?.id) continue;
                  RequestsUtils.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      channel_id: channel.id,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await LibraryUtils.Sleep(this.settings["BulkActionsdelay"]);
                }
              },
            };
          });

        }
        getVoiceUserIds(guildId, channelId) {
          return Object.values(SortedVoiceStateStore.getVoiceStatesForChannel({ getGuildId: () => guildId, id: channelId })).map(m => m.user.id);
        }
        getVoiceChannelMembers(channel) {
          return this.getVoiceUserIds(channel?.guild_id, channel?.id);
        }
        getVoiceChannel() {
          let channel = ChannelStore.getChannel(
            SelectedChannelStore.getVoiceChannelId()
          );
          if (!channel) return;
          return {
            channel: channel,
            members: this.getVoiceChannelMembers(channel),
          };
        }
        stop() {
          ContextMenu.unpatch("channel-context", this.addVCUtils)
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Slider(
              "Bulk actions delay, in seconds",
              "Making it 0 makes all of the actions happen simultaneously. It might be cool, but can get you banned due to selfbotting. Higher value means lower risk of getting banned.",
              0,
              1,
              this.settings["BulkActionsdelay"],
              (e) => {
                this.settings["BulkActionsdelay"] = e;
              },
              {
                onValueRender: (value) => {
                  const seconds = value / 1000;
                  const minutes = value / 1000 / 60;
                  return value < 60000
                    ? `${seconds.toFixed(0)} secs`
                    : `${minutes.toFixed(0)} min`;
                },
              }
            ),
            new Switch(
              "Show option to copy all user IDs",
              "Whether or not to show the button to copy the user IDs of all participants.",
              this.settings["voicechatcopyids"],
              (e) => {
                this.settings["voicechatcopyids"] = e;
              }
            ),
            new Switch(
              "Except Self",
              "Whether or not to show an array of options that allow you to execute a task on everyone in the voice channel except yourself.",
              this.settings["exceptSelf"],
              (e) => {
                this.settings["exceptSelf"] = e;
              }
            ),
            new Switch(
              "Fast Move",
              "Whether or not to show an option to move to the selected voice channel from your current voice channel.",
              this.settings["fastMove"],
              (e) => {
                this.settings["fastMove"] = e;
              }
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
