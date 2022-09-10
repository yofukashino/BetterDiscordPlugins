/**
 * @name ShowHiddenChannels
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.0
 * @invite SgKSKyh9gY
 * @description Displays all hidden channels which can't be accessed, this won't allow you to read them.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowHiddenChannels.plugin.js
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
      name: "ShowHiddenChannels",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.0",
      description:
        "Displays all hidden channels which can't be accessed, this won't allow you to read them.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowHiddenChannels.plugin.js",
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
          "BD TOS like wha... ⊙.☉",
        ],
      },
    ],
    main: "ShowHiddenChannels.plugin.js",
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
          Utilities,
          DOMTools,
          Logger,
          PluginUpdater,
          DiscordModules: {
            GuildStore,
            ChannelStore,
            DiscordConstants,
            MessageActions,
            Tooltip,
            Clickable,
            TextElement,
            React,
          },
        } = Library;
        const registry = WebpackModules.getModules(
          (m) =>
            typeof m === "function" &&
            m.toString().indexOf('"currentColor"') !== -1
        );
        const Icon = (props) => {
          const mdl = registry.find((m) => m.displayName === props.name);
          const newProps = global._.cloneDeep(props);
          delete newProps.name;

          return React.createElement(mdl, newProps);
        };
        Icon.Names = registry.map((m) => m.displayName);
        const ChannelTopic = WebpackModules.getByDisplayName("ChannelTopic");
        const { chat } = WebpackModules.getByProps("chat", "chatContent");
        const Route = WebpackModules.getModules(
          (m) => m.default?.displayName == "RouteWithImpression"
        )[0];
        const ChannelItem = WebpackModules.getModules(
          (m) => m.default?.displayName == "ChannelItem"
        )[0];
        const ChannelClasses = WebpackModules.getByProps(
          "wrapper",
          "mainContent"
        );
        const ChannelUtil = WebpackModules.getByProps(
          "getChannelIconComponent"
        );
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const Channel = WebpackModules.getByPrototypes("isManaged");
        const { iconItem, actionIcon } = WebpackModules.getByProps("iconItem");
        const UnreadStore = WebpackModules.getByProps("isForumPostUnread");
        const Voice = WebpackModules.getByProps("getVoiceStateStats");
        const CSS = `.shc-guild-settings {
          width: auto !important;
          margin-bottom: 32px;
       }	 
       .shc-guild-item.selectableItem-1MP3MQ.selected-31soGA {
          cursor: pointer !important;
       }	 
       .shc-guild-scroller {
          max-height: 500px;
       }	 
       .shc-lock-icon-clickable {
          margin-left: 0;
       }	 
       .shc-guild-item {
          padding: 6px;
          padding-left: 18px;
          margin-top: 4px;
          margin-bottom: 4px;
          height: auto;
       }	 
       .shc-guild {
          margin: 6px;
          width: 32px;
          height: 32px;
          float: left;
          border-radius: 360px;
       }	 
       .shc-guild-name {
          color: white;
          float: left;
          font-family: 'Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
          font-weight: 700;
          margin-left: 8px;
          font-size: 20px;
       }	 
       .shc-guild-name {
          margin-top: 8px;
       }	 
       .shc-locked-notice {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: auto;
          text-align: center;
       }	 
       .shc-additional-info-text {
          margin-top: 10px;
       }	 
       .shc-locked-notice > div[class^="divider"] {
          display: none
       }	 
       .shc-locked-notice > div[class^="topic"] {
          background-color: var(--background-secondary);
          padding: 5px;
          max-width: 50vh;
          text-overflow: ellipsis;
          border-radius: 5px;
          margin: 10px auto;
       }	 
       .shc-notice-lock {
          -webkit-user-drag: none;
          max-height: 128px;
       }	 
       .shc-locked-channel-text {
          margin-top: 20px;
          font-weight: bold;
       }	 
       .shc-no-access-text {
          margin-top: 10px;
       }
       `;
        return class ShowHiddenChannels extends Plugin {
          constructor() {
            super();
            this.can =
              ChannelPermissionStore.can.__originalFunction ??
              ChannelPermissionStore.can;
            const _this = this;
            if (!Channel.prototype.isHidden)
              Channel.prototype.isHidden = function () {
                return (
                  ![1, 3].includes(this.type) &&
                  !_this.can(DiscordConstants.Permissions.VIEW_CHANNEL, this)
                );
              };
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
            DOMTools.addStyle(config.info.name, CSS);
            this.addPatches();
          }
          addPatches() {
            Patcher.after(UnreadStore, "hasAnyUnread", (_, args, res) => {
              return res && !ChannelStore.getChannel(args[0])?.isHidden();
            });
            Patcher.after(UnreadStore, "hasUnread", (_, args, res) => {
              return res && !ChannelStore.getChannel(args[0])?.isHidden();
            });
            Patcher.after(UnreadStore, "hasRelevantUnread", (_, args, res) => {
              return res && !args[0].isHidden();
            });
            Patcher.after(ChannelPermissionStore, "can", (_, args, res) => {
              if (args[0] == DiscordConstants.Permissions.VIEW_CHANNEL)
                return true;
              return res;
            });
            Patcher.after(UnreadStore, "getMentionCount", (_, args, res) => {
              return ChannelStore.getChannel(args[0])?.isHidden() ? 0 : res;
            });
            Patcher.after(Route, "default", (_, args, res) => {
              const id = res.props?.computedMatch?.params?.channelId;
              const guild = res.props?.computedMatch?.params?.guildId;
              let channel;
              if (
                id &&
                guild &&
                (channel = ChannelStore.getChannel(id)) &&
                channel?.isHidden?.() &&
                channel?.id != Voice.getChannelId()
              ) {
                res.props.render = () =>
                  React.createElement(this.lockscreen(), {
                    channel: channel,
                    guild: GuildStore.getGuild(guild),
                  });
              }
              return res;
            });
            Route.default.displayName = "RouteWithImpression";
            if (!MessageActions._fetchMessages) {
              MessageActions._fetchMessages = MessageActions.fetchMessages;
              MessageActions.fetchMessages = (args) => {
                if (ChannelStore.getChannel(args.channelId)?.isHidden?.())
                  return;
                return MessageActions._fetchMessages(args);
              };
            }

            Patcher.after(ChannelItem, "default", (_, args, res) => {
              const instance = args[0];
              if (instance.channel?.isHidden()) {
                const item = res.props?.children?.props;
                if (item?.className)
                  item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;
                const children =
                  res.props?.children?.props?.children[1]?.props?.children[1];
                if (children.props?.children)
                  children.props.children = [
                    React.createElement(
                      Tooltip,
                      {
                        text: "Channel Locked",
                      },
                      React.createElement(
                        Clickable,
                        {
                          className: [iconItem, "shc-lock-icon-clickable"].join(
                            " "
                          ),
                          style: {
                            display: "block",
                          },
                        },
                        React.createElement(Icon, {
                          name: "LockClosed",
                          className: actionIcon,
                        })
                      )
                    ),
                  ];

                if (
                  instance.channel.type ==
                    DiscordConstants.ChannelTypes.GUILD_VOICE &&
                  !instance.connected
                ) {
                  const wrapper = Utilities.findInReactTree(res, (n) =>
                    n?.props?.className?.includes(ChannelClasses.wrapper)
                  );
                  if (wrapper) {
                    wrapper.props.onMouseDown = () => {};
                    wrapper.props.onMouseUp = () => {};
                  }
                  const mainContent = Utilities.findInReactTree(res, (n) =>
                    n?.props?.className?.includes(ChannelClasses.mainContent)
                  );

                  if (mainContent) {
                    mainContent.props.onClick = () => {};
                    mainContent.props.href = null;
                  }
                }
              }
              return res;
            });
            ChannelItem.default.displayName = "ChannelItem";
            Patcher.before(
              ChannelUtil,
              "getChannelIconComponent",
              (_, args) => {
                if (args[0]?.isHidden?.() && args[2]?.locked)
                  args[2].locked = false;
                return args;
              }
            );
          }
          lockscreen() {
            return React.memo((props) => {
              return React.createElement(
                "div",
                {
                  className: ["shc-locked-chat-content", chat]
                    .filter(Boolean)
                    .join(" "),
                },
                React.createElement(
                  "div",
                  {
                    className: "shc-locked-notice",
                  },
                  React.createElement("img", {
                    className: "shc-notice-lock",
                    src: "/assets/755d4654e19c105c3cd108610b78d01c.svg",
                  }),
                  React.createElement(
                    TextElement,
                    {
                      className: "shc-locked-channel-text",
                      color: TextElement.Colors.HEADER_PRIMARY,
                      size: TextElement.Sizes.SIZE_32,
                    },
                    "This is a hidden channel."
                  ),
                  React.createElement(
                    TextElement,
                    {
                      className: "shc-no-access-text",
                      color: TextElement.Colors.HEADER_SECONDARY,
                      size: TextElement.Sizes.SIZE_16,
                    },
                    "You cannot see the contents of this channel. ",
                    props.channel.topic && "However, you may see its topic."
                  ),
                  props.channel.topic &&
                    React.createElement(ChannelTopic, {
                      key: props.channel.id,
                      channel: props.channel,
                      guild: props.guild,
                    }),
                  props.channel.lastMessageId &&
                    React.createElement(
                      TextElement,
                      {
                        color: TextElement.Colors.INTERACTIVE_NORMAL,
                        size: TextElement.Sizes.SIZE_14,
                      },
                      "Last message sent: ",
                      this.getDateFromSnowflake(props.channel.lastMessageId)
                    )
                )
              );
            });
          }
          getDateFromSnowflake(number) {
            try {
              const id = parseInt(number);
              const binary = id.toString(2).padStart(64, "0");
              const excerpt = binary.substring(0, 42);
              const decimal = parseInt(excerpt, 2);
              const unix = decimal + 1420070400000;
              return new Date(unix).toLocaleString();
            } catch (err) {
              Logger.err(err);
              return "(Failed to get date)";
            }
          }
          onStop() {
            Patcher.unpatchAll();
            DOMTools.removeStyle(config.info.name);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
