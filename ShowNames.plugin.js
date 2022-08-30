/**
 * @name ShowNames
 * @author Ahlawat, Kirai
 * @authorId 887483349369765930
 * @version 2.1.1
 * @invite SgKSKyh9gY
 * @description Makes name visible if same as background
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowNames.plugin.js
 */
/*@cc_on
@if (@_jscript)

// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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
      name: "ShowNames",
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
      version: "2.1.1",
      description: "Makes name visible if same as background",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowNames.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.2",
        items: ["Base Model", "Not Working"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model", "Working but buggy"],
      },
      {
        title: "v0.5.0",
        items: ["Intial code done"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Still need some optimization but kinda works",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.2",
        items: [
          "IDK why i used BDFDB",
          "Well removed the usage of it",
          "FUCK YOU",
        ],
      },
      {
        title: "v1.0.3",
        items: ["Original Cache"],
      },
      {
        title: "v1.0.5",
        items: ["Removed useless code"],
      },
      {
        title: "v1.0.6",
        items: ["I am dumb"],
      },
      {
        title: "v2.0.0",
        items: ["Patch member directly instead of color", "Optimized"],
      },
      {
        title: "v2.0.3",
        items: ["Fixed some errors", "By: Kirai 💜"],
      },
      {
        title: "v2.0.5",
        items: ["Made it optional to patch roles"],
      },
      {
        title: "v2.1.0",
        items: ["Fixed member list color not changing."],
      },
    ],
    main: "ShowNames.plugin.js",
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
          ReactComponents,
          Settings: { SettingPanel, Slider, Switch },
          DiscordModules: { GuildMemberStore },
        } = Library;
        const GuildRoleStore = WebpackModules.getByPrototypes(
          "getRole",
          "getIconURL"
        );
        const MemberListClass = WebpackModules.getByProps(
          "member",
          "lostPermission"
        );
        return class ShowNames extends Plugin {
          constructor() {
            super();
            this.colorThreshold = Utilities.loadData(
              config.info.name,
              "colorThreshold",
              30
            );
            this.percentage = Utilities.loadData(
              config.info.name,
              "percentage",
              40
            );
            this.shouldPatchRole = Utilities.loadData(
              config.info.name,
              "shouldPatchRole",
              false
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
            this.patchMemberStore();
            this.patchMemberList();
            if (this.shouldPatchRole) this.patchRoleStore();
          }
          patchMemberStore() {
            Patcher.after(GuildMemberStore, "getMember", (_, args, res) => {
              if (res?.colorString) {
                const backgroundColor = this.getBackgroundColor();
                const difference = this.getDifference(
                  backgroundColor,
                  res.colorString
                );
                if (difference < this.colorThreshold) {
                  res.colorString = this.changeColor(
                    res.colorString,
                    difference
                  );
                }
              }
            });
          }
          async patchMemberList() {
            const MemberListItem = await ReactComponents.getComponentByName(
              "MemberListItem",
              `.${MemberListClass.member}`
            );
            Patcher.after(
              MemberListItem.component.prototype,
              "renderUsername",
              (_, args, res) => {
                if (res?.props?.color) {
                  const backgroundColor = this.getBackgroundColor();
                  const difference = this.getDifference(
                    backgroundColor,
                    res.props.color
                  );
                  if (difference < this.colorThreshold) {
                    res.props.color = this.changeColor(
                      res.props.color,
                      difference
                    );
                  }
                }
              }
            );
            MemberListItem.forceUpdateAll();
          }
          patchRoleStore() {
            Patcher.after(
              GuildRoleStore.prototype,
              "getRole",
              (_, args, res) => {
                if (res?.colorString) {
                  const backgroundColor = this.getBackgroundColor();
                  const difference = this.getDifference(
                    backgroundColor,
                    res.colorString
                  );
                  if (difference < this.colorThreshold) {
                    res.colorString = this.changeColor(
                      res.colorString,
                      difference
                    );
                  }
                }
              }
            );
          }
          getBackgroundColor() {
            const rgb2hex = (rgb) =>
              `#${rgb
                .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
                .slice(1)
                .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
                .join("")}`;
            const getBody = document.getElementsByTagName("body")[0];
            const prop = window
              .getComputedStyle(getBody)
              .getPropertyValue("background-color");
            if (prop === "transparent")
              Logger.err(
                "Transparent Background Detected. Contact Dev for help!"
              );
            return rgb2hex(prop);
          }
          changeColor(color, difference) {
            const { theme } = WebpackModules.getByProps("theme");
            const precent = Math.floor(
              ((this.percentage - difference) / 100) * 255
            );
            switch (theme) {
              case "light":
                return this.LightenDarkenColor(color, -precent);
                break;
              case "dark":
                return this.LightenDarkenColor(color, precent);
                break;
              default:
                Logger.err("Unknown theme Detected. Contact Dev for help!");
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
          onStop() {
            Patcher.unpatchAll();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Color Threshold",
                "Set the threshold when the plugin should change colors.(Default: 70)",
                10,
                100,
                100 - this.colorThreshold,
                (e) => {
                  this.colorThreshold = 100 - e;
                },
                {
                  markers: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                  stickToMarkers: true,
                }
              ),
              new Slider(
                "Change Percentage",
                "The Percentage to lighten/Darken. (Default: 40) ",
                10,
                100,
                this.percentage,
                (e) => {
                  this.percentage = e;
                },
                {
                  markers: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                  stickToMarkers: true,
                }
              ),
              new Switch(
                "Role Color",
                "Weather to change role color or not. Normally Patches member color directly. (It is Recommended to keep this off, may cause performence issue).",
                this.shouldPatchRole,
                (e) => {
                  this.shouldPatchRole = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(
              config.info.name,
              "colorThreshold",
              this.colorThreshold
            );
            Utilities.saveData(config.info.name, "percentage", this.percentage);
            Utilities.saveData(
              config.info.name,
              "shouldPatchRole",
              this.shouldPatchRole
            );
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
