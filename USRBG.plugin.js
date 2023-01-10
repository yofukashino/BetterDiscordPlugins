/**
 * @name USRBG
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description User profile backgrounds for BetterDiscord. (Banners are fetched from the USRBG database.)
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/USRBG.plugin.js
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
      name: "USRBG",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.1",
      description: "User profile backgrounds for BetterDiscord. (Banners are fetched from the USRBG database.)",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/USRBG.plugin.js",
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
          "Ah my last plugin before i die ...(*￣０￣)ノ",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Corrected text."],
      },
      {
        title: "v1.0.3",
        items: [
          "Added Indicator for USRBG Banners",
        ],
      },
    ],
    main: "USRBG.plugin.js",
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
        WebpackModules,
        PluginUpdater,
        Logger,
        Patcher,
        Utilities,
        DOMTools,
        DiscordModules: { React, Tooltip, InviteActions },
        Settings: { SettingPanel, Switch, RadioGroup },
      } = ZLibrary;
      const { LibraryIcons,
        LibraryModules: {
          UserBannerParents,
          BannerClasses,
          Clickable,
          IconClasses
        }
      } = BunnyLib.build(config);
      const USBBG_SERVER_INVITE_CODE = "TeRQEPb";
      const USRBG_URL =
        "https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json";
      const CSS = `
        .banner-2boKnS > .usr-bg-icon-clickable {
          opacity: 0% !important;
          
          transition: all 0.2s ease-in-out;
        }      
        .banner-2boKnS:hover > .usr-bg-icon-clickable {
          opacity: 100% !important;
         
        }
        `
      const defaultSettings = {
        nitroBanner: true,
        style: 2,
      };

      return class USRBG extends Plugin {
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
          this.applyPatches();
          DOMTools.addStyle(config.info.name, CSS);
        }
        async getUSRBG() {
          const response = await fetch(USRBG_URL);
          const json = await response.json();
          return new Map(json.map((user) => [user.uid, user]));
        }
        async applyPatches() {
          const USRDB = await this.getUSRBG();
          for (const UserBanner of UserBannerParents) {
            const functionKey  = Object.keys(UserBanner).find(m => UserBanner[m].toString().toLowerCase().includes("banner"))
            Patcher.before(UserBanner, functionKey, (_, [args]) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              const img = USRDB.get(args.user.id)?.img;
              args.bannerSrc = img;
              if (!args.displayProfile) return;
              Patcher.instead(args.displayProfile, "getBannerURL", () => img);
            });
            Patcher.after(UserBanner, functionKey, (_, [args], res) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              res.props.isPremium = true;
              const Class = Utilities.findInReactTree(res, m => m.className);
              switch (true) {
                case Class.className.includes(BannerClasses.profileBannerPremium): {
                  res.props.profileType = this.settings["style"] == 2 ? 2 : 1;
                  break;
                }
                case Class.className.includes(BannerClasses.settingsBanner): {
                  res.props.profileType = 2;
                  break;
                }
                default: {
                  res.props.profileType = this.settings["style"];
                  break;
                }
              }

              res.props.children.props.children = [this.USRBGIcon()];
            });
          }
          // taken from cumcord plugin by "https://github.com/ItsJustJoshDev"      
          Patcher.after(Clickable.prototype, "render", (_, args, res) => {
            const wrapper = res?.props?.children;
            if (!wrapper?.props?.className?.includes?.(BannerClasses.avatarWrapperNormal)) return;
            const UserId = Utilities.findInReactTree(wrapper, "src")?.split("/")[4];
            if (!USRDB.has(UserId)) return res;
            res.props.children.props.className += ` ${BannerClasses.avatarPositionPremiumBanner}`;
            return res;

          })
        }
        USRBGIcon() {
          return React.createElement(
            Tooltip,
            {
              text: "USRBG Banner",
            },
            (props) =>
              React.createElement(
                "div",
                {
                  ...props,
                  className: `${IconClasses.iconItem} usr-bg-icon-clickable`,
                  onClick: () =>
                    InviteActions.acceptInviteAndTransitionToInviteChannel(
                      { inviteKey: USBBG_SERVER_INVITE_CODE }
                    ),
                  style: {
                    display: "block",
                    position: "absolute",
                    right: "10px",
                    top: "1px"
                  },
                },
                React.createElement(
                  "svg",
                  {
                    class: IconClasses.actionIcon,
                    viewBox: "0 0 24 24",
                  },
                  React.createElement("path", {
                    fill: "currentColor",
                    d: "M6 16.938v2.121L5.059 20h-2.12L6 16.938Zm16.002-2.503v2.122L18.56 20h-.566v-1.557l4.008-4.008ZM8.75 14h6.495a1.75 1.75 0 0 1 1.744 1.607l.006.143V20H7v-4.25a1.75 1.75 0 0 1 1.606-1.744L8.75 14Zm-.729-3.584c.06.579.243 1.12.523 1.6L2 18.56v-2.122l6.021-6.022Zm13.98-.484v2.123l-4.007 4.01v-.315l-.004-.168a2.734 2.734 0 0 0-.387-1.247l4.399-4.403ZM12.058 4 2 14.06v-2.121L9.936 4h2.12Zm9.945 1.432v2.123l-5.667 5.67a2.731 2.731 0 0 0-.86-.216l-.23-.009h-.6a4.02 4.02 0 0 0 .855-1.062l6.502-6.506ZM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM7.559 4l-5.56 5.56V7.438L5.439 4h2.12Zm13.498 0-5.148 5.149a3.98 3.98 0 0 0-.652-1.47L18.935 4h2.122Zm-4.498 0-2.544 2.544a3.974 3.974 0 0 0-1.6-.522L14.438 4h2.122Z",
                  })
                )
              )
          )
        }
        onStop() {
          Patcher.unpatchAll();
          DOMTools.removeStyle(config.info.name);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Priorities",
              "Prioritize Nitro banner.",
              this.settings["nitroBanner"],
              (e) => {
                this.settings["nitroBanner"] = e;
              }
            ),
            new RadioGroup(
              "Avatar style",
              "Avatar and banner styling.",
              this.settings["style"],
              [
                {
                  name: "Attached with banner",
                  value: 2,
                },
                {
                  name: "With border around avatar",
                  value: 0,
                },
              ],
              (e) => {
                this.settings["style"] = e;
              }
            )
          );
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
