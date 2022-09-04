/**
 * @name BetterKeybinds
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.0
 * @invite SgKSKyh9gY
 * @description Add keybind to toggle your themes and plugins.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterKeybinds.plugin.js
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
module.exports = ((_) => {
    const config = {
      info: {
        name: "BetterKeybinds",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.0",
        description: "Add keybind to toggle your themes and plugins.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterKeybinds.plugin.js",
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
            "ToogleYourStuff but good looking (⊙_⊙)？",
          ],
        },
      ],
      main: "BetterKeybinds.plugin.js",
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
            Toasts,
            Utilities,
            PluginUpdater,
            Logger,
            Settings: { SettingPanel, SettingGroup, Keybind },
          } = Library;
          const WindowInfoStore = WebpackModules.getByProps(
            "isFocused",
            "isElementFullScreen"
          );
          return class BetterKeybinds extends Plugin {
            constructor() {
              super();
              this.currentlyPressed = {};
              this.pluginsData = Utilities.loadData(
                config.info.name,
                "pluginsData",
                {}
              );
              this.themesData = Utilities.loadData(
                config.info.name,
                "themesData",
                {}
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
            async onStart() {
              this.checkForUpdates();
              this.addListeners();
            }
            addListeners() {
              this.keybindListener = this.keybindListener.bind(this);
              this.cleanCallback = this.cleanCallback.bind(this);
              window.addEventListener("keydown", this.keybindListener);
              window.addEventListener("keyup", this.keybindListener);
              WindowInfoStore.addChangeListener(this.cleanCallback);
            }
            onStop() {
              this.checkForUpdates();
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
              const replacer = new RegExp(Object.keys(toReplace).join("|"), "gi");
              this.currentlyPressed[
                e.code?.toLowerCase().replace(replacer, (matched) => {
                  return toReplace[matched];
                })
              ] = e.type == "keydown";
              const plugins = Object.entries(this.pluginsData);
              const themes = Object.entries(this.themesData);
              for (const plugin of plugins) {
                if (
                  plugin[1].length &&
                  plugin[1].every(
                    (key) => this.currentlyPressed[key.toLowerCase()] === true
                  )
                )
                  this.tooglePlugin(plugin[0]);
              }
              for (const theme of themes) {
                if (
                  theme[1].length &&
                  theme[1].every(
                    (key) => this.currentlyPressed[key.toLowerCase()] === true
                  )
                )
                  theme[0] == "CustomCSS"
                    ? this.toogleCSS()
                    : this.toogleTheme(theme[0]);
              }
              this.currentlyPressed = Object.entries(this.currentlyPressed)
                .filter((t) => t[1] === true)
                .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
            }
            tooglePlugin(plugin) {
              BdApi.Plugins.isEnabled(plugin)
                ? BdApi.Plugins.disable(plugin)
                : BdApi.Plugins.enable(plugin);
            }
            toogleTheme(theme) {
              BdApi.Themes.isEnabled(theme)
                ? BdApi.Themes.disable(theme)
                : BdApi.Themes.enable(theme);
            }
            toogleCSS() {
              const enabled = BdApi.isSettingEnabled(
                "settings",
                "customcss",
                "customcss"
              );
              enabled
                ? BdApi.disableSetting("settings", "customcss", "customcss")
                : BdApi.enableSetting("settings", "customcss", "customcss");
              Toasts.show(`${enabled ? "Disabled" : "Enabled"} Custom CSS`, {
                icon: "https://cdn.discordapp.com/attachments/970704927397650462/989897913046040656/ic_fluent_document_css_24_regular.png",
                timeout: 500,
                type: "success",
              });
            }
            getSettingsPanel() {
              const plugins = BdApi.Plugins.getAll();
              const themes = BdApi.Themes.getAll();
              return SettingPanel.build(
                this.saveSettings.bind(this),
                new SettingGroup("Plugins", {
                  collapsible: true,
                  shown: false,
                }).append(
                  ...plugins
                    .filter((plugin) => plugin.id !== config.info.name)
                    .map(
                      (plugin) =>
                        new Keybind(
                          plugin.id,
                          plugin.description,
                          this.pluginsData[plugin.id] ?? [],
                          (e) => {
                            this.pluginsData[plugin.id] = e;
                          }
                        )
                    )
                ),
                new SettingGroup("Themes", {
                  collapsible: true,
                  shown: false,
                }).append(
                  new Keybind(
                    "Custom CSS",
                    "Toggle Custom CSS tab and injection.",
                    this.themesData["CustomCSS"] ?? [],
                    (e) => {
                      this.themesData["CustomCSS"] = e;
                    }
                  ),
                  ...themes.map(
                    (theme) =>
                      new Keybind(
                        theme.id,
                        theme.description,
                        this.themesData[theme.id] ?? [],
                        (e) => {
                          this.themesData[theme.id] = e;
                        }
                      )
                  )
                )
              );
            }
            saveSettings() {
              Utilities.saveData(
                config.info.name,
                "pluginsData",
                this.pluginsData
              );
              Utilities.saveData(config.info.name, "themesData", this.themesData);
            }
          };
          return plugin(Plugin, Library);
        })(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  