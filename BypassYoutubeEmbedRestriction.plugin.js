/**
 * @name BypassYoutubeEmbedRestriction
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Allows playing embedded YouTube videos regardless of restrictions.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/BypassYoutubeEmbedRestriction.plugin.js
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
      name: "BypassYoutubeEmbedRestriction",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.0",
      description: "Allows playing embedded YouTube videos regardless of restrictions.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/BypassYoutubeEmbedRestriction.plugin.js",
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
          "I love you Rajonna ☆*: .｡. o(≧▽≦)o .｡.:*☆",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "BypassYoutubeEmbedRestriction.plugin.js",
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
      for (const Lib of RequiredLibs.filter(lib =>  !window.hasOwnProperty(lib.window)))
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
          Patcher,
          Utilities,
          PluginUpdater,
          Logger,
          Settings: { SettingPanel, Switch, Textbox },
        } = ZLibrary;    
        const { 
          LibraryRequires: { request }, 
          LibraryModules: { MessageAccessories } 
        } = BunnyLib.build(config);
        const defaultSettings = {
          replaceAllEmbeds: false,
          invidiousInstance: "invidious.weblibre.org",
        };
        return class BypassYoutubeEmbedRestriction extends Plugin {
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
            this.patchEmbeds();
          }
          patchEmbeds() {
            Patcher.after(
              MessageAccessories.prototype,
              "render",
              (_, args, res) => {
                if (this.settings["invidiousInstance"] == "") {
                  Logger.warn(
                    `Invalid or No instance link provided. Running on Default Indious Instance. (${defaultSettings["invidiousInstance"]})`
                  );
                  this.settings["invidiousInstance"] =
                    defaultSettings["invidiousInstance"];
                }
                const children = res?.props?.children;
                const context = children.find((m) => m?.props?.message?.embeds);
                if (!context) return;
                const embeds = context?.props?.message?.embeds;
                if (!embeds || !embeds.length) return;
                for (const embed of embeds) {
                  const { video } = embed;
                  if (!video) continue;
                  const { url } = video;
                  if (!url || !url.includes("youtube.com/embed/")) return;
                  const replaceEmbed = () => {
                    const urlObject = new URL(url);
                    urlObject.hostname = this.settings["invidiousInstance"];
                    video.url = urlObject.toString();
                  };
                  if (this.settings["replaceAllEmbeds"]) {
                    replaceEmbed();
                  } else {
                    request.get(url, (err, response, body) => {
                      if (err) {
                        return Logger.err(err);
                      }
                      const contents = body.toString();
                      if (contents.includes('name="robots" content="noindex"'))
                        replaceEmbed();
                    });
                  }
                }
              }
            );
          }
          onStop() {
            Patcher.unpatchAll();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Replace all embeds",
                "Forward all embeds to Invidious without checking if it is blocked on YouTube",
                this.settings["replaceAllEmbeds"],
                (e) => {
                  this.settings["replaceAllEmbeds"] = e;
                }
              ),
              new Textbox(
                "Invidious instance",
                `Invidious instance used in embeds. You can find other instances at https://api.invidious.io/`,
                this.settings["invidiousInstance"],
                (e) => {
                  this.settings["invidiousInstance"] = e;
                },
                {
                  placeholder: `The default is ${defaultSettings["invidiousInstance"]}`,
                }
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
