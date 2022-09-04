/**
 * @name FakeDeafen
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.2.4
 * @invite SgKSKyh9gY
 * @description Fake your VC Status to Trick your Friends
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
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
      name: "FakeDeafen",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.4",
      description: "Fake your VC Status to Trick your Friends",
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
    ],
    main: "FakeDeafen.plugin.js",
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
          Modals,
          Toasts,
          Utilities,
          PluginUpdater,
          Logger,
          DOMTools,
          ReactTools,
          Settings: { SettingPanel, SettingGroup, Keybind, Switch },
          DiscordModules: { React, SoundModule },
        } = Library;
        const { toggleSelfMute } = WebpackModules.getByProps("toggleSelfMute");
        const NotificationStore = WebpackModules.getByProps("getDesktopType");
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
        const Sounds = {
          Enable: "reconnect",
          Disable: "stream_ended",
        };
        const StatusPicker = WebpackModules.getByProps("status", "statusItem");
        const SideBar = WebpackModules.getByProps("MenuItem");
        const classes = WebpackModules.getByProps(
          "container",
          "usernameContainer"
        );
        const PanelButton = WebpackModules.getByDisplayName("PanelButton");
        const Account = ReactTools.getStateNodes(
          document.querySelector(`.${classes.container}`)
        )[0];
        const css = `.withTagAsButton-OsgQ9L {
				  min-width:0;
				  }`;
        const WindowInfoStore = WebpackModules.getByProps(
          "isFocused",
          "isElementFullScreen"
        );
        return class FakeDeafen extends Plugin {
          constructor() {
            super();
            this.currentlyPressed = {};
            this.keybindListener = this.keybindListener.bind(this);
            this.cleanCallback = this.cleanCallback.bind(this);
            this.mute = Utilities.loadData(config.info.name, "mute", true);
            this.deaf = Utilities.loadData(config.info.name, "deaf", true);
            this.video = Utilities.loadData(config.info.name, "video", false);
            this.enabled = Utilities.loadData(
              config.info.name,
              "enabled",
              true
            );
            this.statusPicker = Utilities.loadData(
              config.info.name,
              "statusPicker",
              true
            );
            this.userPanel = Utilities.loadData(
              config.info.name,
              "userPanel",
              false
            );
            this.playAudio = Utilities.loadData(
              config.info.name,
              "playAudio",
              this.userPanel
            );
            this.showToast = Utilities.loadData(
              config.info.name,
              "showToast",
              true
            );
            this.keybind = Utilities.loadData(config.info.name, "keybind", [
              "ctrl",
              "d",
            ]);
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
            if (this.statusPicker) this.patchStatusPicker();
            if (this.userPanel) this.patchPanelButton();
          }

          patchStatusPicker() {
            Patcher.before(SideBar, "default", (_, args) => {
              if (args[0]?.navId != "account") return args;
              const [{ children }] = args;
              const switchAccount = children.find(
                (c) => c?.props?.children?.key == "switch-account"
              );
              if (!children.find((c) => c?.props?.id == "fake-deafen")) {
                children.splice(
                  children.indexOf(switchAccount),
                  0,
                  React.createElement(SideBar.MenuItem, {
                    id: "fake-deafen",
                    keepItemStyles: true,
                    action: () => {
                      return this.toogle();
                    },
                    render: () =>
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.statusItem,
                          "aria-label": `${
                            this.enabled ? "Unfake" : "Fake"
                          } Sounds Status`,
                        },
                        this.enabled ? disabledIcon("16") : enabledIcon("16"),
                        React.createElement(
                          "div",
                          {
                            className: StatusPicker.status,
                          },
                          `${this.enabled ? "Unfake" : "Fake"} Sounds Status`
                        ),
                        React.createElement(
                          "div",
                          {
                            className: StatusPicker.description,
                          },
                          `Weather to ${
                            this.enabled ? "unfake" : "fake"
                          } Deafen/Mute/Video for others.`
                        )
                      ),
                  })
                );
              }
            });
          }
          patchPanelButton() {
            DOMTools.addStyle("fakeDeafPanelButton", css);
            Patcher.after(Account.__proto__, "render", (_, __, { props }) => {
              props.children[1].props.children.unshift(
                React.createElement(PanelButton, {
                  icon: () =>
                    this.enabled ? enabledIcon("20") : disabledIcon("20"),
                  tooltipText: `${
                    this.enabled ? "Unfake" : "Fake"
                  } Sound Stautus`,
                  onClick: () => {
                    this.toogle();
                  },
                })
              );
            });
          }

          onStop() {
            Patcher.unpatchAll();
            DOMTools.removeStyle("fakeDeafPanelButton");
            this.removeListeners();
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
            const re = new RegExp(Object.keys(toReplace).join("|"), "gi");
            this.currentlyPressed[
              e.code?.toLowerCase().replace(re, (matched) => {
                return toReplace[matched];
              })
            ] = e.type == "keydown";
            if (
              this.keybind?.length &&
              this.keybind.every(
                (key) => this.currentlyPressed[key.toLowerCase()] === true
              )
            ) {
              if (this.showToast)
                Toasts.show(
                  `${this.enabled ? "Unfaked" : "Faked"} Sound Status`,
                  {
                    icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/sound%20fake%20deaf.png",
                    timeout: 1000,
                    type: "success",
                  }
                );
              this.toogle();
            }
            this.currentlyPressed = Object.entries(this.currentlyPressed)
              .filter((t) => t[1] === true)
              .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
          }
          toogle() {
            if (this.playAudio)
              SoundModule.playSound(
                this.enabled ? Sounds.Disable : Sounds.Enable,
                0.5
              );
            this.enabled ? this.unfakeIt() : this.fakeIt();
          }
          unfakeIt() {
            Patcher.unpatchAll();
            this.update();
            this.enabled = false;
            Utilities.saveData(config.info.name, "enabled", this.enabled);
            this.init();
          }
          async fakeIt() {
            const voiceStateUpdate =
              WebpackModules.getByPrototypes("voiceStateUpdate");
            Patcher.after(
              voiceStateUpdate.prototype,
              "voiceStateUpdate",
              (instance, args) => {
                instance.send(4, {
                  guild_id: args[0].guildId,
                  channel_id: args[0].channelId,
                  preferredRegion: args[0].preferredRegion,
                  self_mute: this.mute || args[0].selfMute,
                  self_deaf: this.deaf || args[0].selfDeaf,
                  self_video: this.video || args[0].selfVideo,
                });
              }
            );
            await this.sleep(500);
            this.update();
            this.enabled = true;
            Utilities.saveData(config.info.name, "enabled", this.enabled);
          }
          async update() {
            const notifications = NotificationStore.getState();
            const toCheck = ["mute", "unmute"];
            const toToggle = toCheck.filter(
              (sound) => !notifications.disabledSounds.includes(sound)
            );
            Account.forceUpdate();
            if (toToggle.length > 0)
              notifications.disabledSounds = toToggle.concat(
                notifications.disabledSounds
              );
            await toggleSelfMute();
            await this.sleep(100);
            toggleSelfMute();
            if (toToggle.length > 0)
              notifications.disabledSounds =
                notifications.disabledSounds.filter(
                  (sound) => !toToggle.includes(sound)
                );
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
                  "Weather you want to fake the mute or not.",
                  this.mute,
                  (e) => {
                    this.mute = e;
                  }
                ),
                new Switch(
                  "Deaf",
                  "Weather you want to fake the deaf or not.",
                  this.deaf,
                  (e) => {
                    this.deaf = e;
                  }
                ),
                new Switch(
                  "Video",
                  "Weather you want to fake the video or not.",
                  this.video,
                  (e) => {
                    this.video = e;
                  }
                )
              ),
              new SettingGroup("Toogle Options", {
                collapsible: true,
                shown: false,
              }).append(
                new Keybind(
                  "Toggle by keybind:",
                  "Keybind to toggle fake",
                  this.keybind,
                  (e) => {
                    this.keybind = e;
                  }
                ),
                new Switch(
                  "Show Toasts",
                  "Weather to show toast on using keybind.",
                  this.showToast,
                  (e) => {
                    this.showToast = e;
                  }
                ),
                new Switch(
                  "Status Picker",
                  "Add Option in status Picker to toogle fake.",
                  this.statusPicker,
                  (e) => {
                    this.statusPicker = e;
                  }
                ),
                new Switch(
                  "User Panel",
                  "Add Button in in user panel to toogle fake.",
                  this.userPanel,
                  (e) => {
                    this.userPanel = e;
                  }
                ),
                new Switch(
                  "Play Audio",
                  "Play Audio on clicking button in user panel/using keybind.",
                  this.playAudio,
                  (e) => {
                    this.playAudio = e;
                  }
                )
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "mute", this.mute);
            Utilities.saveData(config.info.name, "deaf", this.deaf);
            Utilities.saveData(config.info.name, "video", this.video);
            Utilities.saveData(
              config.info.name,
              "statusPicker",
              this.statusPicker
            );
            Utilities.saveData(config.info.name, "userPanel", this.userPanel);
            Utilities.saveData(config.info.name, "playAudio", this.playAudio);
            Utilities.saveData(config.info.name, "keybind", this.keybind);
            Utilities.saveData(config.info.name, "showToast", this.showToast);
            Patcher.unpatchAll();
            this.init();
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
