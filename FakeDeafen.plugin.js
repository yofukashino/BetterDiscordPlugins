/**
 * @name FakeDeafen
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.3.3
 * @invite SgKSKyh9gY
 * @description Fake your audio status, to make it look like you are muted or deafened when you're not.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
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
      name: "FakeDeafen",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.3",
      description:
        "Fake your audio status, to make it look like you are muted or deafened when you're not.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js",
    },
    changelog: [
      {
        title: "v0.2.3",
        items: ["Easier To use Now"],
      },
      {
        title: "v0.2.4",
        items: ["Reindented file"],
      },
      {
        title: "v0.2.6",
        items: ["Fixed some bugs, and made the code better looking."],
      },
      {
        title: "v0.3.7",
        items: ["Updater Library, Meta Update url having bugs."],
      },
      {
        title: "v0.3.8",
        items: ["Wifey.exe executed, lol ヾ(•ω•`)o."],
      },
      {
        title: "v0.3.9",
        items: ["Refractor"],
      },
      {
        title: "v0.4.0",
        items: ["Library Handler"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Fool them all (●'◡'●)",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Added Fake Video", "Removed Useless code"],
      },
      {
        title: "v1.0.6",
        items: ["Option to toogle without disabling plugin itself."],
      },
      {
        title: "v1.0.9",
        items: ["Keybind to toogle, by default: CTRL+D."],
      },
      {
        title: "v1.3.2",
        items: ["Corrected text."],
      },
    ],
    main: "FakeDeafen.plugin.js",
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
          Toasts,
          Utilities,
          PluginUpdater,
          Logger,
          DOMTools,
          Settings: { SettingPanel, SettingGroup, Keybind, Switch },
          DiscordModules: { React },
        } = Library;
        const { Patcher } = BdApi;
        const SoundModule = WebpackModules.getModule((m) =>
          m?.GN?.toString().includes("getSoundpack")
        );
        const SelfMuteStore = WebpackModules.getByProps("toggleSelfMute");
        const NotificationStore =
          WebpackModules.getByProps("getDesktopType").__getLocalVars();
        const StatusPicker = WebpackModules.getByProps("status", "statusItem");
        const SideBar = WebpackModules.getModule((m) => m.ZP && m.sN);
        const PanelButton = WebpackModules.getModule((m) =>
          m?.toString?.()?.includes("Masks.PANEL_BUTTON")
        );
        const Account = WebpackModules.getModule((m) =>
          [".START", "shrink", "grow", "basis"].every((s) =>
            m?.Z?.toString()?.includes(s)
          )
        );
        const enabledIcon = (w) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width: w,
              height: w,
              style: {
                "margin-left": "-2px",
              },
            },
            React.createElement("path", {
              d: "M3.5 12a8.5 8.5 0 1 1 14.762 5.748l.992 1.135A9.966 9.966 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.966 9.966 0 0 0 2.746 6.883l.993-1.134A8.47 8.47 0 0 1 3.5 12Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M19.25 12.125a7.098 7.098 0 0 1-1.783 4.715l-.998-1.14a5.625 5.625 0 1 0-8.806-.15l-1.004 1.146a7.125 7.125 0 1 1 12.59-4.571Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M16.25 12a4.23 4.23 0 0 1-.821 2.511l-1.026-1.172a2.75 2.75 0 1 0-4.806 0L8.571 14.51A4.25 4.25 0 1 1 16.25 12Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M12 12.5a.75.75 0 0 1 .564.256l7 8A.75.75 0 0 1 19 22H5a.75.75 0 0 1-.564-1.244l7-8A.75.75 0 0 1 12 12.5Z",
              fill: "#ffffff",
            })
          );
        const disabledIcon = (w) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width: w,
              height: w,
              style: {
                "margin-left": "-2px",
              },
            },
            React.createElement("path", {
              d: "M3.5 12a8.5 8.5 0 1 1 14.762 5.748l.992 1.135A9.966 9.966 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.966 9.966 0 0 0 2.746 6.883l.993-1.134A8.47 8.47 0 0 1 3.5 12Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M19.25 12.125a7.098 7.098 0 0 1-1.783 4.715l-.998-1.14a5.625 5.625 0 1 0-8.806-.15l-1.004 1.146a7.125 7.125 0 1 1 12.59-4.571Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M16.25 12a4.23 4.23 0 0 1-.821 2.511l-1.026-1.172a2.75 2.75 0 1 0-4.806 0L8.571 14.51A4.25 4.25 0 1 1 16.25 12Z",
              fill: "#ffffff",
            }),
            React.createElement("path", {
              d: "M12 12.5a.75.75 0 0 1 .564.256l7 8A.75.75 0 0 1 19 22H5a.75.75 0 0 1-.564-1.244l7-8A.75.75 0 0 1 12 12.5Z",
              fill: "#ffffff",
            }),
            React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            })
          );
        const CSS = `.withTagAsButton-OsgQ9L {
            min-width:0;
            }
            `;
        const Sounds = {
          Enable: "reconnect",
          Disable: "stream_ended",
        };
        const WindowInfoStore = WebpackModules.getByProps(
          "isFocused",
          "isElementFullScreen"
        );
        const toReplace = {
          controlleft: "ctrl",
          capslock: "caps lock",
          shiftright: "right shift",
          controlright: "right ctrl",
          contextmenu: "right meta",
          metaleft: "meta",
          backquote: "`",
          altleft: "alt",
          altright: "right alt",
          escape: "esc",
          shiftleft: "shift",
          key: "",
          digit: "",
          minus: "-",
          equal: "=",
          backslash: "\\",
          bracketleft: "[",
          bracketright: "]",
          semicolon: ";",
          quote: "'",
          slash: "/",
          comma: ",",
          period: ".",
          numpadadd: "numpad +",
          numpadenter: "enter",
          numpaddivide: "numpad /",
          numpadmultiply: "numpad *",
          numpadsubtract: "numpad -",
          arrowleft: "left",
          arrowright: "right",
          arrowdown: "down",
          arrowup: "up",
          pause: "break",
          pagedown: "page down",
          pageup: "page up",
          numlock: "numpad clear",
          printscreen: "print screen",
          scrolllock: "scroll lock",
          numpad: "numpad ",
        };
        const defaultSettings = {
          toFake: {
            mute: true,
            deaf: true,
            video: false,
          },
          statusPicker: true,
          userPanel: false,
          playAudio: false,
          showToast: true,
          keybind: ["ctrl", "d"],
        };
        return class FakeDeafen extends Plugin {
          constructor() {
            super();
            this.currentlyPressed = {};
            this.keybindListener = this.keybindListener.bind(this);
            this.cleanCallback = this.cleanCallback.bind(this);
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
            this.enabled = Utilities.loadData(
              config.info.name,
              "enabled",
              true
            );
          }
          sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
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
            this.init();
            this.addListeners();
          }
          addListeners() {
            window.addEventListener("keydown", this.keybindListener);
            window.addEventListener("keyup", this.keybindListener);
            WindowInfoStore.addChangeListener(this.cleanCallback);
          }
          async init() {
            if (this.enabled) await this.fakeIt();
            if (this.settings["statusPicker"]) this.patchStatusPicker();
            if (this.settings["userPanel"]) this.patchPanelButton();
          }

          patchStatusPicker() {
            Patcher.before(config.info.name, SideBar, "ZP", (_, args) => {
              if (args[0]?.navId != "account") return args;
              const [
                {
                  children: {
                    props: { children },
                  },
                },
              ] = args;

              const switchAccount = children.find(
                (c) => c?.props?.children?.key == "switch-account"
              );
              if (!children.find((c) => c?.props?.className == "tharki"))
                children.splice(
                  children.indexOf(switchAccount),
                  0,
                  React.createElement(SideBar.kS, {
                    className: "tharki",
                    children: [],
                  })
                );
              const section = children.find(
                (c) => c?.props?.className == "tharki"
              );
              if (!children.find((m) => m?.props?.id == "fake-deafen"))
                children.splice(
                  children.indexOf(section),
                  0,
                  React.createElement(SideBar.sN, {
                    id: "fake-deafen",
                    keepItemStyles: true,
                    action: () => {
                      return this.toggle();
                    },
                    render: () =>
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.statusItem,
                          "aria-label": `${
                            this.enabled ? "Unfake" : "Fake"
                          } audio status`,
                        },
                        this.enabled ? disabledIcon("16") : enabledIcon("16"),
                        React.createElement(
                          "div",
                          {
                            className: StatusPicker.status,
                          },
                          `${this.enabled ? "Unfake" : "Fake"} audio status`
                        ),
                        React.createElement(
                          "div",
                          {
                            className: StatusPicker.description,
                          },
                          `Whether to ${
                            this.enabled ? "unfake" : "fake"
                          } deafen/mute/video status for others.`
                        )
                      ),
                  })
                );
            });
          }
          patchPanelButton() {
            DOMTools.addStyle(config.info.name, CSS);
            Patcher.before(config.info.name, Account, "Z", (_, args) => {
              const [{ children }] = args;
              if (
                !children?.some?.(
                  (m) =>
                    m?.props?.tooltipText == "Mute" ||
                    m?.props?.tooltipText == "Unmute"
                )
              )
                return;
              children.unshift(
                React.createElement(PanelButton, {
                  icon: () =>
                    this.enabled ? enabledIcon("20") : disabledIcon("20"),
                  tooltipText: `${
                    this.enabled ? "Unfake" : "Fake"
                  } audio status`,
                  onClick: () => {
                    this.toggle();
                  },
                })
              );
            });
          }
          onStop() {
            Patcher.unpatchAll("fake-deafen");
            Patcher.unpatchAll(config.info.name);
            this.removeListeners();
            DOMTools.removeStyle(config.info.name);
          }
          removeListeners() {
            window.removeEventListener("keydown", this.keybindListener);
            window.removeEventListener("keyup", this.keybindListener);
            WindowInfoStore.removeChangeListener(this.cleanCallback);
          }
          cleanCallback() {
            if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
          }
          keybindListener(e) {
            const re = new RegExp(Object.keys(toReplace).join("|"), "gi");
            this.currentlyPressed[
              e.code?.toLowerCase().replace(re, (matched) => {
                return toReplace[matched];
              })
            ] = e.type == "keydown";
            if (
              this.settings["keybind"]?.length &&
              this.settings["keybind"].every(
                (key) => this.currentlyPressed[key.toLowerCase()] === true
              )
            ) {
              if (this.settings["showToast"])
                Toasts.show(
                  `${this.enabled ? "Unfaked" : "Faked"} audio status`,
                  {
                    icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/sound%20fake%20deaf.png",
                    timeout: 1000,
                    type: "success",
                  }
                );
              this.toggle();
            }
            this.currentlyPressed = Object.entries(this.currentlyPressed)
              .filter((t) => t[1] === true)
              .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
          }
          toggle() {
            if (this.settings["playAudio"])
              SoundModule.GN(
                this.enabled ? Sounds.Disable : Sounds.Enable,
                0.5
              );
            this.enabled ? this.unfakeIt() : this.fakeIt();
          }
          unfakeIt() {
            Patcher.unpatchAll("fake-deafen");
            this.update();
            this.enabled = false;
            Utilities.saveData(config.info.name, "enabled", this.enabled);
          }
          async fakeIt() {
            const voiceStateUpdate = WebpackModules.getModule(
              (m) => m?.getName?.() == "GatewayConnectionStore"
            ).getSocket();
            Patcher.instead(
              "fake-deafen",
              voiceStateUpdate,
              "voiceStateUpdate",
              (instance, args) => {
                instance.send(4, {
                  guild_id: args[0].guildId,
                  channel_id: args[0].channelId,
                  preferredRegion: args[0].preferredRegion,
                  self_mute:
                    this.settings["toFake"]["mute"] || args[0].selfMute,
                  self_deaf:
                    this.settings["toFake"]["deaf"] || args[0].selfDeaf,
                  self_video:
                    this.settings["toFake"]["video"] || args[0].selfVideo,
                });
              }
            );
            this.update();
            this.enabled = true;
            Utilities.saveData(config.info.name, "enabled", this.enabled);
          }
          async update() {
            const toCheck = ["mute", "unmute"];
            const toToggle = toCheck.filter(
              (sound) => !NotificationStore.state.disabledSounds.includes(sound)
            );
            if (toToggle.length > 0)
              Object.defineProperty(NotificationStore.state, "disabledSounds", {
                value: [...toToggle, ...NotificationStore.state.disabledSounds],
                writable: true,
              });
            await SelfMuteStore.toggleSelfMute();
            await this.sleep(100);
            SelfMuteStore.toggleSelfMute();
            if (toToggle.length > 0)
              Object.defineProperty(NotificationStore.state, "disabledSounds", {
                value: NotificationStore.state.disabledSounds.filter(
                  (sound) => !toToggle.includes(sound)
                ),
                writable: true,
              });
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new SettingGroup("What to fake?", {
                collapsible: true,
                shown: false,
              }).append(
                new Switch(
                  "Mute",
                  "Whether you want to fake mute or not.",
                  this.settings["toFake"]["mute"],
                  (e) => {
                    this.settings["toFake"]["mute"] = e;
                  }
                ),
                new Switch(
                  "Deafen",
                  "Whether you want to fake deafen or not.",
                  this.settings["toFake"]["deaf"],
                  (e) => {
                    this.settings["toFake"]["deaf"] = e;
                  }
                ),
                new Switch(
                  "Video",
                  "Whether you want to fake video or not.",
                  this.settings["toFake"]["video"],
                  (e) => {
                    this.settings["toFake"]["video"] = e;
                  }
                )
              ),
              new SettingGroup("Toggle options", {
                collapsible: true,
                shown: false,
              }).append(
                new Keybind(
                  "Toggle by keybind:",
                  "Keybind to toggle faking.",
                  this.settings["keybind"],
                  (e) => {
                    this.settings["keybind"] = e;
                  }
                ),
                new Switch(
                  "Show toasts",
                  "Whether to show toasts on using keybinds.",
                  this.settings["showToast"],
                  (e) => {
                    this.settings["showToast"] = e;
                  }
                ),
                new Switch(
                  "Status picker",
                  "Add an option in the status picker to toggle faking.",
                  this.settings["statusPicker"],
                  (e) => {
                    this.settings["statusPicker"] = e;
                  }
                ),
                new Switch(
                  "User panel",
                  "Add a button in the user panel to toggle faking.",
                  this.settings["userPanel"],
                  (e) => {
                    this.settings["userPanel"] = e;
                  }
                ),
                new Switch(
                  "Play audio",
                  "Play audio on using the keybind or clicking the button in the status picker or user panel.",
                  this.settings["playAudio"],
                  (e) => {
                    this.settings["playAudio"] = e;
                  }
                )
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            Patcher.unpatchAll("fake-deafen");
            Patcher.unpatchAll(config.info.name);
            this.init();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
