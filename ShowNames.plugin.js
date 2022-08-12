/**
 * @name ShowNames
 * @author Ahlawat, Kirai
 * @authorId 887483349369765930
 * @version 2.0.9
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
        version: "2.0.9",
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
            ColorConverter,
            Patcher,
            PluginUpdater,
            Logger,
            Utilities,
            Settings: { SettingPanel, Slider, Switch },
            DiscordModules: { GuildMemberStore },
          } = Library;
          const { theme } = WebpackModules.getByProps("theme");
          const GuildRoleStore = WebpackModules.getByPrototypes(
            "getRole",
            "getIconURL"
          );
          return class ShowNames extends Plugin {
            constructor() {
              super();
              this.colorThreshold = Utilities.loadData(
                config.info.name,
                "colorThreshold",
                40
              );
              this.showThreshold = Utilities.loadData(
                config.info.name,
                "showThreshold",
                60
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
              this.patchMembers();
              if (this.shouldPatchRole) this.patchRole();
            }
            patchMembers() {
              Patcher.after(GuildMemberStore, "getMember", (_, args, res) => {
                if (res?.colorString) {
                  const backgroundRGB = this.getBackgroundRGB();
                  const memberRGB = ColorConverter.getRGB(res.colorString);
                  if (!memberRGB || !backgroundRGB) return;
                  const difference = Math.floor(
                    this.getDifference(backgroundRGB, memberRGB)
                  );
                  if (difference < this.colorThreshold) {
                    let changed = this.changeColor(difference, res.colorString);
                    res.colorString = changed;
                  }
                }
              });
            }
            patchRole() {
              Patcher.after(
                GuildRoleStore.prototype,
                "getRole",
                (_, args, res) => {
                  if (res?.colorString) {
                    const backgroundRGB = this.getBackgroundRGB();
                    const roleRGB = ColorConverter.getRGB(res.colorString);
                    if (!roleRGB || !backgroundRGB) return;
                    const difference = Math.floor(
                      this.getDifference(backgroundRGB, roleRGB)
                    );
                    if (difference < this.colorThreshold) {
                      let changed = this.changeColor(difference, res.colorString);
                      res.colorString = changed;
                    }
                  }
                }
              );
            }
            getBackgroundRGB() {
              var getBody = document.getElementsByTagName("body")[0];
              var prop = window
                .getComputedStyle(getBody)
                .getPropertyValue("background-color");
              if (prop === "transparent")
                Logger.err(
                  "Transparent Background Detected. Contact Dev for help!"
                );
              return JSON.parse(`[${prop.split("(")[1].split(")")[0]}]`);
            }
            getPercentage(difference) {
              const change = Math.floor((this.percentage / 100) * 255);
              switch (theme) {
                case "light":
                  return -change + difference;
                  break;
                case "dark":
                  return change - difference;
                  break;
                default:
                  Logger.err("Unknown theme Detected. Contact Dev for help!");
              }
            }
            changeColor(difference, color) {
              const percentage = this.getPercentage(difference);
  
              const changedColor = this.LightenDarkenColor(color, percentage);
              if (changedColor == "#0") return "#000000";
              return changedColor;
            }
            getDifference(rgbA, rgbB) {
              let labA = this.rgb2lab(rgbA);
              let labB = this.rgb2lab(rgbB);
              let deltaL = labA[0] - labB[0];
              let deltaA = labA[1] - labB[1];
              let deltaB = labA[2] - labB[2];
              let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
              let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
              let deltaC = c1 - c2;
              let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
              deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
              let sc = 1.0 + 0.045 * c1;
              let sh = 1.0 + 0.015 * c1;
              let deltaLKlsl = deltaL / 1.0;
              let deltaCkcsc = deltaC / sc;
              let deltaHkhsh = deltaH / sh;
              let i =
                deltaLKlsl * deltaLKlsl +
                deltaCkcsc * deltaCkcsc +
                deltaHkhsh * deltaHkhsh;
              return i < 0 ? 0 : Math.sqrt(i);
            }
            rgb2lab(rgb) {
              let r = rgb[0] / 255,
                g = rgb[1] / 255,
                b = rgb[2] / 255,
                x,
                y,
                z;
              r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
              g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
              b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
              x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
              y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
              z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
              x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
              y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
              z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
              return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
            }
            LightenDarkenColor(col, amt) {
              var usePound = false;
              if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
              }
              var num = parseInt(col, 16);
              var r = (num >> 16) + amt;
              if (r > 255) r = 255;
              else if (r < 0) r = 0;
              var b = ((num >> 8) & 0x00ff) + amt;
              if (b > 255) b = 255;
              else if (b < 0) b = 0;
              var g = (num & 0x0000ff) + amt;
              if (g > 255) g = 255;
              else if (g < 0) g = 0;
              return (
                (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16)
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
                  "Set the threshold when the plugin should change colors.(Default: 60)",
                  10,
                  100,
                  this.showThreshold,
                  (e) => {
                    this.showThreshold = e;
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
              Utilities.saveData(
                config.info.name,
                "showThreshold",
                this.showThreshold
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
  