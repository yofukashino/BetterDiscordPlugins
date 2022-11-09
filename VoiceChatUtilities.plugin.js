/**
 * @name VoiceChatUtilities
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.2.1
 * @invite SgKSKyh9gY
 * @description Useful voice chat utilities for server administrators.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VoiceChatUtilities.plugin.js
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
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
        {
          name: "Kirai",
          discord_id: "872383230328832031",
          github_username: "HiddenKirai",
        },
      ],
      version: "1.2.1",
      description: "Useful voice chat utilities for server administrators.",
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
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "VoiceChatUtilities.plugin.js",
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
          Patcher,
          PluginUpdater,
          Logger,
          Utilities,
          Settings: { SettingPanel, Slider, Switch },
          DiscordModules: {            
            React,
            UserStore,
            GuildChannelsStore,
            ChannelStore,
            SelectedChannelStore,            
          },
        } = Library;
        const { clipboard } = WebpackModules.getByProps("clipboard");
        const { ContextMenu } = BdApi;
        const Requests = WebpackModules.getModule(
          (m) => typeof m == "object" && m.patch
        );
        const VoiceState = WebpackModules.getByProps(
          "getVoiceStatesForChannel"
        );
        const DiscordConstants = WebpackModules.getModule(
          (m) => m?.Plq?.ADMINISTRATOR == 8n
        );
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const MassCopyIcon = (width, height) =>
        React.createElement(
          "svg",
          {
            viewBox: "0 0 24 24",
            width,
            height,
          },
          React.createElement("path", {
            style: {
              fill: "currentColor",
            },
            d: "M16 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm8-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm8-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM8 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
          })
        );
        const DisconnectIcon = (width, height) =>
        React.createElement(
          "svg",
          {
            viewBox: "0 0 24 24",
            width,
            height,
          },
          React.createElement("path", {
            style: {
              fill: "currentColor",
            },
            d: "M21.1169 1.11603L22.8839 2.88403L19.7679 6.00003L22.8839 9.11603L21.1169 10.884L17.9999 7.76803L14.8839 10.884L13.1169 9.11603L16.2329 6.00003L13.1169 2.88403L14.8839 1.11603L17.9999 4.23203L21.1169 1.11603ZM18 22H13C6.925 22 2 17.075 2 11V6C2 5.447 2.448 5 3 5H7C7.553 5 8 5.447 8 6V10C8 10.553 7.553 11 7 11H6C6.063 14.938 9 18 13 18V17C13 16.447 13.447 16 14 16H18C18.553 16 19 16.447 19 17V21C19 21.553 18.553 22 18 22Z",
          })
        );
        const MuteIcon = (width, height) =>
        React.createElement("svg", {
          width,
          height,
          viewBox: "0 0 24 24"
        },React.createElement("path", {
          d: "M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z",
          fill: "currentColor"
        }));
        const UnmuteIcon = (width, height) =>
        React.createElement("svg", {
          width,
          height,
          viewBox: "0 0 24 24"
        },React.createElement("path", {
          d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z",
          fill: "currentColor"
        }));;
        const DeafIcon = (width, height) =>
        React.createElement("svg", {
          width,
          height,
          viewBox: "0 0 24 24"
        },React.createElement("path", {
          d: "M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z",
          fill: "currentColor"
        }),React.createElement("path", {
          d: "M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z",
          fill: "currentColor"
        }));
        const UndeafIcon = (width, height) =>
        React.createElement(
          "svg",
          {
            viewBox: "0 0 24 24",
            width,
            height,
          },
          React.createElement("path", {
            style: {
              fill: "currentColor",
            },
            d: "M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z",
          })
        );
        const VCIcon = (width, height) =>
        React.createElement(
          "svg",
          {
            viewBox: "0 0 24 24",
            width,
            height,
          },
          React.createElement("path", {
            style: {
              fill: "currentColor",
            },
            d: "M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z",
          })
        );
        const NoVCIcon = (width, height) =>
        React.createElement("svg", {
          width,
          height,
          viewBox: "0 0 24 24",
        },React.createElement("path", {
          fill: "currentColor",
          d: "M15 12C15 12.0007 15 12.0013 15 12.002C15 12.553 14.551 13.002 14 13.002V15.002C15.654 15.002 17 13.657 17 12.002C17 12.0013 17 12.0007 17 12H15ZM19 12C19 12.0007 19 12.0013 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 12.0013 21 12.0007 21 12H19ZM10.293 3.29604C10.579 3.01004 11.009 2.92504 11.383 3.07904C11.757 3.23204 12 3.59904 12 4.00204V20.002C12 20.407 11.757 20.772 11.383 20.927C11.009 21.082 10.579 20.996 10.293 20.71L6 16.002H3C2.45 16.002 2 15.552 2 15.002V9.00204C2 8.45304 2.45 8.00204 3 8.00204H6L10.293 3.29604Z"
        }),React.createElement("path", {
          fill: "currentColor",
          d: "M21.025 5V4C21.025 2.88 20.05 2 19 2C17.95 2 17 2.88 17 4V5C16.4477 5 16 5.44772 16 6V9C16 9.55228 16.4477 10 17 10H19H21C21.5523 10 22 9.55228 22 9V5.975C22 5.43652 21.5635 5 21.025 5ZM20 5H18V4C18 3.42857 18.4667 3 19 3C19.5333 3 20 3.42857 20 4V5Z"
        }));
        const defaultSettings = {
          BulkActionsdelay: 0.25,
          voicechatcopyids: true,
          exceptSelf: false,
          fastMove: true,
        };
        const Sleep = (time) => new Promise((f) => setTimeout(f, time));
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

          addVCUtils(menu, {channel}) { 
            menu.props.children =  [...menu.props.children ,this.moveAll(channel), this.massUtils(channel)];
            
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
                  Requests.patch({
                    url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                    body: {
                      channel_id: channel.id,
                    },
                  });
                  if (this.settings["BulkActionsdelay"] != 0)
                    await Sleep(this.settings["BulkActionsdelay"]);
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
                icon: () => MassCopyIcon("18", "18"),
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
                icon: () => DisconnectIcon("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    Requests.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        channel_id: null,
                      },
                    });

                    if (this.settings["BulkActionsdelay"] != 0)
                      await Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
              if (exceptSelf)
                children.push({
                  id: "disconnect-all-vc-except-self",
                  label: "Disconnect All Except Self",
                  icon: () => DisconnectIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          channel_id: null,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
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
                icon: () => MuteIcon("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    Requests.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        mute: true,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
              if (exceptSelf)
                children.push({
                  id: "mute-all-vc-except-self",
                  label: "Mute All Except Self",
                  icon: () => MuteIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          mute: true,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
                    }
                  },
                });
              children.push({
                id: "unmute-all-vc",
                label: "Unmute All",
                icon: () => UnmuteIcon("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    Requests.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        mute: false,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
              if (exceptSelf)
                children.push({
                  id: "unmute-all-vc-except-self",
                  label: "Unmute All Except Self",
                  icon: () => UnmuteIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          mute: false,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
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
                icon: () => DeafIcon("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    Requests.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        deaf: true,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });

              if (exceptSelf)
                children.push({
                  id: "deafen-all-vc-except-self",
                  label: "Deafen All Except Self",
                  icon: () => DeafIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          deaf: true,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
                    }
                  },
                });
              children.push({
                id: "undeafen-all-vc",
                label: "Undeafen All",
                icon: () => UndeafIcon("18", "18"),
                action: async () => {
                  for (const member of ChannelMembers) {
                    Requests.patch({
                      url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                      body: {
                        deaf: false,
                      },
                    });
                    if (this.settings["BulkActionsdelay"] != 0)
                      await Sleep(this.settings["BulkActionsdelay"]);
                  }
                },
              });
              if (exceptSelf)
                children.push({
                  id: "undeafen-all-vc-except-self",
                  label: "Undeafen All Except Self",
                  icon: () => UndeafIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          deaf: false,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
                    }
                  },
                });
            }
            if (!children?.length) return;
            return ContextMenu.buildItem(
              { type: "submenu",
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
                  icon: () => NoVCIcon("18", "18"),
                  action: () => {
                    Logger.info(`Teri Mummy Meri Hoja ${User.username}`); //what
                  },
                }];
            return voiceChannels.map((channel) => {
                return {
                  label: channel.name,
                  id: channel.id,
                  icon: () => VCIcon("18", "18"),
                  action: async () => {
                    for (const member of ChannelMembers) {
                      if (member == User?.id) continue;
                      Requests.patch({
                        url: DiscordConstants.ANM.GUILD_MEMBER(channel.guild_id, member),
                        body: {
                          channel_id: channel.id,
                        },
                      });
                      if (this.settings["BulkActionsdelay"] != 0)
                        await Sleep(this.settings["BulkActionsdelay"]);
                    }
                  },
                };
              });
            
          }
          getVoiceUserIds(guildId, channelId) {
            return Object.values(VoiceState.getVoiceStatesForChannel({getGuildId: () => guildId,id:channelId})).map(m => m.user.id);
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
                  this.settings["BulkActionsdelay"] = e ;
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
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
