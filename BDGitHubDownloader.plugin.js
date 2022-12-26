/**
 * @name BDGitHubDownloader
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 2.3.0
 * @invite SgKSKyh9gY
 * @description Download BetterDiscord plugins and themes by right clicking on a message containing a GitHub link.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/BDGitHubDownloader.plugin.js
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
      name: "BDGitHubDownloader",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        }
      ],
      version: "2.3.0",
      description:
        "Download BetterDiscord plugins and themes by right clicking on a message containing a GitHub link.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/BDGitHubDownloader.plugin.js",
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
          "Couldn't Have been possible without my sis, Thank you Kirai",
          "No Incest but you are great",
          "btw guys get those illegal plugins easily (>'-'<)",
        ],
      },
      {
        title: "v2.0.0",
        items: ["Better Code", "Theme Support"],
      },
      {
        title: "v2.2.2",
        items: ["Corrected text."],
      },
    ],
    main: "BDGitHubDownloader.plugin.js",
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
        Toasts,
        Utilities,
        Logger,
        PluginUpdater,
        Settings: { SettingPanel, SettingGroup, Switch },
      } = ZLibrary;
      const { ContextMenu } = BdApi;
      const {
        LibraryUtils,
        LibraryIcons,
        LibraryRequires: { fs }
      } = BunnyLib.build(config)
      const isGithubUrl = new RegExp(
        "(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?"
      );
      const isGithubRawUrl = new RegExp(
        "(?:git|https?|git@)(?:\\:\\/\\/)?raw.githubusercontent.com[/|:][A-Za-z0-9-]+?"
      );
      const nameRegex =
        /@name\s+([^\t^\r^\n]+)|\/\/\**META.*["']name["']\s*:\s*["'](.+?)["']/i;
      const fileNameRegex = /([^\\\/]+)$/i;
      const defaultSettings = {
        showToast: true,
        autoEnablePlugin: true,
        showPluginDownload: true,
        autoEnableTheme: true,
        showThemeDownload: true,
      };
      return class BDGitHubDownloader extends Plugin {
        constructor() {
          super();
          this.settings = Utilities.loadData(
            config.info.name,
            "settings",
            defaultSettings
          );
          this.pluginDownloadPatch = this.pluginDownloadPatch.bind(this);
          this.themeDownloadPatch = this.themeDownloadPatch.bind(this);
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
          this.addMenu();
        }
        addMenu() {
          if (this.settings["showPluginDownload"])
            ContextMenu.patch("message", this.pluginDownloadPatch);
          if (this.settings["showThemeDownload"])
            ContextMenu.patch("message", this.themeDownloadPatch);
        }
        pluginDownloadPatch(menu, { message }) {
          let links = LibraryUtils.getLinks(message.content);
          links = links?.filter((link) => link.endsWith(".plugin.js"));
          if (links?.length)
            for (var link of links) {
              if (isGithubUrl.test(link))
                link = `https://raw.githubusercontent.com/${link.split("github.com/")[1]
                  }`.replace("/blob/", "/");
              const [fileName] = fileNameRegex.exec(link)[0].split(".plugin.js");
              menu.props.children.splice(
                3,
                0,
                ContextMenu.buildItem(
                  {
                    name: `Download ${fileName}`,
                    separate: true,
                    id: `download-${fileName
                      .toLowerCase()
                      .replaceAll(" ", "-")}`,
                    label: `Download ${fileName}`,
                    icon: () => LibraryIcons.Download("20", "20"),
                    action: async () => {
                      if (isGithubRawUrl.test(link))
                        return this.download(
                          link,
                          `${fileName}.plugin.js`,
                          "Plugin"
                        );
                      else if (this.settings["showToast"])
                        Toasts.show(`That link type is not supported`, {
                          icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                          timeout: 5000,
                          type: "error",
                        });
                    },
                  },
                  true
                )
              );
            }
        }
        themeDownloadPatch(menu, { message }) {
          let links = LibraryUtils.getLinks(message.content);
          links = links?.filter((link, index) => link.endsWith(".theme.css"));
          if (links?.length)
            for (var link of links) {
              if (isGithubUrl.test(link))
                link = `https://raw.githubusercontent.com/${link.split("github.com/")[1]
                  }`.replace("/blob/", "/");
              const [fileName] = fileNameRegex.exec(link)[0].split(".theme.css");
              menu.props.children.splice(
                3,
                0,
                ContextMenu.buildItem(
                  {
                    name: `Download ${fileName}`,
                    separate: true,
                    id: `download-${fileName
                      .toLowerCase()
                      .replaceAll(" ", "-")}`,
                    label: `Download ${fileName}`,
                    icon: () => LibraryIcons.Download("20", "20"),
                    action: async () => {
                      if (isGithubRawUrl.test(link))
                        return this.download(
                          link,
                          `${fileName}.theme.css`,
                          "Theme"
                        );
                      else if (this.settings["showToast"])
                        Toasts.show(`That link type is not supported`, {
                          icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                          timeout: 5000,
                          type: "error",
                        });
                    },
                  },
                  true
                )
              );
            }
        }
        async download(url, fileName, type) {
          const response = await fetch(url);
          if (!response.ok && this.settings["showToast"])
            Toasts.show(`Downloading Error!`, {
              icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
              timeout: 5000,
              type: "error",
            });
          const data = await response.text();
          let name = (nameRegex.exec(data) || []).filter((n) => n)[1];
          if (this.settings["showToast"])
            Toasts.show(`Downloading ${type}: ${name}`, {
              icon: "https://tharki-god.github.io/files-random-host/ic_fluent_arrow_download_24_filled.png",
              timeout: 5000,
              type: "error",
            });
          try {
            await fs
              .writeFileSync(
                require("path").join(
                  type === "Plugin"
                    ? BdApi.Plugins.folder
                    : BdApi.Themes.folder,
                  fileName
                ),
                data,
                (err) => {
                  if (err) {
                    if (this.settings["showToast"])
                      Toasts.show(` Error: ${err}.`, {
                        icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      });
                    Logger.err(err);
                  }
                }
              )
            if (this.settings["autoEnableTheme"] && type === "Theme") {
              setTimeout(() => {
                BdApi.Themes.enable(name);
              }, 2000);
            } else if (
              this.settings["autoEnablePlugin"] &&
              type === "Plugin"
            ) {
              setTimeout(() => {
                BdApi.Plugins.enable(name);
              }, 2000);
            }

          } catch (err) {
            if (this.settings["showToast"])
              Toasts.show(` Error: ${err}.`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                timeout: 5000,
                type: "error",
              });
            Logger.warn("Something went wrong.", err);
          }
        }
        onStop() {
          ContextMenu.unpatch("message", this.pluginDownloadPatch);
          ContextMenu.unpatch("message", this.themeDownloadPatch);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Display error/success toast.",
              this.settings["showToast"],
              (e) => {
                this.settings["showToast"] = e;
              }
            ),
            new SettingGroup("Plugins", {
              collapsible: true,
              shown: false,
            }).append(
              new Switch(
                "Show option",
                "Provide the option to download a plugin from a link.",
                this.settings["showPluginDownload"],
                (e) => {
                  this.settings["showPluginDownload"] = e;
                }
              ),
              new Switch(
                "Auto enable",
                "Automatically enable each plugin after downloading.",
                this.settings["autoEnablePlugin"],
                (e) => {
                  this.settings["autoEnablePlugin"] = e;
                }
              )
            ),
            new SettingGroup("Themes", {
              collapsible: true,
              shown: false,
            }).append(
              new Switch(
                "Show option",
                "Provide the option to download a theme from a link.",
                this.settings["showThemeDownload"],
                (e) => {
                  this.settings["showThemeDownload"] = e;
                }
              ),
              new Switch(
                "Auto enable",
                "Automatically enable each theme after downloading.",
                this.settings["autoEnableTheme"],
                (e) => {
                  this.settings["autoEnableTheme"] = e;
                }
              )
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
