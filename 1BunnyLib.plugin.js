/**
 * @name BunnyLib
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.3
 * @invite SgKSKyh9gY
 * @description Required library for Ahlawat's plugins.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js
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
      name: "BunnyLib",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.3",
      description: "Required library for Ahlawat's plugins.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.5.0",
        items: ["Base Model"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin Lirary :)",
          "Will be used in all of the plugins by Ahlawat (○｀ 3′○)",
        ],
      },
    ],
    main: "1BunnyLib.plugin.js",
  };
  const RequiredLibs = [
    {
      window: "ZeresPluginLibrary",
      filename: "0PluginLibrary.plugin.js",
      external:
        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
      downloadUrl:
        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    },
  ];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(
        (lib) => !window.hasOwnProperty(lib.window)
      ))
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
      const LibFetch = await fetch(Lib.downloadUrl);
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
            shell.openExternal(Lib.external);
          },
        }
      );
    }
    start() {}
    stop() {}
  }
  return RequiredLibs.some((m) => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
        const {
          WebpackModules,
          Patcher,
          ContextMenu,
          Utilities,
          Logger,
          PluginUpdater,
          ReactTools,
          Toasts,
          Settings: { SettingField },
          DiscordModules: { React, ReactDOM, Keybind, ButtonData, FlexChild },
        } = ZLibrary;
        const {
          Components: { Tooltip },
          Plugins,
        } = BdApi;
        const LibraryModules = new (class LibraryModules {
          get GuildNav() {
            return WebpackModules.getModule((m) =>
              m?.type?.toString?.()?.includes("guildsnav")
            );
          }
          get DiscordNative() {
            return WebpackModules.getByProps("clipboard");
          }
          get DiscordConstants() {
            return WebpackModules.getModule((m) => m?.Plq?.ADMINISTRATOR == 8n);
          }
          get Slate() {
            const { type } = WebpackModules.getModule((m) =>
              m?.type?.render?.toString?.()?.includes?.("richValue")
            );
            return type;
          }
          get TimestampUtils() {
            return WebpackModules.getByProps("fromTimestamp");
          }
          get UserStore() {
            return WebpackModules.getByProps("getCurrentUser", "getUser");
          }
          get ChannelPermissionStore() {
            return WebpackModules.getByProps("getChannelPermissions");
          }
          get UploadModule() {
            return WebpackModules.getByProps("cancel", "upload");
          }
          get ApplicationCommandStore() {
            return WebpackModules.getModule(
              (m) => m?.ZP?.getApplicationSections
            );
          }
          get IconUtils() {
            return WebpackModules.getByProps("getApplicationIconURL");
          }
          get WindowInfoStore() {
            return WebpackModules.getByProps(
              "isFocused",
              "isElementFullScreen"
            );
          }
          get KeybindStore() {
            return WebpackModules.getByProps("hasKeybind");
          }
          get KeybindUtils() {
            return WebpackModules.getModule((m) =>
              m?.Kd?.toString().includes("numpad plus")
            );
          }
          get SoundModule() {
            return WebpackModules.getModule((m) =>
              m?.GN?.toString().includes("getSoundpack")
            );
          }
          get StatusPicker() {
            return WebpackModules.getByProps("status", "statusItem");
          }
          get Menu() {
            return WebpackModules.getModule((m) => m.ZP && m.sN);
          }
          get UserSettingsProtoStore() {
            return WebpackModules.getByProps(
              "getGuildFolders",
              "getGuildRecentsDismissedAt"
            );
          }
          get UserSettingsProtoUtils() {
            return WebpackModules.getModule((m) => m?.hW?.ProtoClass);
          }
          get PanelButton() {
            return WebpackModules.getModule((m) =>
              m?.toString?.()?.includes("Masks.PANEL_BUTTON")
            );
          }
          get AccountDetails() {
            return WebpackModules.getModule((m) =>
              [".START", "shrink", "grow", "basis"].every((s) =>
                m?.Z?.toString()?.includes(s)
              )
            );
          }
          get MessageAccessories() {
            const { BB } = WebpackModules.getModule(
              (m) => m.ZP && m.$p && m.BB
            );
            return BB;
          }
          get Dispatcher() {
            return WebpackModules.getByProps("dispatch", "_actionHandlers");
          }
          get Timeout() {
            const { V7 } = WebpackModules.getModule((m) =>
              ["start", "stop", "isStarted"].every(
                (proto) => m?.V7?.prototype?.[proto]
              )
            );
            return V7;
          }
          get StreamPreviewStore() {
            return WebpackModules.getByProps("getPreviewURL");
          }
          get SpotifyProtocoalStore() {
            return WebpackModules.getModule((m) =>
              m?.Ai?.toString?.()?.includes("SPOTIFY_PROFILE_UPDATE")
            );
          }
          get SpotifyPremiumCheck() {
            return WebpackModules.getModule((m) =>
              m?.yp?.toString?.()?.includes("spotify account is not premium")
            );
          }
          get AccountSwitcherStrings() {
            return WebpackModules.getModule(
              (m) => m.Ip == "multiaccount_cta_tooltip_seen"
            );
          }
          get TypingStore() {
            return WebpackModules.getByProps("startTyping", "stopTyping");
          }
          get DeveloperExperimentStore() {
            return WebpackModules.getModule((m) =>
              m?.Z?.hasOwnProperty("isDeveloper")
            );
          }
          get SettingView() {
            return WebpackModules.getByProps("sidebar", "tools");
          }
          get AudioUtils() {
            return WebpackModules.getByProps("toggleSelfMute");
          }
          get NotificationStore() {
            return WebpackModules.getByProps("getDesktopType");
          }
          get AvatarStatusClasses() {
            return WebpackModules.getByProps("dots", "themed");
          }
          get DMAvatar() {
            const { avatar } = WebpackModules.getByProps(
              "avatar",
              "highlighted",
              "wrappedName"
            );
            return avatar;
          }
          get GuildAvatar() {
            const { avatar } = WebpackModules.getByProps("avatar", "selected");
            return avatar;
          }

          get Masks() {
            return WebpackModules.getModule((m) => m?.ZP?.Masks);
          }
          get HypeSquadStore() {
            return WebpackModules.getByProps(`joinHypeSquadOnline`);
          }
          get MentionUtils() {
            return WebpackModules.getModule((m) =>
              ["rawMessage", "mention_everyone", "mentionUsers"].every((s) =>
                Object.values(m).some((m) => m?.toString?.().includes(s))
              )
            );
          }
          get AckUtils() {
            return WebpackModules.getModule((m) => m.y5 && m.Ju);
          }
          get MessageStore() {
            return WebpackModules.getByProps("hasUnread", "lastMessageId");
          }
          get ProfileStore() {
            const Module = WebpackModules.getModule((m) =>
              m?.mB?.toString().includes("user cannot be undefined")
            );
            return {
              getUser: Object.values(Module).find((value) =>
                value.toString().includes('"USER_UPDATE"')
              ),
              fetchProfile: Object.values(Module).find((value) =>
                value.toString().includes(".apply(")
              ),
            };
          }
          get Praser() {
            return WebpackModules.getByProps("parse", "parseTopic");
          }
          get Message() {
            return WebpackModules.getModule((m) => m.$p && m.ZP);
          }
          get GuildReadStateStore() {
            return WebpackModules.getByProps("getMentionCount");
          }
          get AuthenticationStore() {
            return ((allModulesExports) => {
              webpackChunkdiscord_app.push([
                [Math.random()],
                {},
                (r) =>
                  (allModulesExports = Object.values(r.c).map(
                    (m) => m?.exports
                  )),
              ]);
              return allModulesExports.find(
                (m) => m?.default?.getToken !== void 0
              ).default;
            })();
          }
          get LinkButtonModule() {
            return WebpackModules.getModule((m) => m?.zx?.Looks);
          }
          get LoginForm() {
            return WebpackModules.getModule((m) =>
              m?.gO?.toString().includes("div")
            );
          }
          get LoginUtils() {
            return WebpackModules.getByProps("login", "logout");
          }
          get WarningPopoutModule() {
            return WebpackModules.getModule((m) =>
              m?.v?.toString()?.includes("openWarningPopout")
            );
          }
          get ApplicationStreamingOptionStore() {
            return WebpackModules.getModule((m) => m?.tI?.PRESET_CUSTOM);
          }
          get WebRTCUtils() {
            const { prototype } =
              WebpackModules.getByPrototypes("updateVideoQuality");
            return prototype;
          }
          get TextTags() {
            return WebpackModules.getModule((m) =>
              m?.render?.toString().includes(".titleId")
            );
          }
          get RTCConnectionUtils() {
            return WebpackModules.getByProps(
              "getChannelId",
              "getGuildId",
              "getRTCConnectionId"
            );
          }
          get Clickable() {
            return WebpackModules.getModule(
              (m) =>
                [".ENTER", "preventDefault", ").handleKeyPress"].every((s) =>
                  m?.toString?.().includes(s)
                ),
              { searchExports: true }
            );
          }
          get ProfileBadges() {
            return WebpackModules.getModule((m) =>
              ["botUpgraded", ".shrinkAtCount", ".shrinkToSize"].every((s) =>
                m?.Z?.toString().includes(s)
              )
            );
          }
          get SliderComponent() {
            return WebpackModules.getModule((m) =>
              m.render?.toString().includes("sliderContainer")
            );
          }
          get Embed() {
            const { prototype } = WebpackModules.getByPrototypes(
              "renderSuppressButton"
            );
            return prototype;
          }
          get SpotifyStore() {
            return WebpackModules.getByProps("getActiveSocketAndDevice");
          }
          get ThemeStore() {
            return WebpackModules.getByProps("theme");
          }
          get ChannelMemberStore() {
            return WebpackModules.getModule((m) =>
              m?.getProps?.toString().includes("groups")
            );
          }
          get GuildPrototype() {
            return WebpackModules.getByPrototypes("getRole", "getIconURL");
          }
          get Flux() {
            return Object.assign(
              {},
              WebpackModules.getByProps("Store", "connectStores"),
              WebpackModules.getModule((m, e) =>
                m?.ZP?.toString().includes("useStateFromStores")
              )
            );
          }
          get NavBarClasses() {
            return Object.assign(
              {},
              WebpackModules.getByProps("listItem"),
              WebpackModules.getByProps("tree", "scroller"),
              WebpackModules.getByProps("guilds", "base")
            );
          }
          get PresenceStore() {
            return WebpackModules.getByProps(
              "getState",
              "getStatus",
              "isMobileOnline"
            );
          }

          get GuildStore() {
            return WebpackModules.getByProps("initialize", "totalGuilds");
          }
          get MediaEngineStore() {
            return WebpackModules.getByProps("isDeaf");
          }
          get UserBannerParents() {
            const Strings = ["profileType", "displayProfile"];
            const UserBannerParents = WebpackModules.getModules((m) =>
              Strings.every((s) =>
                Object.values(m).some((n) => n?.toString?.().includes(s))
              )
            );
            return UserBannerParents.map((UserBanner) => [
              UserBanner,
              Object.keys(UserBanner).find((FunctionKey) =>
                Strings.every((s) =>
                  UserBanner[FunctionKey].toString().includes(s)
                )
              ),
            ]);
          }
          get BannerClasses() {
            return Object.assign(
              {},
              WebpackModules.getByProps(
                "settingsBanner",
                "profileBannerPremium"
              ),
              WebpackModules.getByProps("avatarWrapperNormal")
            );
          }
          get IconClasses() {
            return WebpackModules.getByProps("iconItem");
          }
          get BuiltInCommands() {
            return WebpackModules.getModule((m) =>
              m?.Kh?.toString?.()?.includes?.("BUILT_IN_TEXT")
            );
          }
          get RequestsUtils() {
            return WebpackModules.getModule(
              (m) => typeof m == "object" && m.patch
            );
          }
          get SortedVoiceStateStore() {
            return WebpackModules.getByProps("getVoiceStatesForChannel");
          }
          get ExperimentsStore() {
            return WebpackModules.getByProps("hasRegisteredExperiment");
          }
          get AccessibilityStore() {
            return WebpackModules.getByProps("isZoomedIn");
          }
          get GatewayConnectionStore() {
            return WebpackModules.getModule(
              (m) => m?.getName?.() == "GatewayConnectionStore"
            );
          }
          get ClientThemesBackgroundStore() {
            return WebpackModules.getByProps(
              "getGradientAngle",
              "getGradientPreset",
              "getLinearGradient"
            );
          }
          get ClientThemesExperimentModule() {
            return WebpackModules.getModule(
              (m) => m.W.definition.label == "Client Themes"
            );
          }
        })();
        const LibraryIcons = new (class LibraryIcons {
          Glob(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 490 490",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M245,0C109.69,0,0,109.69,0,245s109.69,245,245,245s245-109.69,245-245S380.31,0,245,0z M31.401,260.313h52.542 c1.169,25.423,5.011,48.683,10.978,69.572H48.232C38.883,308.299,33.148,284.858,31.401,260.313z M320.58,229.688 c-1.152-24.613-4.07-47.927-8.02-69.572h50.192c6.681,20.544,11.267,43.71,12.65,69.572H320.58z M206.38,329.885 c-4.322-23.863-6.443-47.156-6.836-69.572h90.913c-0.392,22.416-2.514,45.709-6.837,69.572H206.38z M276.948,360.51 c-7.18,27.563-17.573,55.66-31.951,83.818c-14.376-28.158-24.767-56.255-31.946-83.818H276.948z M199.961,229.688 c1.213-24.754,4.343-48.08,8.499-69.572h73.08c4.157,21.492,7.286,44.818,8.5,69.572H199.961z M215.342,129.492 c9.57-37.359,21.394-66.835,29.656-84.983c8.263,18.148,20.088,47.624,29.66,84.983H215.342z M306.07,129.492 c-9.77-40.487-22.315-73.01-31.627-94.03c11.573,8.235,50.022,38.673,76.25,94.03H306.07z M215.553,35.46 c-9.312,21.02-21.855,53.544-31.624,94.032h-44.628C165.532,74.13,203.984,43.692,215.553,35.46z M177.44,160.117 c-3.95,21.645-6.867,44.959-8.019,69.572h-54.828c1.383-25.861,5.968-49.028,12.65-69.572H177.44z M83.976,229.688H31.401 c1.747-24.545,7.481-47.984,16.83-69.572h46.902C89.122,181.002,85.204,204.246,83.976,229.688z M114.577,260.313h54.424 c0.348,22.454,2.237,45.716,6.241,69.572h-47.983C120.521,309.288,115.92,286.115,114.577,260.313z M181.584,360.51 c7.512,31.183,18.67,63.054,34.744,95.053c-10.847-7.766-50.278-38.782-77.013-95.053H181.584z M273.635,455.632 c16.094-32.022,27.262-63.916,34.781-95.122h42.575C324.336,417.068,284.736,447.827,273.635,455.632z M314.759,329.885 c4.005-23.856,5.894-47.118,6.241-69.572h54.434c-1.317,25.849-5.844,49.016-12.483,69.572H314.759z M406.051,260.313h52.548 c-1.748,24.545-7.482,47.985-16.831,69.572h-46.694C401.041,308.996,404.882,285.736,406.051,260.313z M406.019,229.688 c-1.228-25.443-5.146-48.686-11.157-69.572h46.908c9.35,21.587,15.083,45.026,16.83,69.572H406.019z M425.309,129.492h-41.242 c-13.689-32.974-31.535-59.058-48.329-78.436C372.475,68.316,403.518,95.596,425.309,129.492z M154.252,51.06 c-16.792,19.378-34.636,45.461-48.324,78.432H64.691C86.48,95.598,117.52,68.321,154.252,51.06z M64.692,360.51h40.987 c13.482,32.637,31.076,58.634,47.752,78.034C117.059,421.262,86.318,394.148,64.692,360.51z M336.576,438.54 c16.672-19.398,34.263-45.395,47.742-78.03h40.99C403.684,394.146,372.945,421.258,336.576,438.54z",
              })
            );
          }

          Clipboard(width, height) {
            return React.createElement(
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
                d: "M20.005 11.5a1 1 0 0 1 .993.883l.007.117V17a5.5 5.5 0 0 1-5.279 5.495l-.221.005H8.25a2.5 2.5 0 0 1-2.452-2.012h2.347l.052.009.053.003h7.255a3.5 3.5 0 0 0 3.494-3.296l.006-.192V12.5a1 1 0 0 1 1-1Zm-3.006-2.013a1 1 0 0 1 .993.883l.007.117v6.5a2.5 2.5 0 0 1-2.336 2.495l-.164.006h-10a2.5 2.5 0 0 1-2.495-2.336l-.005-.164v-6.49a1 1 0 0 1 1.993-.116l.007.116v6.49a.5.5 0 0 0 .41.492l.09.008h10a.5.5 0 0 0 .492-.41l.008-.09v-6.501a1 1 0 0 1 1-1ZM6.293 5.793l3.497-3.5a1 1 0 0 1 1.32-.084l.095.084 3.502 3.5a1 1 0 0 1-1.32 1.497l-.094-.083L11.5 5.415v8.84a1 1 0 0 1-.883.993l-.117.007a1 1 0 0 1-.993-.883l-.007-.117V5.412L7.707 7.207a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094 3.497-3.5-3.497 3.5Z",
              })
            );
          }

          ViewAll(width, height) {
            return React.createElement(
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
                d: "M2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H3C2.44772 6 2 5.55228 2 5ZM6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L10.7071 11.2929C11.0976 11.6834 11.0976 12.3166 10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L8 11.4142V19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19V11.4142L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L6.29289 8.29289ZM21 10H12C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8H21C21.5523 8 22 8.44772 22 9C22 9.55228 21.5523 10 21 10Z",
              })
            );
          }

          ClipboardError(width, height) {
            return React.createElement(
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
                d: "M10.25 2H13.75C14.9079 2 15.8616 2.87472 15.9862 3.99944L17.75 4C18.9926 4 20 5.00736 20 6.25V11.4982C19.2304 11.1772 18.3859 11 17.5 11C13.9101 11 11 13.9101 11 17.5C11 19.2465 11.6888 20.8321 12.8096 22H6.25C5.00736 22 4 20.9926 4 19.75V6.25C4 5.00736 5.00736 4 6.25 4L8.01379 3.99944C8.13841 2.87472 9.09205 2 10.25 2ZM13.75 3.5H10.25C9.83579 3.5 9.5 3.83579 9.5 4.25C9.5 4.66421 9.83579 5 10.25 5H13.75C14.1642 5 14.5 4.66421 14.5 4.25C14.5 3.83579 14.1642 3.5 13.75 3.5ZM23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM17.5 14C17.2239 14 17 14.2239 17 14.5V18.5C17 18.7761 17.2239 19 17.5 19C17.7761 19 18 18.7761 18 18.5V14.5C18 14.2239 17.7761 14 17.5 14ZM17.5 21.125C17.8452 21.125 18.125 20.8452 18.125 20.5C18.125 20.1548 17.8452 19.875 17.5 19.875C17.1548 19.875 16.875 20.1548 16.875 20.5C16.875 20.8452 17.1548 21.125 17.5 21.125Z",
              })
            );
          }
          Trash(width, height) {
            return React.createElement(
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
                d: "M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z",
              })
            );
          }

          Reload(width, height) {
            return React.createElement(
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
                d: "M7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 5a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H9a1 1 0 0 0-1 1ZM5 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1ZM19 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1ZM9 20a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2H9ZM5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
              })
            );
          }

          Controller(width, height) {
            return React.createElement(
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
                d: "M17 2H7C4.8 2 3 3.8 3 6V18C3 20.2 4.8 22 7 22H17C19.2 22 21 20.2 21 18V6C21 3.8 19.2 2 17 2ZM10.86 18.14C10.71 18.29 10.52 18.36 10.33 18.36C10.14 18.36 9.95 18.29 9.8 18.14L9.15 17.49L8.53 18.11C8.38 18.26 8.19 18.33 8 18.33C7.81 18.33 7.62 18.26 7.47 18.11C7.18 17.82 7.18 17.34 7.47 17.05L8.09 16.43L7.5 15.84C7.21 15.55 7.21 15.07 7.5 14.78C7.79 14.49 8.27 14.49 8.56 14.78L9.15 15.37L9.77 14.75C10.06 14.46 10.54 14.46 10.83 14.75C11.12 15.04 11.12 15.52 10.83 15.81L10.21 16.43L10.86 17.08C11.15 17.37 11.15 17.85 10.86 18.14ZM14.49 18.49C13.94 18.49 13.49 18.05 13.49 17.5V17.48C13.49 16.93 13.94 16.48 14.49 16.48C15.04 16.48 15.49 16.93 15.49 17.48C15.49 18.03 15.04 18.49 14.49 18.49ZM16.51 16.33C15.96 16.33 15.5 15.88 15.5 15.33C15.5 14.78 15.94 14.33 16.49 14.33H16.51C17.06 14.33 17.51 14.78 17.51 15.33C17.51 15.88 17.06 16.33 16.51 16.33ZM18 9.25C18 10.21 17.21 11 16.25 11H7.75C6.79 11 6 10.21 6 9.25V6.75C6 5.79 6.79 5 7.75 5H16.25C17.21 5 18 5.79 18 6.75V9.25Z",
              })
            );
          }

          Tools(width, height) {
            return React.createElement(
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
                d: "M3 3.05c-.619.632-1 1.496-1 2.45v11A3.5 3.5 0 0 0 5.5 20h7.014c.051-.252.144-.5.28-.736l.73-1.264H5.5A1.5 1.5 0 0 1 4 16.5V7h14v1.254a4.515 4.515 0 0 1 2-.245V5.5c0-.954-.381-1.818-1-2.45V3h-.05a3.489 3.489 0 0 0-2.45-1h-11c-.954 0-1.818.381-2.45 1H3v.05ZM19.212 9a3.496 3.496 0 0 1 .96.044l-1.651 2.858a1.167 1.167 0 1 0 2.02 1.167l1.651-2.859a3.501 3.501 0 0 1-2.975 5.762l-3.031 5.25a1.458 1.458 0 0 1-2.527-1.458l3.026-5.24A3.5 3.5 0 0 1 19.212 9Zm-8.91.243a.75.75 0 0 1-.045 1.06L7.86 12.5l2.397 2.197a.75.75 0 0 1-1.014 1.106l-3-2.75a.75.75 0 0 1 0-1.106l3-2.75a.75.75 0 0 1 1.06.046Zm2.955 6.56 2.02-1.852a4.495 4.495 0 0 1-.008-2.91l-2.012-1.844a.75.75 0 0 0-1.014 1.106L14.64 12.5l-2.397 2.197a.75.75 0 0 0 1.014 1.106Z",
              })
            );
          }

          Download(width, height) {
            return React.createElement(
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
                d: "M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z",
              })
            );
          }

          Sound(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 24 24",
                width,
                height,
              },
              React.createElement("path", {
                d: "M3.5 12a8.5 8.5 0 1 1 14.762 5.748l.992 1.135A9.966 9.966 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.966 9.966 0 0 0 2.746 6.883l.993-1.134A8.47 8.47 0 0 1 3.5 12Z",
                style: {
                  fill: "currentColor",
                },
              }),
              React.createElement("path", {
                d: "M19.25 12.125a7.098 7.098 0 0 1-1.783 4.715l-.998-1.14a5.625 5.625 0 1 0-8.806-.15l-1.004 1.146a7.125 7.125 0 1 1 12.59-4.571Z",
                style: {
                  fill: "currentColor",
                },
              }),
              React.createElement("path", {
                d: "M16.25 12a4.23 4.23 0 0 1-.821 2.511l-1.026-1.172a2.75 2.75 0 1 0-4.806 0L8.571 14.51A4.25 4.25 0 1 1 16.25 12Z",
                style: {
                  fill: "currentColor",
                },
              }),
              React.createElement("path", {
                d: "M12 12.5a.75.75 0 0 1 .564.256l7 8A.75.75 0 0 1 19 22H5a.75.75 0 0 1-.564-1.244l7-8A.75.75 0 0 1 12 12.5Z",
                style: {
                  fill: "currentColor",
                },
              })
            );
          }

          Bravery(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 839 810",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M88.735,30.175h647.64c3.98,0,10.158-.779,12.347,1.122,4.384,0.982,6.58,3.591,6.735,8.98,2.591,2.984,1.122,25.213,1.122,31.43V379.27c0,44.567.932,91.989-1.122,134.7-2.769,1.563-3.647,4.192-5.612,5.613l-3.368,1.122-2.245,3.368h-2.244q-1.685,2.244-3.368,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-1.123,2.245h-1.122l-1.122,2.245h-2.245q-1.685,2.244-3.368,4.49c-37.2,26.779-70.548,57.475-107.753,84.187l-3.367,4.489h-2.245l-3.367,4.49H585.97l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245q-1.685,2.245-3.368,4.49h-2.244L561.277,670h-2.245q-1.685,2.244-3.367,4.49H553.42q-1.684,2.244-3.368,4.49h-2.244q-1.685,2.244-3.368,4.49H542.2l-1.122,2.245h-1.122q-0.562,1.122-1.123,2.245h-2.245l-3.367,4.49h-2.245l-1.122,2.245h-1.123l-1.122,2.245h-2.245l-3.367,4.49h-2.245l-1.123,2.245H517.5l-1.122,2.245h-2.245l-3.368,4.489h-2.244q-1.685,2.246-3.368,4.49H502.91l-3.367,4.49H497.3l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49H474.85q-1.685,2.245-3.368,4.49h-2.244q-1.685,2.245-3.368,4.49h-2.245l-3.367,4.49h-2.245l-3.367,4.49H452.4l-3.367,4.49h-2.245l-3.367,4.49h-2.245l-2.245,3.368h-2.245l-3.367,4.49h-2.245l-3.367,4.49h-2.245v1.122c-1.39,1.079-2.177.8-3.367,2.245-6.57,0-10.037-1.453-13.47-4.49l-2.244-3.367h-2.245q-1.685-2.246-3.368-4.49h-2.244l-2.245-3.368h-2.245l-3.367-4.49h-2.245L387.3,757.55h-1.122q-0.561-1.122-1.123-2.245h-2.244q-1.685-2.244-3.368-4.49H377.2q-1.685-2.244-3.368-4.49h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245L357,732.855H354.75l-3.367-4.49h-2.245q-1.685-2.244-3.367-4.49h-2.245q-1.685-2.244-3.368-4.49h-2.244q-1.684-2.244-3.368-4.49H332.3l-3.367-4.49h-2.245l-3.367-4.489h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245q-0.561-1.124-1.123-2.245h-1.122l-1.122-2.245h-2.245q-1.684-2.246-3.368-4.49h-2.244l-1.123-2.245h-1.122q-0.561-1.124-1.123-2.245h-2.245l-3.367-4.49H287.4l-3.367-4.49h-2.245l-1.122-2.245h-1.123L278.425,670H276.18l-2.245-3.368H271.69l-3.367-4.49h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245q-1.684-2.244-3.368-4.49H243.63l-3.368-4.489h-2.245l-3.367-4.49h-2.245l-1.122-2.245H230.16l-1.122-2.245h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245l-3.367-4.49h-2.245q-1.684-2.246-3.368-4.49h-2.244q-1.684-2.246-3.368-4.49h-2.245q-1.683-2.246-3.367-4.49H193.12l-3.367-4.49h-2.245l-1.122-2.245h-1.123l-1.122-2.245H181.9l-3.367-4.49c-31.37-22.56-59.642-48.075-90.917-70.717L82,512.847V35.788Zm106.63,388.383,3.367,1.122V420.8l3.368,1.122,1.122,2.245h2.245l1.122,2.245h2.245q1.123,1.683,2.245,3.368h2.245l1.122,2.245h2.245q1.124,1.683,2.245,3.367h2.245l1.122,2.245h2.245l1.123,2.245,3.367,1.122,2.245,3.368h2.245l1.122,2.245H236.9l2.245,3.367h2.245l1.122,2.245h2.245L247,455.6h2.245l1.122,2.245h2.245l2.245,3.367H257.1l1.122,2.245h2.245l2.245,3.368h2.245l1.122,2.245h2.245l2.245,3.367h2.245l1.122,2.245h2.245l2.245,3.368h2.245l1.122,2.245h2.245l1.122,2.245,3.368,1.122,2.245,3.368h2.244q0.563,1.122,1.123,2.245h2.245q1.122,1.683,2.245,3.367h2.244q0.563,1.122,1.123,2.245h2.245l2.245,3.368h2.244q0.563,1.122,1.123,2.245H312.1q1.122,1.683,2.245,3.367h2.244q0.563,1.122,1.123,2.245h2.245q1.122,1.683,2.245,3.367h2.244l1.123,2.245h2.245q1.122,1.685,2.245,3.368H332.3l1.123,2.245h2.245q1.122,1.683,2.245,3.367h2.244q0.561,1.124,1.123,2.245h2.245l1.122,2.245,3.367,1.123q1.124,1.683,2.245,3.367h2.245q0.561,1.124,1.123,2.245h2.244l2.245,3.368h2.245l1.123,2.245h2.244q1.124,1.683,2.245,3.367h2.245q0.561,1.122,1.123,2.245h2.244l2.245,3.368h2.245l1.123,2.245h2.244q1.124,1.683,2.245,3.367h2.245l1.122,2.245H387.3l2.245,3.368h2.245l1.122,2.245h2.245q1.124,1.683,2.245,3.367h2.245l2.245,3.368h2.245l1.122,2.245H407.5l1.122,2.245c2.518,2.125,4.579,3.038,8.98,3.367,2.42-3.557,7.59-5.395,11.224-7.857q0.561-1.124,1.123-2.245H432.2l2.245-3.368h2.245q0.561-1.122,1.123-2.245h2.244q1.124-1.683,2.245-3.367h2.245q0.561-1.123,1.123-2.245h2.244l1.123-2.245,3.367-1.123,2.245-3.367h2.245l1.122-2.245h2.245l2.245-3.368h2.245l1.122-2.245h2.245l2.245-3.367h2.245l1.122-2.245h2.245l2.245-3.368h2.245l1.122-2.245h2.245l2.245-3.367h2.245l1.122-2.245h2.245l2.245-3.368h2.245l1.122-2.245h2.245l2.245-3.367h2.245l1.122-2.245H507.4q0.561-1.122,1.123-2.245l3.367-1.123q1.122-1.683,2.245-3.367h2.245l1.122-2.245h2.245q1.122-1.683,2.245-3.367h2.245l1.122-2.245H527.6q1.122-1.684,2.245-3.368h2.245l1.122-2.245h2.245q1.122-1.683,2.245-3.367h2.245l1.122-2.245h2.245l2.245-3.368h2.245l1.122-2.245h2.245q1.122-1.683,2.245-3.367h2.245l1.122-2.245h2.245l2.245-3.368h2.245l1.122-2.245h2.245l1.122-2.245,3.368-1.122,2.244-3.368h2.245q0.561-1.122,1.123-2.245h2.245l2.244-3.367h2.245l1.123-2.245h2.244l2.245-3.368h2.245q0.561-1.122,1.123-2.245h2.244q1.124-1.683,2.245-3.367h2.245l1.123-2.245h2.244q1.123-1.683,2.245-3.368H607.3q0.561-1.122,1.123-2.245h2.244q1.124-1.683,2.245-3.367h2.245l1.123-2.245h2.244q1.124-1.683,2.245-3.367h2.245q0.561-1.124,1.123-2.245h2.244l1.123-2.245,3.367-1.123,2.245-3.367,3.367-1.123v-5.612c-8.965-4.626-41.03-2.318-55-2.245-1.278-1.278,0-.447-2.244-1.123-2.108-10.2.714-10.966,4.489-17.96q0.561-2.244,1.123-4.49h1.122l1.122-4.49h1.123l1.122-4.49h1.123V374.78h1.122v-2.245h1.123V370.29h1.122v-2.245h1.122V365.8h1.123l1.122-4.489,2.245-1.123q0.561-2.244,1.123-4.49h1.122v-2.245h1.122v-2.245h1.123v-2.245h1.122v-2.245h1.123v-2.245H607.3q0.561-2.244,1.123-4.49h1.122l1.122-4.49h1.123q1.122-3.368,2.245-6.735h1.122q0.561-2.244,1.123-4.49H617.4l1.122-4.49h1.123v-2.245h1.122v-2.245h1.123v-2.245h1.122V310.8h1.123v-2.245h1.122v-2.245h1.122v-2.245H627.5v-2.245h1.122v-2.245l2.245-1.122v-2.245h1.123v-2.245h1.122v-2.245h1.122q0.563-2.244,1.123-4.49h1.122v-2.245H637.6v-2.245h1.122v-2.245h1.123v-2.245h1.122V276h1.122q0.563-2.244,1.123-4.49h1.122q0.561-2.244,1.123-4.49h1.122q0.561-2.244,1.123-4.49h1.122v-2.245h1.122v-2.245h1.123V255.8h1.122v-2.245h1.123l1.122-4.49h1.123l2.244-6.735h1.123q-0.561-2.805-1.123-5.612l-5.612-1.123c-3.25,3.727-8.109,5.031-12.346,7.858q-0.562,1.122-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245h-2.245l-1.123,2.245h-2.245l-1.122,2.245-4.49,1.122v1.123l-3.367,1.122-1.122,2.245h-2.245l-1.123,2.245h-2.245v1.123l-3.367,1.122-1.122,2.245h-2.245q-0.561,1.122-1.123,2.245h-2.244l-1.123,2.245h-2.245l-1.122,2.245h-2.245L592.705,276H590.46l-1.123,2.245h-2.245l-1.122,2.245-4.49,1.123-1.122,2.245h-2.245v1.122l-3.367,1.123q-0.561,1.122-1.123,2.245h-2.244q-0.562,1.122-1.123,2.245h-2.245l-1.122,2.245h-2.245v1.122l-3.367,1.122q-0.561,1.123-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245h-2.245q-0.561,1.124-1.123,2.245h-2.244l-1.123,2.245-4.49,1.123v1.122l-3.367,1.123-1.122,2.245h-2.245v1.122l-3.367,1.123q-0.562,1.122-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245h-2.245l-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245H511.89l-1.123,2.245h-2.244q-0.562,1.122-1.123,2.245l-4.49,1.122-1.122,2.245h-2.245l-1.122,2.245h-2.245q-0.561,1.122-1.123,2.245h-2.244q-0.562,1.122-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245h-2.245l-1.123,2.245h-2.245l-1.122,2.245h-2.245l-1.122,2.245h-2.245q-0.561,1.122-1.123,2.245l-3.367,1.123v1.122H465.87l-1.122,2.245H462.5v1.123h-2.245l-1.122,2.244-3.368,1.123q-2.8,3.929-5.612,7.857v2.245h-1.122v2.245h-1.123v2.245h-1.122v2.245h-1.122q-1.123,3.368-2.245,6.735H442.3q-1.122,3.368-2.245,6.735h-1.122l-1.122,4.49h-1.123l-1.122,4.49h-1.123v2.245H433.32v2.245H432.2V410.7h-1.122v2.245h-1.122v2.245H428.83v2.245h-1.122v2.245h-1.123v2.245h-1.122c-2.636,4.924-2.223,7.976-6.735,11.225v1.122h-6.734l-6.735-11.224-1.122-4.49h-1.123l-1.122-4.49h-1.123q-1.122-3.368-2.244-6.735H397.4v-2.245H396.28v-2.245h-1.123V400.6h-1.122v-2.245h-1.123v-2.245H391.79v-2.245h-1.122v-2.245h-1.123v-2.245h-1.122q-0.561-2.246-1.123-4.49h-1.122v-2.245h-1.123v-2.245h-1.122v-2.245h-1.122V375.9h-1.123v-2.245h-1.122q-0.561-2.245-1.123-4.49l-4.489-3.368q-0.561-1.122-1.123-2.245h-2.245l-1.122-2.244h-2.245l-1.122-2.245h-2.245q-0.561-1.123-1.123-2.245h-2.244l-1.123-2.245h-2.245L357,352.331H354.75l-1.122-2.245h-2.245q-0.561-1.124-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245-4.49-1.123-1.122-2.245h-2.245l-1.123-2.245H332.3l-1.122-2.245h-2.245l-1.122-2.245h-2.245q-0.561-1.122-1.123-2.245H322.2q-0.562-1.122-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245H312.1q-0.561-1.122-1.123-2.245H308.73l-1.122-2.245h-2.245l-1.122-2.245-4.49-1.122-1.122-2.245h-2.245l-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245h-2.245q-0.561-1.122-1.123-2.245h-2.244q-0.562-1.122-1.123-2.245h-2.245l-1.122-2.245H276.18l-1.122-2.245h-2.245l-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245-4.49-1.122v-1.123l-3.367-1.122q-0.561-1.123-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245H247q-0.561-1.123-1.123-2.245H243.63l-1.123-2.245h-2.245l-1.122-2.245H236.9l-1.122-2.245h-2.245q-0.561-1.124-1.123-2.245H230.16l-1.122-2.245h-2.245l-1.122-2.245-4.49-1.123-1.122-2.245h-2.245l-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245h-2.245l-1.123-2.245h-2.244q-0.561-1.122-1.123-2.245h-2.245l-1.122-2.245H197.61l-1.122-2.245h-2.245q-0.561-1.122-1.123-2.245h-2.245l-1.122-2.245h-2.245l-1.122-2.245-4.49-1.122-1.122-2.245-5.612-1.123c-1.778,3.086-2.773,2.017-3.368,6.735h1.123l1.122,4.49h1.123v2.245h1.122v2.245h1.122v2.245h1.123V255.8h1.122v2.245h1.123v2.245H181.9v2.245h1.122v2.245l2.245,1.123q0.561,2.244,1.123,4.49h1.122v2.245h1.123v2.245h1.122v2.245h1.122v2.245H192v2.245h1.122q0.561,2.244,1.123,4.49h1.122l2.245,6.735h1.122q0.563,2.244,1.123,4.489h1.122q0.561,2.245,1.123,4.49h1.122q0.561,2.245,1.123,4.49h1.122v2.245h1.122V310.8h1.123v2.245h1.122v2.245h1.123v2.245h1.122v2.245H212.2v2.245h1.122v2.245h1.122v2.245h1.123v2.245l2.245,1.123,1.122,4.49h1.123v2.245h1.122v2.245H222.3v2.245h1.123v2.245h1.122V345.6h1.123l1.122,4.49h1.123l1.122,4.49h1.122v2.245h1.123v2.245h1.122v2.245h1.123v2.244h1.122q0.561,2.246,1.123,4.49H236.9l1.122,4.49h1.123l1.122,4.49h1.123v2.245h1.122v2.245h1.123v2.245h1.122v2.245h1.122q1.124,3.368,2.245,6.735l2.245,1.123c1.686,2.7,2.948,7.471,3.367,11.225-2.4,1.93-.635,2.282-4.489,3.367-2.434,2.152-10.241,1.122-14.592,1.123H196.488c-1.552,2.932-1.986,1.9-2.245,6.735C195.521,417.591,194.69,416.317,195.365,418.558Z",
              })
            );
          }

          Brilliance(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 839 810",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M402.358,47.1c82.115-1.806,147.935,18.051,197.129,49.252l4.285,1.071,1.071,2.141h2.143v1.071h2.143v1.07l3.214,1.071,1.071,2.141h2.143l1.071,2.142h2.143l1.071,2.141h2.143v1.071l3.214,1.071,1.071,2.141h2.143l1.071,2.141L632.7,116.7l2.143,3.212h2.143l2.142,3.212h2.143l3.214,4.283h2.143l4.285,5.354h2.143l6.428,7.5,3.214,1.07,11.785,12.849,8.571,7.5v2.141l8.571,7.5v2.141l5.356,4.283v2.142l4.286,3.212v2.141l3.214,2.142V189.5l3.214,2.141v2.142l3.214,2.141v2.142l2.142,1.07q0.537,1.607,1.072,3.212h1.071v2.142l2.143,1.071v2.141l2.143,1.071v2.141l2.142,1.071v2.141l2.143,1.071,1.071,4.283,2.143,1.07V222.7h1.071v2.141l2.143,1.071,2.143,6.424,2.142,1.071v2.141h1.072v2.142h1.071v2.141h1.072v2.142h1.071v2.141h1.071v2.141h1.072v2.142h1.071q1.071,3.211,2.143,6.424h1.071v3.212h1.071v2.142h1.072l1.071,4.282h1.071v3.212h1.072v2.142h1.071v3.212h1.071v2.141h1.072l1.071,6.425H755.9v2.141h1.072l1.071,6.424h1.071v3.212h1.072v3.212h1.071q1.071,5.353,2.143,10.708h1.071q0.535,4.281,1.072,8.565h1.071v4.283h1.071v4.283h1.072v5.353h1.071v5.354H770.9v5.353h1.072V346.9h1.071v6.424h1.071v8.565h1.072v9.637h1.071v16.06h1.071c1.545,5.549.1,30.116-1.071,34.263q-1.071,17.13-2.143,34.262c-2.084,7.124-3.209,16.664-5.356,23.556v5.353l-11.785,40.687H755.9v2.142h-1.071l-1.071,6.424h-1.072v2.141h-1.071v3.212h-1.071v2.142h-1.072v3.212H748.4l-1.071,4.283h-1.072l-1.071,5.353h-1.071q-1.073,3.211-2.143,6.424h-1.071v2.142h-1.072v2.141h-1.071v2.142h-1.071V569.6h-1.072v2.141h-1.071v2.142h-1.072v2.141l-2.142,1.071-2.143,6.424-2.143,1.071-1.071,4.283-2.143,1.07-1.071,4.283L721.62,595.3v2.141l-2.142,1.071v2.141l-2.143,1.071v2.142l-2.143,1.07v2.142l-2.143,1.07v2.142l-2.142,1.071V613.5l-3.214,2.141v2.142l-3.214,2.141v2.142q-1.608,1.07-3.214,2.141v2.141l-4.286,3.212v2.142l-5.356,4.283v2.141l-7.5,6.424-1.071,3.212L670.2,659.543l-7.5,8.566h-2.143q-3.749,4.283-7.5,8.565h-2.143l-4.285,5.354h-2.143l-3.214,4.283h-2.143l-2.142,3.212h-2.143l-2.143,3.212h-2.142l-2.143,3.212H626.27l-1.071,2.142-3.214,1.07v1.071h-2.143l-1.071,2.141h-2.143l-1.071,2.142h-2.143l-1.071,2.141-3.214,1.071V708.8l-4.286,1.07-1.071,2.142-4.285,1.07q-0.537,1.071-1.072,2.142l-6.428,2.141-1.071,2.142h-2.143v1.07H586.63v1.071h-2.142v1.071h-2.143v1.07H580.2v1.071H578.06v1.071h-2.143V727l-6.428,2.141v1.071l-5.357,1.07v1.071l-4.285,1.071v1.07h-3.214v1.071H554.49v1.071h-3.214v1.071h-2.143v1.07l-6.428,1.071v1.071h-2.143v1.07h-3.214v1.071h-3.214v1.071H530.92V745.2h-3.214v1.07h-4.285v1.071h-3.214v1.071h-3.214v1.07l-8.571,1.071v1.071l-8.571,1.07v1.071h-5.357c-6.9,2.119-16.432,3.309-23.569,5.354h-8.571v1.07h-9.642v1.071h-16.07v1.071c-5.553,1.544-30.134.1-34.284-1.071h-16.07v-1.071h-9.642l-37.5-6.424-40.711-11.778v-1.07H296.3v-1.071l-6.428-1.071v-1.07l-5.357-1.071v-1.071h-2.143v-1.071h-3.214v-1.07l-4.285-1.071V731.28h-2.143v-1.07h-3.214v-1.071L263.083,727v-1.071H260.94v-1.071H258.8v-1.071h-2.143v-1.07h-2.143v-1.071H252.37v-1.071h-2.143V719.5h-2.143l-1.071-2.142-6.428-2.141q-0.535-1.071-1.072-2.142h-2.142v-1.07h-2.143l-1.071-2.142-4.286-1.07-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143v-1.071l-3.214-1.07-1.071-2.142h-2.143l-2.143-3.212H206.3l-2.143-3.212h-2.143l-2.142-3.212h-2.143l-3.214-4.283h-2.143l-4.285-5.354h-2.143q-3.75-4.281-7.5-8.565H176.3l-7.5-8.566-12.856-11.778-1.071-3.212-7.5-6.424v-2.141l-5.356-4.283v-2.142l-4.286-3.212V624.21q-1.607-1.071-3.214-2.141v-2.142l-3.214-2.141v-2.142l-3.214-2.141v-2.141l-2.142-1.071q-0.537-1.606-1.072-3.212h-1.071v-2.142l-2.143-1.07v-2.142l-2.143-1.071v-2.141l-2.142-1.071V595.3l-2.143-1.071-1.071-4.283-2.143-1.07v-2.142h-1.071v-2.141l-2.143-1.071-2.143-6.424-2.142-1.071v-2.141h-1.072v-2.142h-1.071V569.6h-1.072v-2.141h-1.071v-2.142H99.167V563.18H98.1v-2.142H97.024l-2.143-6.424H93.81V551.4H92.739v-2.141H91.667L90.6,544.978H89.525v-3.212H88.453v-2.142H87.382v-3.212H86.311v-2.141H85.239l-1.071-6.424H83.1v-2.142H82.025l-1.071-6.424H79.883v-3.212H78.811v-3.212H77.74v-3.212H76.669L72.383,489.3c-3.308-9.882-4.5-22.748-7.5-33.192v-8.565H63.812v-9.637H62.741v-16.06H61.67c-1.545-5.549-.1-30.115,1.071-34.263v-16.06h1.071v-9.637h1.071v-8.565h1.071V346.9h1.071v-6.425H68.1l1.071-10.707H70.24v-5.353h1.071V320.13h1.071v-4.283h1.071v-4.283h1.071v-4.282H75.6l1.071-7.5H77.74v-3.213h1.071v-3.212h1.071V290.15h1.071l1.071-6.424H83.1v-2.141h1.071l1.071-6.425h1.071v-2.141h1.071v-3.212h1.071v-2.142h1.071v-3.212C128.367,177.9,192.54,113.747,279.153,74.939h3.214V73.868h2.143V72.8h3.214V71.727h2.143V70.656l6.428-1.071V68.515h2.143V67.444l40.711-11.778h5.357V54.6h4.285V53.525h6.428V52.454h6.428V51.383h6.428V50.313h8.571V49.242h9.642V48.171C391.214,46.773,399.1,50,402.358,47.1Zm-183.2,238.767c-1.7,2.943-2.647,1.924-3.214,6.425h1.071l1.071,4.282h1.072v2.142h1.071v2.141H221.3V303h1.071v2.141l2.143,1.071,1.071,4.283h1.071v2.141h1.072v2.141H228.8v2.142h1.071v2.141h1.072l1.071,4.283h1.071q0.535,2.142,1.072,4.283h1.071l2.143,6.424h1.071l1.071,4.283h1.072l1.071,4.283h1.071v2.141H243.8V346.9h1.071v2.141h1.072v2.141h1.071v2.142h1.071v2.141h1.072v2.142h1.071v2.141H251.3v2.141l2.143,1.071,1.071,4.283h1.072v2.141h1.071v2.142h1.071v2.141H258.8v2.142h1.071v2.141h1.071q0.536,2.141,1.072,4.283h1.071v2.141h1.071v2.142h1.072v2.141H266.3V390.8h1.072v2.142h1.071l1.071,4.283h1.072l1.071,4.282h1.071v2.142H273.8v2.141h1.071v2.142h1.071v2.141h1.072v2.142h1.071l2.143,6.424,2.142,1.07v2.142h1.072v7.5c-8.861,4.574-34.053,2.216-47.14,2.141a8,8,0,0,1-2.142,3.212c0.614,2.152-.129.927,1.071,2.142,2.135,3.422,5.233,4.163,8.571,6.424l1.071,2.141h2.143q1.071,1.607,2.143,3.212H251.3l1.072,2.142h2.142l1.072,2.141,3.214,1.071,2.142,3.212h2.143l1.071,2.142H266.3l2.143,3.212h2.143l1.071,2.141H273.8l2.142,3.212h2.143l1.071,2.142H281.3l2.143,3.212h2.142q0.537,1.07,1.072,2.141H288.8l2.143,3.212h2.143l1.071,2.142H296.3l2.143,3.212h2.142l1.072,2.141h2.142l2.143,3.212h2.143l1.071,2.142h2.143l2.142,3.212h2.143l1.072,2.141h2.142l1.072,2.142,3.214,1.07,2.142,3.212h2.143l1.071,2.142h2.143l2.143,3.212h2.142l1.072,2.141h2.143l2.142,3.212h2.143l1.071,2.142h2.143l2.143,3.212h2.142l1.072,2.141h2.142l2.143,3.212h2.143l1.071,2.142h2.143l2.143,3.212h2.142q0.536,1.071,1.072,2.141h2.142l2.143,3.213h2.143l1.071,2.141h2.143l2.142,3.212h2.143l1.071,2.141h2.143l2.143,3.213h2.143l1.071,2.141h2.143l2.142,3.212h2.143L397,554.614h2.142l1.072,2.142h2.142q1.072,1.605,2.143,3.212h2.143l1.071,2.141h2.143q1.071,1.606,2.143,3.212c2.894,2.006,5.107,2.9,9.642,3.212,1.148-1.329,1.9-1.126,3.214-2.141v-1.071H427q1.072-1.605,2.143-3.212h2.143l2.143-3.212h2.142q0.536-1.071,1.072-2.141h2.142l2.143-3.213h2.143l1.071-2.141h2.143l2.142-3.212h2.143l1.071-2.141h2.143l2.143-3.213h2.143l1.071-2.141h2.143l2.142-3.212h2.143l1.071-2.141h2.143l2.143-3.213h2.142q0.537-1.069,1.072-2.141h2.142l2.143-3.212h2.143l1.071-2.142h2.143l2.143-3.212h2.142l1.072-2.141h2.142l2.143-3.212h2.143l1.071-2.142h2.143l1.071-2.141,3.214-1.071,2.143-3.212h2.143l1.071-2.141h2.143l2.142-3.212h2.143l1.071-2.142h2.143l2.143-3.212h2.142l1.072-2.141h2.143l2.142-3.212h2.143l1.071-2.142h2.143l2.143-3.212h2.142l1.072-2.141h2.142l2.143-3.212h2.143l1.071-2.142h2.143l2.143-3.212h2.142q0.535-1.071,1.072-2.141h2.142l2.143-3.212h2.143l1.071-2.142h2.143l2.142-3.212h2.143l1.071-2.141h2.143l1.071-2.142,3.215-1.07,2.142-3.213h2.143l1.071-2.141h2.143l2.143-3.212h2.142l1.072-2.142h2.142q1.072-1.6,2.143-3.212h2.143l1.071-2.141c3.911-2.656,8.246-3.315,9.642-8.566h-1.071v-2.141c-1.383-2-8.536-1.068-11.785-1.071H557.7a14.239,14.239,0,0,0-3.214-4.283c0.931-5.717,4.049-9.737,6.428-13.919V411.14l2.143-1.071,1.071-4.283H565.2v-2.141h1.072V401.5h1.071v-2.141h1.071v-2.141h1.072l1.071-4.283h1.071V390.8H572.7v-2.141h1.071v-2.141h1.072v-2.142h1.071v-2.141h1.071v-2.142h1.072l1.071-4.282H580.2q0.535-2.142,1.072-4.283h1.071l1.071-4.283h1.072V365.1h1.071v-2.142h1.071v-2.141H587.7v-2.142h1.071l1.071-4.283,2.143-1.07,1.071-4.283h1.072V346.9H595.2v-2.142h1.072v-2.141h1.071v-2.142h1.071v-2.141h1.072l1.071-4.283h1.071v-2.141H602.7v-2.142h1.071v-2.141h1.071v-2.142h1.072v-2.141h1.071l1.071-4.283h1.072l1.071-4.283h1.071v-2.141h1.072v-2.141h1.071v-2.142h1.071v-2.141h1.072l2.142-6.424,2.143-1.071,3.214-9.636c-2.8-1.48-1.814-1.894-6.428-2.142L452.712,395.079c-4.319,4.325-5.514,10.331-8.571,16.061H443.07l-2.143,6.424h-1.071q-0.535,2.142-1.072,4.283h-1.071l-1.071,4.283H435.57v2.141H434.5v2.141h-1.071v2.142h-1.072V434.7h-1.071v2.142h-1.072c-1.624,3.037-5.137,13.8-7.5,14.99h-6.428l-6.428-10.707v-2.142h-1.071q-0.537-2.141-1.072-4.283h-1.071q-0.536-2.141-1.072-4.283H404.5q-1.071-3.211-2.143-6.424h-1.071v-2.141h-1.071v-2.142h-1.072v-2.141h-1.071v-2.141H397l-7.5-17.132-5.357-4.282-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.142H374.5l-1.071-2.141-4.285-1.071-1.072-2.141h-2.142q-0.537-1.071-1.072-2.142h-2.142q-0.537-1.07-1.072-2.141H359.5l-1.071-2.141H356.29l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.141H340.22l-1.071-2.142h-2.143l-1.071-2.141-4.286-1.071-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.142h-2.143l-1.071-2.141-4.286-1.071L296.3,335.12h-2.143l-1.071-2.142h-2.143l-1.071-2.141h-2.143l-1.071-2.141H284.51l-1.071-2.142H281.3l-1.071-2.141h-2.143l-1.071-2.142h-2.143L273.8,320.13h-2.143l-1.071-2.141H268.44l-1.071-2.142-4.286-1.071v-1.07l-3.214-1.071-1.071-2.141h-2.143l-1.071-2.142h-2.143v-1.07l-3.214-1.071-1.071-2.142h-2.143l-1.071-2.141H243.8q-0.535-1.071-1.072-2.141h-2.142q-0.535-1.071-1.072-2.142h-2.142L236.3,295.5h-2.142l-1.072-2.142Z",
              })
            );
          }

          Balance(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 839 810",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M416.2,37.5h6.6v1.1c4.913,1.33,6.782,5.682,9.9,8.8l18.7,18.705,14.3,13.2,57.215,58.316L700.076,313.675,787,401.7v6.6q-90.765,91.315-181.549,182.65Q514.134,681.716,422.8,772.5h-6.6q-91.315-90.765-182.65-181.549Q142.784,499.634,52,408.3v-6.6q90.765-91.315,181.549-182.65Q324.866,128.284,416.2,37.5ZM212.644,312.575c-1.2,2.286-1.773,1.948-2.2,5.5h1.1l1.1,4.4h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2l2.2,1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1q1.1,3.3,2.2,6.6h1.1l1.1,4.4h1.1q0.55,2.2,1.1,4.4h1.1q0.549,2.2,1.1,4.4h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1V394h1.1v2.2l2.2,1.1v2.2h1.1v2.2h1.1v2.2h1.1l1.1,4.4h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1l1.1,4.4h1.1q0.55,2.2,1.1,4.4h1.1v2.2h1.1v2.2h1.1v2.2h1.1v2.2h1.1q0.55,2.2,1.1,4.4h1.1l1.1,4.4h1.1v2.2h1.1c1.784,3.368,2.068,5.9,2.2,11-9.1,4.7-34.973,2.277-48.413,2.2a8.239,8.239,0,0,1-2.2,3.3c0.631,2.211-.132.952,1.1,2.2,2.578,4.22,4.973,3.933,8.8,6.6l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2l2.2,3.3h2.2q0.549,1.1,1.1,2.2h2.2l2.2,3.3h2.2q0.549,1.1,1.1,2.2h2.2l2.2,3.3h2.2q0.549,1.1,1.1,2.2h2.2q1.1,1.651,2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2q1.1,1.651,2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l1.1,2.2,3.3,1.1,2.2,3.3h2.2q0.549,1.1,1.1,2.2h2.2l2.2,3.3h2.2q0.549,1.1,1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2q1.1,1.65,2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2q1.1,1.651,2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2l2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2l2.2,3.3h2.2q0.55,1.1,1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3h2.2l1.1,2.2h2.2l2.2,3.3c2.5,1.768,4.739,2.106,6.6,4.4l3.3-1.1v-1.1h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2q0.549-1.1,1.1-2.2h2.2l2.2-3.3h2.2q0.549-1.1,1.1-2.2h2.2q1.1-1.65,2.2-3.3h2.2q0.549-1.1,1.1-2.2h2.2q1.1-1.651,2.2-3.3h2.2l1.1-2.2h2.2q0.549-1.1,1.1-2.2l3.3-1.1,2.2-3.3h2.2q0.551-1.1,1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2q0.549-1.1,1.1-2.2h2.2q1.1-1.65,2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2q1.1-1.65,2.2-3.3h2.2q0.551-1.1,1.1-2.2h2.2l1.1-2.2,3.3-1.1,2.2-3.3h2.2q0.55-1.1,1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3h2.2l1.1-2.2h2.2l2.2-3.3c4.226-2.954,8.354-2.914,9.9-8.8h-1.1v-2.2c-1.42-2.057-8.766-1.1-12.1-1.1H561.439a14.665,14.665,0,0,0-3.3-4.4q1.65-4.951,3.3-9.9l2.2-1.1q1.1-3.3,2.2-6.6h1.1q0.55-2.2,1.1-4.4h1.1q0.549-2.2,1.1-4.4h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1l7.7-17.6,2.2-1.1q1.1-3.3,2.2-6.6h1.1q0.55-2.2,1.1-4.4h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1l1.1-4.4h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1l1.1-4.4h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1v-2.2h1.1q0.55-2.2,1.1-4.4l2.2-1.1q0.55-2.2,1.1-4.4c2.089-3.875,4.83-6.543,5.5-12.1-2.874-1.52-1.863-1.946-6.6-2.2-3.179,3.655-7.951,4.934-12.1,7.7l-1.1,2.2-3.3,1.1v1.1l-4.4,1.1q-0.549,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2v1.1l-3.3,1.1q-0.551,1.1-1.1,2.2h-2.2q-0.55,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2q-0.549,1.1-1.1,2.2l-4.4,1.1-1.1,2.2h-2.2v1.1l-3.3,1.1q-0.551,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2v1.1l-3.3,1.1q-0.549,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2q-0.55,1.1-1.1,2.2l-4.4,1.1-1.1,2.2h-2.2q-0.549,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2q-0.55,1.1-1.1,2.2h-2.2q-0.551,1.1-1.1,2.2h-2.2q-0.55,1.1-1.1,2.2h-2.2q-0.551,1.1-1.1,2.2h-2.2l-1.1,2.2-4.4,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2q-0.55,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2l-1.1,2.2h-2.2q-0.549,1.1-1.1,2.2h-2.2q-0.549,1.1-1.1,2.2h-2.2q-0.549,1.1-1.1,2.2h-2.2l-1.1,2.2h-2.2v1.1l-3.3,1.1-1.1,2.2h-2.2q-3.3,3.852-6.6,7.7v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1q-1.1,3.3-2.2,6.6h-1.1q-0.549,2.2-1.1,4.4h-1.1l-1.1,4.4h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2h-1.1v2.2H425v2.2h-1.1l-1.1,2.2h-2.2v1.1c-2.211-.631-0.952.132-2.2-1.1-6.2-1.729-7.088-10.115-9.9-15.4h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2H403v-2.2h-1.1q-0.55-2.2-1.1-4.4h-1.1l-1.1-4.4h-1.1q-1.1-3.3-2.2-6.6h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2h-1.1v-2.2l-4.4-3.3-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2q-0.551-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2-4.4-1.1-1.1-2.2h-2.2q-0.551-1.1-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.551-1.1-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2l-4.4-1.1q-0.549-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2q-0.551-1.1-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2l-4.4-1.1v-1.1l-3.3-1.1q-0.551-1.1-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2l-1.1-2.2h-2.2q-0.55-1.1-1.1-2.2l-4.4-1.1-1.1-2.2h-2.2q-0.549-1.1-1.1-2.2h-2.2C222.169,317.092,220.507,313.1,212.644,312.575Z",
              })
            );
          }

          Hypesquad(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 839 810",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M107.183,180.984v3.537h5.3c1.82,7.155.783,2.233,5.3,5.3v1.768c2.327,1.619,3.128,1.393,7.069,1.768V196.9h5.3v3.536h5.3v3.536a20.577,20.577,0,0,1,8.837,3.536v1.768h5.3l1.767,3.536c4.521,3.2,3.341-1.936,5.3,5.3h5.3v3.536c3.963,0.463,4.681.154,7.07,1.768v1.768h3.534q0.883,1.769,1.768,3.536h3.534q0.883,1.769,1.768,3.536h5.3v3.537h5.3v3.536h5.3v3.536c5.556,2.537,8.849,5.624,15.905,7.072v3.536h5.3v3.536h5.3c3.677,5.444,10.276,5.188,12.372,12.376h5.3v3.536c3.963,0.463,4.68.154,7.069,1.768v1.768h3.535l1.767,3.536h3.535l1.767,3.536h5.3v3.537l8.837,1.768v3.536h5.3l1.767,5.3h5.3v3.536h5.3v3.536h5.3v3.536h5.3v3.536h5.3c3.676,5.444,10.275,5.188,12.371,12.376,3.966,0.46,4.677.158,7.069,1.768v1.768H328.1l1.767,3.536h5.3v1.768c3.3,2.366,3.414,2.743,8.837,3.537v3.536h5.3v3.536h5.3v3.536l12.371,8.84q0.884,4.419,1.768,8.84h1.767V368.4h1.767q0.883,4.421,1.768,8.84h1.767v3.536h1.767v3.536l3.535,1.769v3.536h1.767v3.536h1.767q1.768,5.3,3.535,10.608h1.767q0.883,4.419,1.768,8.84l3.534,1.768v5.3l3.535,1.768v5.3l14.139,22.985h15.906c3.53-8.057,9.44-16.633,10.6-26.521h3.534c1.371-6.2,4.645-9.566,7.07-14.144v-3.536h1.767l1.767-8.84,3.535-1.768v-5.3l3.535-1.768V382.54h1.767V379l3.534-1.768V373.7h1.768v-3.536h1.767v-3.536h1.767q0.885-4.419,1.768-8.84l3.534-1.768v-3.536l5.3-3.536V347.18h3.535l1.767-3.536,5.3-1.768v-1.768l7.07-1.768L501.3,334.8h3.535l1.767-3.536h3.535l1.767-3.536h3.535v-1.768l5.3-1.768,1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.534q0.885-1.768,1.768-3.536h3.534q0.885-1.768,1.768-3.536h3.534q0.883-1.768,1.768-3.536h3.534l1.768-3.536,7.069-1.769,1.767-3.536H587.9l1.767-3.536H593.2l1.767-3.536H598.5l1.767-3.536H603.8v-1.768l5.3-1.768,1.767-3.536h3.535v-1.768l5.3-1.768,1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.537h3.535l1.767-3.536,7.069-1.768v-1.768l5.3-1.768q0.884-1.767,1.768-3.536h3.534q0.884-1.767,1.768-3.536h3.534l1.768-3.536h3.534q0.883-1.769,1.768-3.536h3.534q0.883-1.769,1.768-3.536h3.534q0.883-1.769,1.768-3.536h3.534l1.768-3.536h3.534l1.768-3.536h3.534q0.884-1.769,1.768-3.536h3.534q0.883-1.769,1.768-3.536h3.534q0.883-1.768,1.768-3.537h3.534l1.767-3.536h3.535l1.767-3.536h3.535l1.767-3.536,7.07-1.768,1.767-3.536h3.535l1.767-3.536c4.36-2.855,7.078-3.234,14.139-3.536v1.768H777c-0.64,4.086-2.888,11.827-5.3,14.144-2.013,2.014-.006.7-3.535,1.768-1.256,15.012-12.272,20.625-14.138,35.361H750.49v7.072h-3.535q-1.767,5.3-3.534,10.608h-1.768v3.537h-1.767v5.3c-3.847,8.531-10.931,15.171-12.371,26.52H723.98v7.072l-5.3,1.768v7.072h-3.534c-3.155,16.342-14.273,25.883-17.674,42.433h-3.534c-1.239,6.227-4.7,9.584-7.07,14.145v3.536H685.1q-2.651,7.954-5.3,15.912H678.03v3.536c-3.265,6-4.481,2.431-5.3,12.376l-5.3,1.768c-0.5,9.8-2.162,6.586-5.3,12.377a46.282,46.282,0,0,0-5.3,19.448c3.491,2,4.132,2.5,5.3,7.072h81.3c0.191,4.167.526,4.487,1.767,7.072h-1.767c-2.267,3.9-15.61,13.463-21.208,14.144l-1.767,5.305h-5.3v3.536c-8.105,1.155-4.345,1.609-8.837,5.3v1.768h-5.3v3.536h-5.3c-1.278,4.884-.493,3.955-5.3,5.3-2.014,2.013-.006.7-3.535,1.768v3.536h-5.3c-3.553,5.292-1.479.735-5.3,3.536l-3.534,5.3-5.3,1.768v3.536h-5.3v1.768c-2.013,2.015-.7.007-1.768,3.536-10.5,1.245-9.33,7.369-19.44,8.841v3.536h-5.3l-1.767,5.3h-5.3q-0.883,2.652-1.768,5.3h-5.3l-1.767,5.3h-5.3v3.536h-5.3v1.768c-2.012,2.014-.7.006-1.767,3.536-4.329.533-10.342,2.942-12.372,5.3q-0.884,2.652-1.767,5.3h-5.3v3.536h-5.3v1.769c-2.012,2.014-.7.006-1.767,3.536-11.6,1.385-10.372,9.019-21.208,10.608v3.536h-5.3v3.536l-5.3,1.768-1.767,3.536a21,21,0,0,1-12.372,5.3l-1.767,5.3h-5.3v3.536c-8.1,1.155-4.344,1.609-8.837,5.3v1.768h-5.3V589.4h-5.3v1.768c-2.012,2.014-.7.006-1.767,3.536h-5.3v3.536H496v1.768c-2.012,2.014-.7.006-1.767,3.536h-5.3c-3.134,4.714-7.052,4.069-8.837,10.608-11.761,1.387-13.02,10.72-24.742,12.376q-0.885,2.652-1.768,5.3h-5.3v3.536c-8.1,1.155-4.344,1.61-8.836,5.3v1.768h-5.3q-0.884,2.65-1.768,5.3h-5.3v3.536c-9.554,1.732-8.532.143-17.673-1.768-1.669-3.185-2.447-2.784-3.535-7.072h-5.3c-3.133-4.714-7.051-4.069-8.836-10.609h-5.3V628.3c-5.32-.658-5.741-1.1-8.837-3.536v-1.768H374.05q-0.885-1.767-1.768-3.536c-3.461-2.929-6.772-4.517-12.371-5.3v-3.536c-3.284-1.691-6.853-3.956-8.837-7.072h-5.3l-1.767-5.3h-5.3v-3.536h-5.3l-1.767-5.3h-5.3v-3.537c-8.105-1.154-4.344-1.609-8.837-5.3v-1.768h-5.3v-3.536h-5.3v-1.768c-2.012-2.014-.7-0.006-1.767-3.536h-5.3v-1.768l-5.3-1.768-3.535-5.3-5.3-1.768v-3.536c-5.327-.655-5.731-1.112-8.836-3.536V550.5h-3.535l-1.767-3.536H268.01l-1.767-3.536c-3.467-2.931-6.77-4.513-12.372-5.3-1.3-5.688-2.4-6.439-8.836-7.073-1.82-7.155-.783-2.233-5.3-5.3v-1.768c-2.327-1.619-3.128-1.393-7.07-1.768l-1.767-5.3h-5.3v-3.536h-5.3v-1.768c-2.012-2.014-.7-0.006-1.767-3.536h-5.3V506.3c-2.013-2.014-.7-0.006-1.768-3.536h-5.3V501c-2.012-2.015-.7-0.007-1.767-3.536h-5.3v-3.536c-5.339-.661-5.712-1.12-8.836-3.536v-1.768h-3.535l-1.767-3.537h-5.3q-0.883-2.65-1.768-5.3h-5.3v-3.536l-5.3-1.768-1.767-3.536a21,21,0,0,0-12.371-5.3l-1.768-5.3h-5.3V456.8h-5.3l-3.534-7.072c-5.162-3.649-4.452,3.139-7.07-5.3h-5.3v-3.536h-5.3v-1.768c-2.012-2.015-.7-0.007-1.767-3.537h-5.3a26.534,26.534,0,0,0-8.836-8.84h-3.535c-1.674-1.171-3.246-5.42-5.3-7.072l1.767-5.3,56.555,1.768v-1.768h17.673V412.6l10.6-1.768a107.29,107.29,0,0,0-1.767-21.216l-5.3-1.768q-0.884-5.3-1.768-10.609H169.04q-3.535-9.723-7.07-19.448H160.2v-3.536h-1.767q-0.883-3.536-1.768-7.072H154.9l-1.767-8.84c-2.471-4.755-5.549-7.657-7.07-14.145H142.53c-0.462-9.766-2.159-6.617-5.3-12.376v-3.536c-3.425-6.375-7.672-10.282-8.837-19.448h-3.535q-2.65-7.956-5.3-15.913H116.02q-3.534-9.723-7.07-19.448h-1.767v-3.536h-1.767l-1.767-7.072h-1.768a37.806,37.806,0,0,1-5.3-15.913H93.045v-7.072H89.51v-7.072H85.975c-0.593-6.73-3.055-8.171-5.3-12.376l-3.535-10.608L73.6,188.057l-5.3-15.913H64.767L63,161.536c2.323-1.431,2.081-1.245,3.535-3.536,5.64,2.474,10.962,5.988,15.906,8.84h3.535l3.535,5.3,5.3,1.768,1.767,3.536h3.535v1.768C102.526,180.852,103.229,180.436,107.183,180.984Z",
              })
            );
          }

          Message(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 28 28",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M13.3483 2.68577C13.1302 2.57142 12.8698 2.57142 12.6517 2.68577L4.19881 7.11784C3.81186 7.32073 3.50078 7.62754 3.29257 7.99365L13 13.1507L22.7074 7.99366C22.4992 7.62754 22.1881 7.32073 21.8012 7.11784L13.3483 2.68577ZM3 17.75V9.53676L12.6482 14.6623C12.8682 14.7792 13.1319 14.7792 13.3519 14.6623L23 9.53677V17.75C23 19.5449 21.5449 21 19.75 21H6.25C4.45507 21 3 19.5449 3 17.75ZM6.01172 22C6.58925 22.9021 7.6002 23.5 8.75081 23.5H20.2508C23.1503 23.5 25.5008 21.1495 25.5008 18.25V10.75C25.5008 9.59941 24.9029 8.58846 24.0008 8.01093V18.25C24.0008 20.3211 22.3219 22 20.2508 22H6.01172Z",
              })
            );
          }

          Guilds(width, height) {
            return React.createElement(
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
                d: "M7.5 2C6.11929 2 5 3.11929 5 4.5V15.5C5 16.8807 6.11929 18 7.5 18H12.5C13.8807 18 15 16.8807 15 15.5V4.5C15 3.11929 13.8807 2 12.5 2H7.5ZM7.5 5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H7.5C7.22386 6 7 5.77614 7 5.5C7 5.22386 7.22386 5 7.5 5ZM7 12.5C7 12.2239 7.22386 12 7.5 12H12.5C12.7761 12 13 12.2239 13 12.5C13 12.7761 12.7761 13 12.5 13H7.5C7.22386 13 7 12.7761 7 12.5ZM7 14.5C7 14.2239 7.22386 14 7.5 14H12.5C12.7761 14 13 14.2239 13 14.5C13 14.7761 12.7761 15 12.5 15H7.5C7.22386 15 7 14.7761 7 14.5ZM2 7C2 5.89543 2.89543 5 4 5V15.5C4 15.6698 4.01209 15.8367 4.03544 16H4C2.89543 16 2 15.1046 2 14V7ZM16 15.5C16 15.6698 15.9879 15.8367 15.9646 16H16C17.1046 16 18 15.1046 18 14V7C18 5.89543 17.1046 5 16 5V15.5Z",
              })
            );
          }

          DMs(width, height) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 28 28",
                width,
                height,
              },
              React.createElement("path", {
                style: {
                  fill: "currentColor",
                },
                d: "M17.75 18C18.7165 18 19.5 18.7835 19.5 19.75V21.752L19.4921 21.8604C19.1814 23.9866 17.2715 25.009 14.0668 25.009C10.8736 25.009 8.9333 23.9983 8.51446 21.8966L8.5 21.75V19.75C8.5 18.7835 9.2835 18 10.25 18H17.75ZM18.2439 11.9999L24.25 12C25.2165 12 26 12.7835 26 13.75V15.752L25.9921 15.8604C25.6814 17.9866 23.7715 19.009 20.5668 19.009L20.3986 19.0074C20.09 17.9045 19.111 17.0816 17.9288 17.0057L17.75 17L16.8278 17.0007C17.8478 16.1758 18.5 14.914 18.5 13.5C18.5 12.974 18.4098 12.4691 18.2439 11.9999ZM3.75 12L9.75609 11.9999C9.59024 12.4691 9.5 12.974 9.5 13.5C9.5 14.8309 10.0777 16.0268 10.9961 16.8507L11.1722 17.0007L10.25 17C8.9878 17 7.9242 17.8504 7.60087 19.0094L7.56679 19.009C4.37361 19.009 2.4333 17.9983 2.01446 15.8966L2 15.75V13.75C2 12.7835 2.7835 12 3.75 12ZM14 10C15.933 10 17.5 11.567 17.5 13.5C17.5 15.433 15.933 17 14 17C12.067 17 10.5 15.433 10.5 13.5C10.5 11.567 12.067 10 14 10ZM20.5 4C22.433 4 24 5.567 24 7.5C24 9.433 22.433 11 20.5 11C18.567 11 17 9.433 17 7.5C17 5.567 18.567 4 20.5 4ZM7.5 4C9.433 4 11 5.567 11 7.5C11 9.433 9.433 11 7.5 11C5.567 11 4 9.433 4 7.5C4 5.567 5.567 4 7.5 4Z",
              })
            );
          }

          Eye(width, height) {
            return React.createElement(
              "svg",
              {
                width,
                height,
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                fill: "currentColor",
                d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z",
              }),
              React.createElement("path", {
                fill: "currentColor",
                d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z",
              })
            );
          }

          Auth(width, height) {
            return React.createElement(
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
                d: "M6.25 4.5C7.2165 4.5 8 5.2835 8 6.25V8H6.25C5.2835 8 4.5 7.2165 4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5ZM9.5 8V6.25C9.5 4.45507 8.04493 3 6.25 3C4.45507 3 3 4.45507 3 6.25C3 8.04493 4.45507 9.5 6.25 9.5H8V14.5H6.25C4.45507 14.5 3 15.9551 3 17.75C3 19.5449 4.45507 21 6.25 21C8.04493 21 9.5 19.5449 9.5 17.75V16H14.5V17.75C14.5 19.5449 15.9551 21 17.75 21C19.5449 21 21 19.5449 21 17.75C21 15.9551 19.5449 14.5 17.75 14.5H16V9.5H17.75C19.5449 9.5 21 8.04493 21 6.25C21 4.45507 19.5449 3 17.75 3C15.9551 3 14.5 4.45507 14.5 6.25V8H9.5ZM9.5 9.5H14.5V14.5H9.5V9.5ZM16 8V6.25C16 5.2835 16.7835 4.5 17.75 4.5C18.7165 4.5 19.5 5.2835 19.5 6.25C19.5 7.2165 18.7165 8 17.75 8H16ZM16 16H17.75C18.7165 16 19.5 16.7835 19.5 17.75C19.5 18.7165 18.7165 19.5 17.75 19.5C16.7835 19.5 16 18.7165 16 17.75V16ZM8 16V17.75C8 18.7165 7.2165 19.5 6.25 19.5C5.2835 19.5 4.5 18.7165 4.5 17.75C4.5 16.7835 5.2835 16 6.25 16H8Z",
              })
            );
          }

          CallJoin(width, height) {
            return React.createElement(
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
                d: "M11 5V3C16.515 3 21 7.486 21 13H19C19 8.589 15.411 5 11 5ZM17 13H15C15 10.795 13.206 9 11 9V7C14.309 7 17 9.691 17 13ZM11 11V13H13C13 11.896 12.105 11 11 11ZM14 16H18C18.553 16 19 16.447 19 17V21C19 21.553 18.553 22 18 22H13C6.925 22 2 17.075 2 11V6C2 5.447 2.448 5 3 5H7C7.553 5 8 5.447 8 6V10C8 10.553 7.553 11 7 11H6C6.063 14.938 9 18 13 18V17C13 16.447 13.447 16 14 16Z",
              })
            );
          }

          QueueAdd(width, height) {
            return React.createElement(
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
                d: "M3.5 14.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4 .5h3.998a6.464 6.464 0 0 0-.48 2H7.5a1 1 0 0 1-.116-1.993L7.5 15Zm0-4h13.503l.117-.007A1 1 0 0 0 21.003 9H7.5l-.116.007A1 1 0 0 0 7.5 11Zm-4-2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-5.992a1.5 1.5 0 1 1 0 2.999 1.5 1.5 0 0 1 0-3ZM7.5 3h13.503a1 1 0 0 1 .117 1.993l-.117.007H7.5a1 1 0 0 1-.116-1.993L7.5 3ZM23 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-5 .5.001 2.503a.5.5 0 1 1-1 0V18h-2.505a.5.5 0 0 1 0-1H17v-2.5a.5.5 0 1 1 1 0V17h2.497a.5.5 0 0 1 0 1H18Z",
              })
            );
          }

          Play(width, height) {
            return React.createElement(
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
                d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.856-3.845A1.25 1.25 0 0 0 9 9.248v5.504a1.25 1.25 0 0 0 1.856 1.093l5.757-3.189a.75.75 0 0 0 0-1.312l-5.757-3.189Z",
              })
            );
          }

          ResizeFont(width, height) {
            return React.createElement(
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
                d: "m9.97 16.168 4.59-12.512c.306-.834 1.446-.872 1.828-.114l.05.114 5.5 14.997a1 1 0 0 1-1.83.796l-.047-.107-1.41-3.843h-6.306l-1.441 3.92-.041.078-.072.108-.078.09-.085.078-.082.06-.05.031-.085.043-.104.04-.104.029-.133.019-.108.002-.07-.005-.103-.017-.15-.044-.07-.03-.1-.054-.11-.08-.093-.087-.064-.075-.06-.09-.055-.103-.745-1.912H4.655l-.723 1.86a1 1 0 0 1-1.184.605l-.11-.036a1 1 0 0 1-.606-1.183l.036-.111 3.498-8.996c.315-.81 1.421-.849 1.811-.116l.053.116 2.54 6.529 4.59-12.512-4.59 12.511ZM6.498 12.76 5.433 15.5h2.13l-1.065-2.74Zm9-5.856-2.42 6.595h4.838l-2.418-6.595Z ",
              })
            );
          }

          MassCopy(width, height) {
            return React.createElement(
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
          }

          Disconnect(width, height) {
            return React.createElement(
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
          }

          Mute(width, height) {
            return React.createElement(
              "svg",
              {
                width,
                height,
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                d: "M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z",
                fill: "currentColor",
              })
            );
          }

          Unmute(width, height) {
            return React.createElement(
              "svg",
              {
                width,
                height,
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z",
                fill: "currentColor",
              })
            );
          }

          Deaf(width, height) {
            return React.createElement(
              "svg",
              {
                width,
                height,
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                d: "M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z",
                fill: "currentColor",
              }),
              React.createElement("path", {
                d: "M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z",
                fill: "currentColor",
              })
            );
          }

          Undeaf(width, height) {
            return React.createElement(
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
          }

          VC(width, height) {
            return React.createElement(
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
          }

          NoVC(width, height) {
            return React.createElement(
              "svg",
              {
                width,
                height,
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                fill: "currentColor",
                d: "M15 12C15 12.0007 15 12.0013 15 12.002C15 12.553 14.551 13.002 14 13.002V15.002C15.654 15.002 17 13.657 17 12.002C17 12.0013 17 12.0007 17 12H15ZM19 12C19 12.0007 19 12.0013 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 12.0013 21 12.0007 21 12H19ZM10.293 3.29604C10.579 3.01004 11.009 2.92504 11.383 3.07904C11.757 3.23204 12 3.59904 12 4.00204V20.002C12 20.407 11.757 20.772 11.383 20.927C11.009 21.082 10.579 20.996 10.293 20.71L6 16.002H3C2.45 16.002 2 15.552 2 15.002V9.00204C2 8.45304 2.45 8.00204 3 8.00204H6L10.293 3.29604Z",
              }),
              React.createElement("path", {
                fill: "currentColor",
                d: "M21.025 5V4C21.025 2.88 20.05 2 19 2C17.95 2 17 2.88 17 4V5C16.4477 5 16 5.44772 16 6V9C16 9.55228 16.4477 10 17 10H19H21C21.5523 10 22 9.55228 22 9V5.975C22 5.43652 21.5635 5 21.025 5ZM20 5H18V4C18 3.42857 18.4667 3 19 3C19.5333 3 20 3.42857 20 4V5Z",
              })
            );
          }
        })();

        const LibraryUtils = new (class LibraryUtils {
          regEscape(v) {
            return v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          }
          interleave(arr, thing) {
            return [].concat(...arr.map((n) => [n, thing])).slice(0, -1);
          }
          randomNo(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
          }
          get characterLimit() {
            const { DiscordConstants } = LibraryModules;
            return new RegExp(`.{1,${DiscordConstants.qhL}}`, "g");
          }
          FakeMessage(channelId, content, embeds) {
            const { TimestampUtils, DiscordConstants, UserStore } =
              LibraryModules;
            return {
              id: TimestampUtils.fromTimestamp(Date.now()),
              type: DiscordConstants.uaV.DEFAULT,
              flags: DiscordConstants.iLy.EPHEMERAL,
              content: content,
              channel_id: channelId,
              author: UserStore.getCurrentUser(),
              attachments: [],
              embeds: null != embeds ? embeds : [],
              pinned: false,
              mentions: [],
              mention_channels: [],
              mention_roles: [],
              mention_everyone: false,
              timestamp: new Date().toISOString(),
              state: DiscordConstants.yb.SENT,
              tts: false,
            };
          }
          capitalize(text) {
            return `${text[0].toUpperCase()}${text.slice(1)}`;
          }
          getLinks(message) {
            const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
            return message.match(urlRegex);
          }
          Sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }
          MakeSubModuleWriteable(mainModule, subModule) {
            let writeableSubModule = Object.assign(
              Object.create(Object.getPrototypeOf(mainModule?.[subModule])),
              mainModule?.[subModule]
            );
            Object.defineProperty(mainModule, subModule, {
              value: writeableSubModule,
              writable: true,
              configurable: true,
              enumerable: true,
            });
            return mainModule;
          }
          removeDuplicate(item, pos, self) {
            return self.indexOf(item) == pos;
          }
          ascending(a, b) {
            return a - b;
          }
          limit(value, min, max) {
            return Math.min(Math.max(value, min), max);
          }
        })();

        const LibraryRequires = new (class LibraryRequires {
          get request() {
            return require("request");
          }
          get fs() {
            return require("fs");
          }
          get path() {
            return require("path");
          }
          get events() {
            return require("events");
          }
          get electron() {
            return require("electron");
          }
        })();

        const ReactUtils = new (class ReactUtils {
          forceUpdate(element) {
            if (!element) return;
            const toForceUpdate = ReactTools.getOwnerInstance(element);
            const forceRerender = Patcher.instead(
              toForceUpdate,
              "render",
              () => {
                forceRerender();
                return null;
              }
            );
            toForceUpdate.forceUpdate(() =>
              toForceUpdate.forceUpdate(() => {})
            );
          }

          addStyle(component, style) {
            if (!component || !style) return;
            component.props.style = component.props.style
              ? { ...component.props.style, ...style }
              : style;
            return component;
          }

          addChilds(component, childrens) {
            if (!component || !childrens) return;
            if (!Array.isArray(component.props.children))
              component.props.children = [component.props.children];
            if (Array.isArray(childrens))
              component.props.children.push(...childrens);
            else component.props.children.push(childrens);
            return component;
          }
          stringify(component) {
            return JSON.stringify(component, (_, symbol) =>
              typeof symbol === "symbol"
                ? `$$Symbol:${Symbol.keyFor(symbol)}`
                : symbol
            );
          }
          prase(component) {
            return JSON.parse(component, (_, symbol) => {
              const matches = symbol?.match?.(/^\$\$Symbol:(.*)$/);
              return matches ? Symbol.for(matches[1]) : symbol;
            });
          }
          getHtml(component) {
            const div = document.createElement("div");
            ReactDOM.render(component, div);
            return div.firstChild;
          }
        })();

        const Settings = new (class Settings {
          get ImagePicker() {
            class ClearButton extends React.Component {
              render() {
                const size = this.props.size || "16px";
                return React.createElement(
                  "svg",
                  {
                    className: this.props.className || "",
                    fill: "currentColor",
                    viewBox: "0 0 24 24",
                    style: {
                      width: size,
                      height: size,
                      padding: "0.5rem",
                      borderRadius: "0.3rem",
                      cursor: "pointer",
                      marginLeft: "70%",
                      marginRight: "auto",
                      marginTop: "1rem",
                    },
                    onClick: this.props.onClick,
                  },
                  React.createElement("path", {
                    d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z",
                  })
                );
              }
            }
            class ImagePickerWrapper extends React.Component {
              constructor(props) {
                super(props);
                this.state = { img: this.props.file };
              }
              clear() {
                this.setState({ img: "" });
                this.props.onFileChange("");
              }
              getBase64(url) {
                return new Promise(async (resolve) => {
                  const data = await fetch(url);
                  const blob = await data.blob();
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    resolve(reader.result);
                  };
                });
              }
              render() {
                return React.createElement(
                  "div",
                  { style: { color: "white" } },
                  this.state.img
                    ? React.createElement(ClearButton, {
                        className: "image-clear",
                        onClick: this.clear.bind(this),
                      })
                    : "",
                  React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                      ref: "file",
                      id: "actual-btn",
                      type: "file",
                      multiple: "false",
                      accept: "image/png, image/jpeg, image/webp,",
                      onChange: async (e) => {
                        const file = e.target.files[0];
                        if (file.size / 1024 > 200)
                          return Toasts.show(`File Must be under 200kb.`, {
                            icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                            timeout: 5000,
                            type: "error",
                          });
                        const url = URL.createObjectURL(file);
                        const base64 = await this.getBase64(url);
                        this.props.onFileChange(base64);
                        this.setState({ img: base64 });
                      },
                      style: {
                        display: "none",
                      },
                    }),
                    React.createElement(
                      "label",
                      {
                        for: "actual-btn",
                        style: {
                          padding: "0.5rem",
                          borderRadius: "0.3rem",
                          cursor: "pointer",
                          marginLeft: "25%",
                          marginRight: "auto",
                          marginTop: "1rem",
                        },
                      },
                      this.state.img
                        ? React.createElement("img", {
                            src: this.state.img,
                            style: {
                              maxWidth: "250px",
                              maxHeight: "250px",
                            },
                          })
                        : React.createElement(  
                            "svg",
                            {
                              width: "250",
                              height: "250",
                              viewBox: "0 0 24 24",
                              fill: "currentColor",
                            },
                            React.createElement("path", {
                              d: "M18.75 4C20.5449 4 22 5.45507 22 7.25V18.75C22 20.5449 20.5449 22 18.75 22H7.25C5.45507 22 4 20.5449 4 18.75V12.5019C4.47425 12.6996 4.97687 12.8428 5.50009 12.9236L5.5 18.75C5.5 18.9584 5.53643 19.1583 5.60326 19.3437L11.4258 13.643C12.2589 12.8273 13.5675 12.7885 14.4458 13.5266L14.5742 13.6431L20.3964 19.3447C20.4634 19.159 20.5 18.9588 20.5 18.75V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5L12.9236 5.50009C12.8428 4.97687 12.6996 4.47425 12.5019 4H18.75ZM12.5588 14.644L12.4752 14.7148L6.66845 20.4011C6.8504 20.4651 7.04613 20.5 7.25 20.5H18.75C18.9535 20.5 19.1489 20.4653 19.3305 20.4014L13.5247 14.7148C13.2596 14.4553 12.8501 14.4316 12.5588 14.644ZM16.2521 7.5C17.4959 7.5 18.5042 8.50831 18.5042 9.75212C18.5042 10.9959 17.4959 12.0042 16.2521 12.0042C15.0083 12.0042 14 10.9959 14 9.75212C14 8.50831 15.0083 7.5 16.2521 7.5ZM6.5 1C9.53757 1 12 3.46243 12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1ZM16.2521 9C15.8367 9 15.5 9.33673 15.5 9.75212C15.5 10.1675 15.8367 10.5042 16.2521 10.5042C16.6675 10.5042 17.0042 10.1675 17.0042 9.75212C17.0042 9.33673 16.6675 9 16.2521 9ZM6.5 2.99923L6.41012 3.00729C6.20603 3.04433 6.0451 3.20527 6.00806 3.40936L6 3.49923L5.99965 5.99923L3.49765 6L3.40777 6.00806C3.20368 6.0451 3.04275 6.20603 3.00571 6.41012L2.99765 6.5L3.00571 6.58988C3.04275 6.79397 3.20368 6.9549 3.40777 6.99194L3.49765 7L6.00065 6.99923L6.00111 9.50348L6.00916 9.59336C6.04621 9.79745 6.20714 9.95839 6.41123 9.99543L6.50111 10.0035L6.59098 9.99543C6.79508 9.95839 6.95601 9.79745 6.99305 9.59336L7.00111 9.50348L7.00065 6.99923L9.50457 7L9.59444 6.99194C9.79853 6.9549 9.95947 6.79397 9.99651 6.58988L10.0046 6.5L9.99651 6.41012C9.95947 6.20603 9.79853 6.0451 9.59444 6.00806L9.50457 6L6.99965 5.99923L7 3.49923L6.99194 3.40936C6.9549 3.20527 6.79397 3.04433 6.58988 3.00729L6.5 2.99923Z",
                            })
                          ),
                      React.createElement(
                        "div",
                        {
                          for: "actual-btn",
                          style: {
                            color: "white",
                            padding: "0.5rem",
                            borderRadius: "0.3rem",
                            cursor: "pointer",
                            marginLeft: this.state.img ? "38%" : "42%",
                            marginRight: "auto",
                            marginTop: "1rem",
                          },
                        },
                        this.state.img ? "Change Image" : "Add Image"
                      )
                    )
                  )
                );
              }
            }
            return class ImagePicker extends SettingField {
              constructor(name, note, value, onChange, options = {}) {
                const { disabled = false } = options;
                super(name, note, onChange, ImagePickerWrapper, {
                  disabled: disabled,
                  file: value,
                  onFileChange: (e) => {
                    this.onChange(e);
                  },
                  onChange: () => null,
                });
              }
            };
          }

          get Keybind() {
            class CloseButton extends React.Component {
              render() {
                const size = this.props.size || "16px";
                return React.createElement(
                  "svg",
                  {
                    className: this.props.className || "",
                    fill: "currentColor",
                    viewBox: "0 0 24 24",
                    style: { width: size, height: size },
                    onClick: this.props.onClick,
                  },
                  React.createElement("path", {
                    d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z",
                  })
                );
              }
            }

            class ClearableKeybind extends React.Component {
              constructor(props) {
                super(props);

                this.state = { value: this.props.defaultValue };
                this.clear = this.clear.bind(this);
              }

              clear() {
                this.setState({ value: [] });
                this.props.onChange([]);
              }

              render() {
                return React.createElement(
                  "div",
                  { className: "z-keybind-wrapper" },
                  React.createElement(Keybind, {
                    disabled: this.props.disabled,
                    defaultValue: this.state.value,
                    onChange: this.props.onChange,
                  }),
                  React.createElement(CloseButton, {
                    className: "z-keybind-clear",
                    onClick: this.clear,
                  })
                );
              }
            }

            return class Keybind extends SettingField {
              constructor(label, help, value, onChange, options = {}) {
                const { disabled = false } = options;
                super(label, help, onChange, ClearableKeybind, {
                  disabled: disabled,
                  defaultValue: value,
                  onChange: (element) => (val) => {
                    if (!Array.isArray(val)) return;
                    element.props.value = val;
                    this.onChange(val);
                  },
                });
              }
            };
          }

          get IconSwitch() {
            class IconSwitchWrapper extends React.Component {
              constructor(props) {
                super(props);
                this.state = { enabled: this.props.value };
              }
              render() {
                return React.createElement(
                  SwitchRow,
                  Object.assign({}, this.props, {
                    value: this.state.enabled,
                    onChange: (e) => {
                      this.props.onChange(e);
                      this.setState({ enabled: e });
                    },
                  }),
                  React.createElement(
                    "div",
                    { className: "img-switch-wrapper" },
                    this.props.icon &&
                      React.createElement("img", {
                        src: this.props.icon,
                        width: 32,
                        height: 32,
                        style: {
                          borderRadius: "360px",
                        },
                      }),
                    React.createElement(
                      "div",
                      {
                        style: this.props.icon
                          ? {
                              display: "inline",
                              fontSize: "22px",
                              position: "relative",
                              bottom: "7.5px",
                              left: "2.5px",
                            }
                          : {},
                      },
                      this.props.children
                    )
                  )
                );
              }
            }
            return class IconSwitch extends SettingField {
              constructor(name, note, isChecked, onChange, options = {}) {
                super(name, note, onChange);
                this.disabled = !!options.disabled;
                this.icon = options.icon;
                this.value = !!isChecked;
              }
              onAdded() {
                ReactDOM.render(
                  React.createElement(IconSwitchWrapper, {
                    icon: this.icon,
                    children: this.name,
                    note: this.note,
                    disabled: this.disabled,
                    hideBorder: false,
                    value: this.value,
                    onChange: (e) => {
                      this.onChange(e);
                    },
                  }),
                  this.getElement()
                );
              }
            };
          }

          get Buttons() {
            class ButtonsWrapper extends React.Component {
              constructor(props) {
                super(props);
              }
              render() {
                return React.createElement(
                  FlexChild,
                  {
                    grow: 0,
                    direction: FlexChild.Direction.HORIZONTAL,
                  },
                  ...this.props.buttons.map((data) =>
                    React.createElement(
                      ButtonData,
                      {
                        size: ButtonData.Sizes.LARGE,
                        style: {
                          marginRight: 20,
                        },
                        onClick: data.onClick,
                      },
                      data.text
                    )
                  )
                );
              }
            }
            return class Buttons extends SettingField {
              constructor(name, note, buttonArray) {
                const NOOP = () => null;
                super(name, note, NOOP, ButtonsWrapper, {
                  buttons: buttonArray,
                });
              }
            };
          }
        })();
        const HomeButtonContextMenuApi = new (class HomeButtonContextMenuApi {
          constructor() {
            this.items = new Map();
            this.#patchHomeButton();
          }
          #patchHomeButton() {
            const { GuildNav, NavBarClasses } = LibraryModules;
            Patcher.after(GuildNav, "type", (_, args, res) => {
              const HomeButtonContextMenuItems = Array.from(
                this.items.values()
              ).sort((a, b) => a.label.localeCompare(b.label));
              const GuildNavBar = Utilities.findInReactTree(res, (m) =>
                m?.props?.className?.split(" ").includes(NavBarClasses.guilds)
              );
              if (!GuildNavBar || !HomeButtonContextMenuItems) return;
              Patcher.after(GuildNavBar, "type", (_, args, res) => {
                const HomeButton = Utilities.findInReactTree(res, (m) =>
                  m?.type?.toString().includes("getHomeLink")
                );
                if (!HomeButton) return;
                Patcher.after(HomeButton, "type", (_, args, res) => {
                  Patcher.after(res, "type", (_, args, res) => {
                    res.props.onContextMenu = (event) =>
                      ContextMenu.openContextMenu(
                        event,
                        ContextMenu.buildMenu(HomeButtonContextMenuItems)
                      );
                  });
                });
              });
            });
          }
          insert(id, item) {
            this.items.set(id, item);
            this.forceUpdate();
          }
          remove(id) {
            this.items.delete(id);
            this.forceUpdate();
          }
          forceUpdate() {
            const { NavBarClasses } = LibraryModules;
            const element = document.querySelector(`.${NavBarClasses.guilds}`);
            ReactUtils.forceUpdate(element);
          }
        })();

        const ApplicationCommandAPI = new (class ApplicationCommandAPI {
          constructor() {
            this.commands = new Map();
            this.#patchApplicationCommands();
            this.#patchIconUtils();
          }
          get CurrentUserSection() {
            const { UserStore } = LibraryModules;
            const CurrentUser = UserStore.getCurrentUser();
            return {
              id: CurrentUser.id,
              name: CurrentUser.username,
              type: 1,
              icon: CurrentUser.avatar,
            };
          }

          #patchApplicationCommands() {
            const { ApplicationCommandStore, BuiltInCommands } = LibraryModules;
            Patcher.after(ApplicationCommandStore, "JK", (_, args, res) => {
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
              return res;
            });
            Patcher.after(
              ApplicationCommandStore.ZP,
              "getChannelState",
              (_, args, res) => {
                if (!res || !this.commands.size) return;
                if (
                  !Array.isArray(res.applicationSections) ||
                  !res.applicationSections.some(
                    (section) => section.id == this.CurrentUserSection.id
                  )
                )
                  res.applicationSections = Array.isArray(
                    res.applicationSections
                  )
                    ? [this.CurrentUserSection, ...res.applicationSections]
                    : [this.CurrentUserSection];
                if (
                  !Array.isArray(res.applicationCommands) ||
                  Array.from(this.commands.values()).some(
                    (command) => !res.applicationCommands.includes(command)
                  )
                )
                  return res;
              }
            );
            Patcher.after(BuiltInCommands, "Kh", (_, args, res) => {
              return Array.isArray(res)
                ? [
                    ...res.filter(
                      (command) =>
                        !Array.from(this.commands.values()).includes(command)
                    ),
                    ...Array.from(this.commands.values()),
                  ]
                : Array.from(this.commands.values());
            });
          }
          #patchIconUtils() {
            const { IconUtils, UserStore } = LibraryModules;
            Patcher.instead(
              IconUtils,
              "getApplicationIconURL",
              (_, args, res) => {
                if (args[0].id !== this.CurrentUserSection.id)
                  return res(...args);
                return IconUtils.getUserAvatarURL(UserStore.getCurrentUser());
              }
            );
          }

          register(name, command) {
            const { ApplicationCommandStore } = LibraryModules;
            (command.applicationId = this.CurrentUserSection.id),
              (command.id = `${this.CurrentUserSection.name}_${
                this.commands.size + 1
              }`.toLowerCase());
            this.commands.set(name, command);
            ApplicationCommandStore.ZP.shouldResetAll = true;
          }
          unregister(name) {
            const { ApplicationCommandStore } = LibraryModules;
            this.commands.delete(name);
            ApplicationCommandStore.ZP.shouldResetAll = true;
          }
        })();

        const UserSettingStore = new (class UserSettingStore {
          getSetting(category, key) {
            if (!category || !key) return;
            const { UserSettingsProtoStore } = LibraryModules;
            return UserSettingsProtoStore?.settings?.[category]?.[key]?.value;
          }
          setSetting(category, key, value) {
            if (!category || !key) return;
            const { UserSettingsProtoUtils } = LibraryModules;
            let store = this.getSettingsStore();
            if (store)
              store.updateAsync(
                category,
                (settings) => {
                  if (!settings) return;
                  if (!settings[key]) settings[key] = {};
                  if (
                    typeof value === "object" &&
                    !Array.isArray(value) &&
                    value !== null
                  )
                    for (let k in value) settings[key][k] = value[k];
                  else settings[key].value = value;
                },
                UserSettingsProtoUtils.fy.INFREQUENT_USER_ACTION
              );
          }
          getSettingsStore() {
            const { UserSettingsProtoUtils } = LibraryModules;
            return (Object.entries(UserSettingsProtoUtils)?.find?.(
              (n) =>
                n &&
                n[1] &&
                n[1].updateAsync &&
                n[1].ProtoClass &&
                n[1].ProtoClass.typeName &&
                n[1].ProtoClass.typeName.endsWith(".PreloadedUserSettings")
            ) || [])[1];
          }
        })();

        const FluentMasks = new (class FluentMasks {
          get Online() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-online",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M 0.5 0.125 C 0.292969 0.125 0.125 0.292969 0.125 0.5 C 0.125 0.707031 0.292969 0.875 0.5 0.875 C 0.707031 0.875 0.875 0.707031 0.875 0.5 C 0.875 0.292969 0.707031 0.125 0.5 0.125 Z M 0 0.5 C 0 0.222656 0.222656 0 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 Z M 0 0.5 ",
              })
            );
          }
          get Phone() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-online-mobile",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M 0.8125 0 C 0.917969 0 1 0.0507812 1 0.113281 L 1 0.886719 C 1 0.949219 0.917969 1 0.8125 1 L 0.1875 1 C 0.0820312 1 0 0.949219 0 0.886719 L 0 0.113281 C 0 0.0507812 0.0820312 0 0.1875 0 Z M 0.8125 0.0742188 L 0.1875 0.0742188 C 0.152344 0.0742188 0.125 0.0898438 0.125 0.113281 L 0.125 0.886719 C 0.125 0.910156 0.152344 0.925781 0.1875 0.925781 L 0.8125 0.925781 C 0.847656 0.925781 0.875 0.910156 0.875 0.886719 L 0.875 0.113281 C 0.875 0.0898438 0.847656 0.0742188 0.8125 0.0742188 Z M 0.605469 0.773438 C 0.636719 0.773438 0.667969 0.792969 0.667969 0.8125 C 0.667969 0.832031 0.640625 0.851562 0.605469 0.851562 L 0.394531 0.851562 C 0.363281 0.851562 0.332031 0.832031 0.332031 0.8125 C 0.332031 0.792969 0.359375 0.773438 0.394531 0.773438 Z M 0.605469 0.773438 ",
              })
            );
          }
          get Idle() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-idle",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M0.455,0A0.509,0.509,0,0,1,.888.2L0.909,0.212V0.225L0.924,0.232,0.931,0.258H0.938L0.953,0.3H0.96v0.02H0.967V0.331H0.974V0.358H0.982v0.02H0.989V0.411H1A0.811,0.811,0,0,1,.989.616H0.982V0.642H0.974v0.02H0.967V0.675H0.96V0.7H0.953l-0.014.04H0.931l-0.007.026H0.917l-0.007.02-0.014.007V0.8l-0.036.026V0.841l-0.029.02V0.868H0.816L0.787,0.9H0.772l-0.007.013-0.022.007V0.927l-0.029.007V0.94H0.7V0.947L0.657,0.96V0.967H0.635V0.974H0.613V0.98H0.585V0.987H0.548V0.993H0.476V1H0.433V0.993L0.325,0.987V0.98H0.3V0.974L0.253,0.967V0.96L0.209,0.947V0.94H0.195V0.934L0.166,0.927V0.921L0.144,0.914,0.137,0.9H0.123L0.094,0.868H0.079L0.058,0.841H0.051V0.828L0.014,0.8V0.788L0,0.781V0.735A0.071,0.071,0,0,0,.014.722H0.029V0.715l0.036-.007V0.7H0.087V0.7l0.029-.007V0.682l0.065-.02,0.007-.013,0.043-.013,0.007-.013H0.253L0.267,0.6H0.281L0.31,0.57l0.051-.04V0.517L0.375,0.51l0.007-.02H0.39L0.4,0.464H0.4l0.014-.04H0.426V0.4H0.433V0.391H0.44V0.371H0.447V0.344H0.455l0.007-.2A0.288,0.288,0,0,1,.44.013,0.074,0.074,0,0,0,.455,0ZM0.534,0.079L0.541,0.172H0.548V0.285H0.541l-0.007.086H0.527v0.02H0.52V0.417H0.512V0.43H0.505V0.45H0.5V0.464H0.491v0.02H0.484V0.5H0.476V0.51l-0.014.007-0.007.026L0.44,0.55V0.563l-0.029.02a0.693,0.693,0,0,1-.3.192V0.781H0.115a0.211,0.211,0,0,0,.079.06L0.2,0.854,0.224,0.861V0.868H0.238V0.874L0.281,0.887V0.894L0.325,0.9V0.907H0.354V0.914H0.39V0.921H0.447A0.446,0.446,0,0,0,.671.868H0.686l0.007-.013H0.707l0.007-.013H0.729l0.014-.02H0.758l0.036-.04,0.014-.007V0.762L0.83,0.748V0.735l0.014-.007,0.007-.02H0.859l0.022-.06H0.888V0.636H0.895V0.616H0.9V0.589A0.309,0.309,0,0,0,.917.444H0.909V0.4H0.9V0.384H0.895L0.88,0.325H0.873V0.311H0.866L0.859,0.285,0.844,0.278V0.265A0.523,0.523,0,0,0,.772.192l-0.014-.02H0.743l-0.014-.02H0.714L0.707,0.139H0.693L0.686,0.126l-0.065-.02V0.1H0.606V0.093Z",
              })
            );
          }
          get DND() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-dnd",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M 0.5 0 C 0.222656 0 0 0.222656 0 0.5 C 0 0.777344 0.222656 1 0.5 1 C 0.777344 1 1 0.777344 1 0.5 C 1 0.222656 0.777344 0 0.5 0 Z M 0.125 0.5 C 0.125 0.292969 0.292969 0.125 0.5 0.125 C 0.707031 0.125 0.875 0.292969 0.875 0.5 C 0.875 0.707031 0.707031 0.875 0.5 0.875 C 0.292969 0.875 0.125 0.707031 0.125 0.5 Z M 0.25 0.5 C 0.25 0.464844 0.277344 0.4375 0.3125 0.4375 L 0.6875 0.4375 C 0.722656 0.4375 0.75 0.464844 0.75 0.5 C 0.75 0.535156 0.722656 0.5625 0.6875 0.5625 L 0.3125 0.5625 C 0.277344 0.5625 0.25 0.535156 0.25 0.5 Z M 0.25 0.5 ",
              })
            );
          }
          get Offline() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-offline",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M 0.667969 0.332031 C 0.695312 0.355469 0.695312 0.394531 0.667969 0.417969 L 0.589844 0.5 L 0.667969 0.582031 C 0.695312 0.605469 0.695312 0.644531 0.667969 0.667969 C 0.644531 0.695312 0.605469 0.695312 0.582031 0.667969 L 0.5 0.589844 L 0.417969 0.667969 C 0.394531 0.695312 0.355469 0.695312 0.332031 0.667969 C 0.304688 0.644531 0.304688 0.605469 0.332031 0.582031 L 0.410156 0.5 L 0.332031 0.417969 C 0.304688 0.394531 0.304688 0.355469 0.332031 0.332031 C 0.355469 0.304688 0.394531 0.304688 0.417969 0.332031 L 0.5 0.410156 L 0.582031 0.332031 C 0.605469 0.304688 0.644531 0.304688 0.667969 0.332031 Z M 0 0.5 C 0 0.222656 0.222656 0 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 Z M 0.5 0.125 C 0.292969 0.125 0.125 0.292969 0.125 0.5 C 0.125 0.707031 0.292969 0.875 0.5 0.875 C 0.707031 0.875 0.875 0.707031 0.875 0.5 C 0.875 0.292969 0.707031 0.125 0.5 0.125 Z M 0.5 0.125 ",
              })
            );
          }
          get Stream() {
            return React.createElement(
              "mask",
              {
                id: "svg-mask-status-streaming",
                maskContentUnits: "objectBoundingBox",
                viewBox: "0 0 1 1",
              },
              React.createElement("path", {
                fill: "white",
                d: "M 0.746094 0.46875 L 0.433594 0.28125 C 0.398438 0.261719 0.351562 0.289062 0.351562 0.332031 L 0.351562 0.667969 C 0.351562 0.710938 0.398438 0.738281 0.433594 0.71875 L 0.746094 0.53125 C 0.769531 0.519531 0.769531 0.480469 0.746094 0.46875 Z M 0.5 1 C 0.777344 1 1 0.777344 1 0.5 C 1 0.222656 0.777344 0 0.5 0 C 0.222656 0 0 0.222656 0 0.5 C 0 0.777344 0.222656 1 0.5 1 Z M 0.5 0.0625 C 0.742188 0.0625 0.9375 0.257812 0.9375 0.5 C 0.9375 0.742188 0.742188 0.9375 0.5 0.9375 C 0.257812 0.9375 0.0625 0.742188 0.0625 0.5 C 0.0625 0.257812 0.257812 0.0625 0.5 0.0625 Z M 0.5 0.0625",
              })
            );
          }
        })();
        const SpotifyApi = new (class SpotifyApi {
          constructor() {
            this.URL = "https://api.spotify.com/v1/me/player";
          }
          getAccessToken() {
            return LibraryModules?.SpotifyStore?.getActiveSocketAndDevice?.()
              ?.socket?.accessToken;
          }
          async addToQueue({ title, uri, showToast }) {
            const accessToken = this.getAccessToken();
            if (!accessToken) return;
            const res = await fetch(`${this.URL}/queue?uri=${uri}`, {
              headers: { authorization: `Bearer ${accessToken}` },
              method: "POST",
            });
            if (res.ok && showToast)
              Toasts.show(`Queued: ${title}`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_text_bullet_list_add_24_filled.png",
                timeout: 5000,
                type: "info",
              });
            else if (!res.ok && showToast)
              Toasts.show(`Error queuing: ${title}.`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                timeout: 5000,
                type: "error",
              });
          }
          async play({ title, uri, addToQueue, showToast }) {
            const accessToken = this.getAccessToken();
            if (!accessToken) return;
            if (addToQueue) {
              await this.addToQueue({ title, uri });
              const res = await fetch(`${this.URL}/next`, {
                headers: { authorization: `Bearer ${accessToken}` },
                method: "POST",
              });
              if (res.ok && showToast)
                Toasts.show(`Now playing: ${title}`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_play_circle_24_filled.png",
                  timeout: 5000,
                  type: "info",
                });
              else if (!res.ok && showToast)
                Toasts.show(`Error playing: ${title}.`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                  timeout: 5000,
                  type: "error",
                });
            } else {
              const res = await fetch(`${this.URL}/play`, {
                headers: { authorization: `Bearer ${accessToken}` },
                method: "PUT",
                body: JSON.stringify({ context_uri: uri }),
              });
              if (res.ok && showToast)
                Toasts.show(`Now playing: ${title}`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_play_circle_24_filled.png",
                  timeout: 5000,
                  type: "info",
                });
              else if (!res.ok && showToast)
                Toasts.show(`Error playing: ${title}.`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                  timeout: 5000,
                  type: "error",
                });
            }
          }
        })();

        const ColorUtils = new (class ColorUtils {
          rgba2hex(rgba) {
            return `#${rgba
              .match(
                /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/
              )
              .slice(1)
              .map((n, i) =>
                (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
                  .toString(16)
                  .padStart(2, "0")
                  .replace("NaN", "")
              )
              .join("")}`;
          }
          getBackgroundColor() {
            const getBody = document.getElementsByTagName("body")[0];
            const prop = window
              .getComputedStyle(getBody)
              .getPropertyValue("background-color");
            if (prop === "transparent")
              Logger.err(
                "Transparent background detected. Contact the developer for help!"
              );
            return this.rgba2hex(prop);
          }
          makeColorVisible(color, precent) {
            const {
              ThemeStore: { theme },
            } = LibraryModules;
            switch (theme) {
              case "light":
                return this.LightenDarkenColor(color, -precent);
                break;
              case "dark":
                return this.LightenDarkenColor(color, precent);
                break;
              default:
                Logger.err(
                  "Unknown theme detected. Contact the developer for help!"
                );
            }
          }
          getDifference(color1, color2) {
            if (!color1 && !color2) return;
            color1 = color1.substring(1, 7);
            color2 = color2.substring(1, 7);
            const _r = parseInt(color1.substring(0, 2), 16);
            const _g = parseInt(color1.substring(2, 4), 16);
            const _b = parseInt(color1.substring(4, 6), 16);
            const __r = parseInt(color2.substring(0, 2), 16);
            const __g = parseInt(color2.substring(2, 4), 16);
            const __b = parseInt(color2.substring(4, 6), 16);
            const _p1 = (_r / 255) * 100;
            const _p2 = (_g / 255) * 100;
            const _p3 = (_b / 255) * 100;
            const perc1 = Math.round((_p1 + _p2 + _p3) / 3);
            const __p1 = (__r / 255) * 100;
            const __p2 = (__g / 255) * 100;
            const __p3 = (__b / 255) * 100;
            const perc2 = Math.round((__p1 + __p2 + __p3) / 3);
            return Math.abs(perc1 - perc2);
          }
          LightenDarkenColor(color, amount) {
            return (
              "#" +
              color
                .replace(/^#/, "")
                .replace(/../g, (color) =>
                  (
                    "0" +
                    Math.min(
                      255,
                      Math.max(0, parseInt(color, 16) + amount)
                    ).toString(16)
                  ).substr(-2)
                )
            );
          }
        })();
        const LibraryUsers = new (class LibraryUsers {
          constructor() {
            this.#checkWasLibLoaded();
          }
          addPlugin(config) {
            this.plugins.add(config.info.name);
          }
          removePlugin(config) {
            this.plugins.delete(config.info.name);
          }
          #waitForBunnyLib() {
            return new Promise(async (resolve) => {
              while (
                !window.hasOwnProperty("BunnyLib") ||
                window["BunnyLib"].version !== config.info.version
              )
                await LibraryUtils.Sleep(250);
              resolve(window["BunnyLib"]);
            });
          }
          async #checkWasLibLoaded() {
            const wasLibLoaded = window.hasOwnProperty("BunnyLib");
            const isBDLoading = document.getElementById("bd-loading-icon");
            if (!wasLibLoaded && isBDLoading) return (this.plugins = new Set());
            const userPlugins = window?.BunnyLib?.LibraryUsers?.plugins;
            const toReload = userPlugins?.size
              ? Array.from(userPlugins).filter((plugin) =>
                  Plugins.getAll().some((m) => m.name == plugin)
                )
              : Plugins.getAll()
                  .map((m) => m.name)
                  .filter((m) => !m?.toLowerCase().includes("lib"));
            this.plugins = new Set();
            await this.#waitForBunnyLib();
            this.#reloadSpecified(toReload);
          }
          #reloadSpecified(toReload) {
            const toastsWereEnabled = BdApi.isSettingEnabled(
              "settings",
              "general",
              "showToasts"
            );
            if (toastsWereEnabled)
              BdApi.disableSetting("settings", "general", "showToasts");
            for (const plugin of toReload) if (plugin) Plugins.reload(plugin);
            if (toastsWereEnabled)
              BdApi.enableSetting("settings", "general", "showToasts");
          }
        })();

        const AllLibraryProps = {
          get LibraryModules() {
            return LibraryModules;
          },
          get LibraryIcons() {
            return LibraryIcons;
          },
          get LibraryUtils() {
            return LibraryUtils;
          },
          get LibraryRequires() {
            return LibraryRequires;
          },
          get ReactUtils() {
            return ReactUtils;
          },
          get Settings() {
            return Settings;
          },
          get HomeButtonContextMenuApi() {
            return HomeButtonContextMenuApi;
          },
          get HBCM() {
            return HomeButtonContextMenuApi;
          },
          get ApplicationCommandAPI() {
            return ApplicationCommandAPI;
          },
          get UserSettingStore() {
            return UserSettingStore;
          },
          get FluentMasks() {
            return FluentMasks;
          },
          get SpotifyApi() {
            return SpotifyApi;
          },
          get ColorUtils() {
            return ColorUtils;
          },
          get LibraryUsers() {
            return LibraryUsers;
          },
        };
        window.BunnyLib = new (class BunnyLib {
          constructor() {
            Object.assign(this, AllLibraryProps);
          }
          get version() {
            return config.info.version;
          }
          build(config) {
            LibraryUsers.addPlugin(config);
            return AllLibraryProps;
          }
        })();
        const {
          electron: { shell },
        } = LibraryRequires;
        const { WindowInfoStore, ProfileBadges, Clickable } = LibraryModules;
        return class BunnyLib extends Plugin {
          constructor() {
            super();
            this.checkUpdateAll = this.checkUpdateAll.bind(this);
            this.checkedUpdateInLastTenMinutes = false;
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
          load() {
            this.checkForUpdates();
            Plugins.enable(config.info.name);
          }

          onStart() {
            WindowInfoStore.addChangeListener(this.checkUpdateAll);
            Logger.warn("\nStealing your token... \n1..\n2...\n3....\nDone.");
            this.patchProfileBadges();
          }
          checkUpdateAll() {
            if (
              !WindowInfoStore.isFocused() ||
              this.checkedUpdateInLastTenMinutes
            )
              return;
            for (const plugin of [config.info.name, ...LibraryUsers.plugins]) {
              const Plugin = Plugins.get(plugin);
              PluginUpdater.checkForUpdate(
                Plugin.name,
                Plugin.version,
                Plugin.updateUrl
              );
            }
            this.checkedUpdateInLastTenMinutes = true;
            setTimeout(() => {
              this.checkedUpdateInLastTenMinutes = false;
            }, 10 * 60 * 1000);
          }
          async patchProfileBadges() {
            const badgeData = await fetch(
              "https://tharki-god.github.io/files-random-host/badges.json"
            );
            const { users, roles } = await badgeData.json();
            Patcher.after(ProfileBadges, "Z", (_, args, res) => {
              const { user } = args[0];
              if (!user) return res;
              const role = users[user.id];
              if (!role) return res;
              const badge = roles[role];

              const Badge = React.createElement(
                Tooltip,
                {
                  text: badge.text,
                },
                (props) =>
                  React.createElement(
                    "div",
                    {
                      ...props,
                      className: `tharki_badges`,
                      style: {
                        display: "block",
                      },
                    },
                    React.createElement(
                      Clickable,
                      {
                        onClick: () => shell.openExternal(badge.href),
                        style: {
                          cursor: "pointer",
                        },
                      },
                      React.createElement("img", {
                        src: badge.img,
                        style: {
                          height: "22px",
                          width: "22px",
                        },
                      })
                    )
                  )
              );
              res.props.children.unshift(Badge);
              return res;
            });
          }
          onStop() {
            Patcher.unpatchAll();
            WindowInfoStore.removeChangeListener(this.checkUpdateAll);
            Logger.warn("\nYou will get doxxed if you disable me.");
            Plugins.enable(config.info.name);
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
