/**
 * @name VoiceChatUtilities
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.0
 * @invite SgKSKyh9gY
 * @description General use voicechat utilities.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VoiceChatUtilities.plugin.js
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
        name: "VoiceChatUtilities",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
          ,
          {
            name: "Kirai",
            discord_id: "872383230328832031",
            github_username: "HiddenKirai",
          },
        ],
        version: "1.1.0",
        description: "General use voicechat utilities",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VoiceChatUtilities.plugin.js",
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
      ],
      main: "VoiceChatUtilities.plugin.js",
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
                            "ZeresPluginLibrary"
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
            Patcher,
            PluginUpdater,
            Logger,
            Utilities,
            ContextMenu,
            Settings: { SettingPanel, Slider, Switch },
            DiscordModules: {
              DiscordConstants,
              React,
              UserStore,
              GuildChannelsStore,
              ChannelStore,
            },
          } = Library;
          const { clipboard } = require("electron");
          const { patch } = WebpackModules.find(
            (m) => typeof m == "object" && m.patch
          );
          const ChannelPermissionStore = WebpackModules.getByProps(
            "getChannelPermissions"
          );
          const { getVoiceStatesForChannel } = WebpackModules.getByProps(
            "getVoiceStatesForChannel"
          );
          const { getVoiceChannelId } =
            WebpackModules.getByProps("getVoiceChannelId");
          const { Endpoints } = WebpackModules.getByProps("Endpoints");
          const MassCopyIcon = (width, height) =>
            React.createElement(WebpackModules.getByDisplayName("OverflowMenu"), {
              width,
              height,
            });
          const DisconnectIcon = (width, height) =>
            React.createElement(WebpackModules.getByDisplayName("CallLeave"), {
              width,
              height,
            });
          const MuteIcon = (width, height) =>
            React.createElement(
              WebpackModules.getByDisplayName("MicrophoneMute"),
              {
                width,
                height,
              }
            );
          const UnmuteIcon = (width, height) =>
            React.createElement(WebpackModules.getByDisplayName("Microphone"), {
              width,
              height,
            });
          const DeafIcon = (width, height) =>
            React.createElement(
              WebpackModules.getByDisplayName("HeadsetDeafen"),
              {
                width,
                height,
              }
            );
          const UndeafIcon = (width, height) =>
            React.createElement(WebpackModules.getByDisplayName("Headset"), {
              width,
              height,
            });
          const VCIcon = (width, height) =>
            React.createElement(WebpackModules.getByDisplayName("Speaker"), {
              width,
              height,
            });
          const Sleep = (time) => new Promise((f) => setTimeout(f, time));
          return class VoiceChatUtilities extends Plugin {
            constructor() {
              super();
              this.BulkActionsdelay = Utilities.loadData(
                config.info.name,
                "BulkActionsdelay",
                0.25
              );
              this.voicechatcopyids = Utilities.loadData(
                config.info.name,
                "voicechatcopyids",
                true
              );
              this.exceptSelf = Utilities.loadData(
                config.info.name,
                "exceptSelf",
                false
              );
              this.fastMove = Utilities.loadData(
                config.info.name,
                "fastMove",
                true
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
            onStart() {
              this.checkForUpdates();
              this.patchContextMenu();
            }
            stop() {
              Patcher.unpatchAll();
            }
            async patchContextMenu() {
              const useChannelDeleteItem = await ContextMenu.getDiscordMenu(
                "useChannelDeleteItem"
              );
              Patcher.after(
                useChannelDeleteItem,
                "default",
                (_, [channel], res) => {
                  let massVCUtils = this.massUtils(channel);
                  let moveAll = this.fastMove ? this.moveAll(channel) : null;
                  return [moveAll, massVCUtils, res];
                }
              );
            }
            moveAll(channel) {
              if (channel.type !== 2) return;
              let currentChannel = this.getVoiceChannel();
              if (!currentChannel) return;
              if (currentChannel.channel.guild_id !== channel.guild_id) return;
              let ChannelMembers = this.getVoiceChannelMembers(
                currentChannel.channel.id
              );
              if (
                ChannelMembers < 1 ||
                ChannelMembers.length == 1 ||
                currentChannel.channel.id == channel.id
              )
                return;
              if (
                ChannelPermissionStore.can(
                  DiscordConstants.Permissions.MOVE_MEMBERS,
                  channel
                ) &&
                ChannelPermissionStore.can(
                  DiscordConstants.Permissions.CONNECT,
                  channel
                )
              )
                return ContextMenu.buildMenuItem({
                  label: "Move All to Selected VC",
                  subtext: "From your current VC",
                  id: "move-all-to-selected",
                  action: async () => {
                    for (const member of currentChannel.members) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          channel_id: channel.id,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
            }
            massUtils(channel) {
              if (channel.type !== 2) return;
              const children = [];
              const User = UserStore.getCurrentUser();
              const ChannelMembers = this.getVoiceChannelMembers(channel.id);
              const guildChannels = GuildChannelsStore.getChannels(
                channel.guild_id
              );
              const voiceChannels = guildChannels.VOCAL.map(
                ({ channel }) => channel
              );
              if (ChannelMembers < 1 || ChannelMembers.length == 1) return;
              const currentChannel = this.getVoiceChannel();
              let exceptSelf =
                this.exceptSelf &&
                getVoiceChannelId() == channel.id &&
                currentChannel.members.length > 1 &&
                currentChannel;
              if (this.voicechatcopyids) {
                children.push({
                  id: "copy-all-vc-members",
                  label: "Copy All User Ids",
                  icon: () => MassCopyIcon("18", "18"),
                  action: async () => {
                    clipboard.writeText(ChannelMembers.join(",\n"));
                  },
                });
              }
              if (
                ChannelPermissionStore.can(
                  DiscordConstants.Permissions.MOVE_MEMBERS,
                  channel
                )
              ) {
                children.push({
                  id: "disconnect-all-vc",
                  label: "Disconnect All",
                  icon: () => DisconnectIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          channel_id: null,
                        },
                      });
  
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
                if (exceptSelf)
                  children.push({
                    id: "disconnect-all-vc-except-self",
                    label: "Disconnect all except self",
                    icon: () => DisconnectIcon("18", "18"),
                    action: async () => {
                      for (const member of ChannelMembers) {
                        if (member == user.id) continue;
                        patch({
                          url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                          body: {
                            channel_id: null,
                          },
                        });
                        if (this.BulkActionsdelay != 0)
                          await Sleep(this.BulkActionsdelay);
                      }
                    },
                  });
                children.push({
                  id: "move-all-vc",
                  label: "Move All",
                  children: this.getMoveableChannels(
                    voiceChannels,
                    ChannelMembers,
                    false
                  ),
                });
                if (exceptSelf)
                  children.push({
                    id: "move-all-vc-except-self",
                    label: "Move All Except Self",
                    children: this.getMoveableChannels(
                      voiceChannels,
                      ChannelMembers,
                      User
                    ),
                  });
              }
              if (
                ChannelPermissionStore.can(
                  DiscordConstants.Permissions.MUTE_MEMBERS,
                  channel
                )
              ) {
                children.push({
                  id: "mute-all-vc",
                  label: "Mute All",
                  icon: () => MuteIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          mute: true,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
                if (exceptSelf)
                  children.push({
                    id: "mute-all-vc-except-self",
                    label: "Mute all except self",
                    icon: () => MuteIcon("18", "18"),
                    action: async () => {
                      for (const member of ChannelMembers) {
                        if (member == user.id) continue;
                        patch({
                          url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                          body: {
                            mute: true,
                          },
                        });
                        if (this.BulkActionsdelay != 0)
                          await Sleep(this.BulkActionsdelay);
                      }
                    },
                  });
                children.push({
                  id: "unmute-all-vc",
                  label: "Unmute All",
                  icon: () => UnmuteIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          mute: false,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
                if (exceptSelf)
                  children.push({
                    id: "unmute-all-vc-except-self",
                    label: "Unmute all except self",
                    icon: () => UnmuteIcon("18", "18"),
                    action: async () => {
                      for (const member of ChannelMembers) {
                        if (member == user.id) continue;
                        patch({
                          url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                          body: {
                            mute: false,
                          },
                        });
                        if (this.BulkActionsdelay != 0)
                          await Sleep(this.BulkActionsdelay);
                      }
                    },
                  });
              }
              if (
                ChannelPermissionStore.can(
                  DiscordConstants.Permissions.DEAFEN_MEMBERS,
                  channel
                )
              ) {
                children.push({
                  id: "defen-all-vc",
                  label: "Deafen All",
                  icon: () => DeafIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          deaf: true,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
  
                if (exceptSelf)
                  children.push({
                    id: "deafen-all-vc-except-self",
                    label: "Defen all except self",
                    icon: () => DeafIcon("18", "18"),
                    action: async () => {
                      for (const member of ChannelMembers) {
                        if (member == user.id) continue;
                        patch({
                          url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                          body: {
                            deaf: true,
                          },
                        });
                        if (this.BulkActionsdelay != 0)
                          await Sleep(this.BulkActionsdelay);
                      }
                    },
                  });
                children.push({
                  id: "undeafen-all-vc",
                  label: "Undeafen All",
                  icon: () => UndeafIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          deaf: false,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
                if (exceptSelf)
                  children.push({
                    id: "undeafen-all-vc-except-self",
                    label: "Undeafen all except self",
                    icon: () => UndeafIcon("18", "18"),
                    action: async () => {
                      for (const member of ChannelMembers) {
                        if (member == user.id) continue;
                        patch({
                          url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                          body: {
                            deaf: false,
                          },
                        });
                        if (this.BulkActionsdelay != 0)
                          await Sleep(this.BulkActionsdelay);
                      }
                    },
                  });
              }
              if (!children?.length) return;
              return ContextMenu.buildMenuChildren([
                {
                  label: "Mass VC Utilities",
                  id: "mass-vc-utilities",
                  action: () => {
                    console.log(`Teri Mummy Meri Hoja ${user.username}`);
                  },
                  children: ContextMenu.buildMenuChildren(children),
                },
              ]);
            }
            getMoveableChannels(voiceChannels, ChannelMembers, user) {
              let Moveable = [];
              for (const channel of voiceChannels) {
                if (
                  !ChannelPermissionStore.can(
                    DiscordConstants.Permissions.CONNECT,
                    channel
                  )
                )
                  continue;
                Moveable.push({
                  label: channel.name,
                  id: channel.id,
                  icon: () => VCIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == user?.id) continue;
                      patch({
                        url: Endpoints.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          channel_id: channel.id,
                        },
                      });
                      if (this.BulkActionsdelay != 0)
                        await Sleep(this.BulkActionsdelay);
                    }
                  },
                });
              }
              return ContextMenu.buildMenuChildren(Moveable);
            }
            getVoiceUserIds(channel) {
              return Object.values(getVoiceStatesForChannel(channel)).map(
                (a) => a.userId
              );
            }
            getVoiceChannelMembers(id) {
              let channel = ChannelStore.getChannel(id);
              return this.getVoiceUserIds(channel?.id);
            }
            getVoiceChannel() {
              let channel = ChannelStore.getChannel(getVoiceChannelId());
              if (!channel) return;
              return {
                channel: channel,
                members: this.getVoiceChannelMembers(channel.id),
              };
            }
            getSettingsPanel() {
              return SettingPanel.build(
                this.saveSettings.bind(this),
                new Slider(
                  "Bulk Actions delay (seconds)",
                  "making it 0 makes all of the actions happen simultaneously (its cool af maybe)",
                  0,
                  1,
                  this.BulkActionsdelay / 1000,
                  (e) => {
                    this.BulkActionsdelay = e * 1000;
                  },
                  {
                    markers: [0, 0.1, 0.25, 0.5, 1],
                    stickToMarkers: true,
                  }
                ),
                new Switch(
                  "Show all user ids",
                  "Whether or not to show the button to copy the ids of all of the members of a voicechannel",
                  this.voicechatcopyids,
                  (e) => {
                    this.voicechatcopyids = e;
                  }
                ),
                new Switch(
                  "Except Self",
                  "Whether or not to show An Array of options to apply to everyone except self",
                  this.exceptSelf,
                  (e) => {
                    this.exceptSelf = e;
                  }
                ),
                new Switch(
                  "Fast Move",
                  "Whether or not to show An option to move to selected VC from your current VC",
                  this.fastMove,
                  (e) => {
                    this.fastMove = e;
                  }
                )
              );
            }
            saveSettings() {
              Utilities.saveData(
                config.info.name,
                "BulkActionsdelay",
                this.BulkActionsdelayBulkActionsdelay
              );
              Utilities.saveData(
                config.info.name,
                "voicechatcopyids",
                this.voicechatcopyids
              );
              Utilities.saveData(config.info.name, "exceptSelf", this.exceptSelf);
              Utilities.saveData(config.info.name, "fastMove", this.fastMove);
            }
          };
          return plugin(Plugin, Library);
        })(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  