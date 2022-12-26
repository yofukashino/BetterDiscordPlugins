/**
 * @name Lister
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.0
 * @invite SgKSKyh9gY
 * @website https://tharki-god.github.io/
 * @description Adds a slash command to send a list of enabled and disabled plugins/themes.
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/Lister.plugin.js
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
      name: "Lister",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.0",
      description:
        "Adds a slash command to send a list of enabled and disabled plugins/themes.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/Lister.plugin.js",
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
          "This is the initial release of the plugin.",
          "This should be built into better discord.",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Corrected text."],
      }
    ],
    main: "Lister.plugin.js",
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
        PluginUpdater,
        Logger,
        DiscordModules: { MessageActions },
      } = ZLibrary;
      const { Themes, Plugins } = BdApi;
      const { LibraryUtils, ApplicationCommandAPI } = BunnyLib.build(config); 
      return class Lister extends Plugin {
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
          this.addCommand();
        }
        addCommand() {
          ApplicationCommandAPI.register(`${config.info.name}_themes`, {
            name: "list themes",
            displayName: "list themes",
            displayDescription: "Send a list of all the themes you have.",
            description: "Send a list of all the themes you have.",
            type: 1,
            target: 1,
            execute: ([send, versions, listChoice], { channel }) => {
              try {
                const content = this.getThemes(
                  versions.value,
                  listChoice.value
                );
                send.value
                  ? MessageActions.sendMessage(
                    channel.id,
                    {
                      content,
                      tts: false,
                      invalidEmojis: [],
                      validNonShortcutEmojis: [],
                    },
                    undefined,
                    {}
                  )
                  : MessageActions.receiveMessage(
                    channel.id,
                    LibraryUtils.FakeMessage(channel.id, content)
                  );
              } catch (err) {
                Logger.err(err);
                MessageActions.receiveMessage(
                  channel.id,
                  LibraryUtils.FakeMessage(
                    channel.id,
                    "Unable to list your themes."
                  )
                );
              }
            },
            options: [
              {
                description: "Whether you want to send this or not.",
                displayDescription: "Whether you want to send this or not.",
                displayName: "Send",
                name: "Send",
                required: true,
                type: 5,
              },
              {
                description: "Whether you want to add version info.",
                displayDescription: "Whether you want to add version info.",
                displayName: "Versions",
                name: "Versions",
                required: true,
                type: 5,
              },
              {
                description:
                  "Whether you want to send either only enabled, disabled or all themes.",
                displayDescription:
                  "Whether you want to send either only enabled, disabled or all themes.",
                displayName: "List",
                name: "List",
                required: true,
                choices: [
                  {
                    name: "Enabled",
                    displayName: "Enabled",
                    value: "enabled",
                  },
                  {
                    name: "Disabled",
                    displayName: "Disabled",
                    value: "disabled",
                  },
                  {
                    name: "Both",
                    displayName: "Both",
                    value: "default",
                  },
                ],
                type: 3,
              },
            ],
          });

          ApplicationCommandAPI .register(`${config.info.name}_plugins`, {
            name: "list plugins",
            displayName: "list plugins",
            displayDescription: "Send a list of all the plugins you have.",
            description: "Send a list of all the plugins you have.",
            type: 1,
            target: 1,
            execute: ([send, versions, listChoice], { channel }) => {
              try {
                const content = this.getPlugins(
                  versions.value,
                  listChoice.value
                );
                send.value
                  ? MessageActions.sendMessage(
                    channel.id,
                    {
                      content,
                      tts: false,
                      invalidEmojis: [],
                      validNonShortcutEmojis: [],
                    },
                    undefined,
                    {}
                  )
                  : MessageActions.receiveMessage(
                    channel.id,
                    LibraryUtils.FakeMessage(channel.id, content)
                  );
              } catch (err) {
                Logger.err(err);
                MessageActions.receiveMessage(
                  channel.id,
                  LibraryUtils.FakeMessage(channel.id, "Unable to list your plugins.")
                );
              }
            },
            options: [
              {
                description: "Whether you want to send this or not.",
                displayDescription: "Whether you want to send this or not.",
                displayName: "Send",
                name: "Send",
                required: true,
                type: 5,
              },
              {
                description: "Whether you want to add version info.",
                displayDescription: "Whether you want to add version info.",
                displayName: "Versions",
                name: "Versions",
                required: true,
                type: 5,
              },
              {
                description:
                  "Whether you want to send either only enabled, disabled or all plugins.",
                displayDescription:
                  "Whether you want to send either only enabled, disabled or all plugins.",
                displayName: "List",
                name: "List",
                required: true,
                choices: [
                  {
                    name: "Enabled",
                    displayName: "Enabled",
                    value: "enabled",
                  },
                  {
                    name: "Disabled",
                    displayName: "Disabled",
                    value: "disabled",
                  },
                  {
                    name: "Both",
                    displayName: "Both",
                    value: "default",
                  },
                ],
                type: 3,
              },
            ],
          });
        }
        getThemes(version, list) {
          const allThemes = Themes.getAll();
          const enabled = allThemes.filter((t) => Themes.isEnabled(t.id));
          const disabled = allThemes.filter((t) => !Themes.isEnabled(t.id));
          const enabledMap = enabled
            .map((t) => (version ? `${t.name} (${t.version})` : t.name))
            .join(", ");
          const disabledMap = disabled
            .map((t) => (version ? `${t.name} (${t.version})` : t.name))
            .join(", ");
          switch (list) {
            case "enabled":
              return `**Enabled Themes (${enabled.length}):** \n ${enabledMap}`;
              break;
            case "disabled":
              return `**Disabled Themes (${disabled.length}):** \n ${disabledMap}`;
              break;
            default:
              return `**Enabled Themes (${enabled.length}):** \n ${enabledMap} \n\n **Disabled Themes (${disabled.length}):** \n ${disabledMap}`;
          }
        }
        getPlugins(version, list) {
          const allPlugins = Plugins.getAll();
          const enabled = allPlugins.filter((p) => Plugins.isEnabled(p.id));
          const disabled = allPlugins.filter((p) => !Plugins.isEnabled(p.id));
          const enabledMap = enabled
            .map((p) => (version ? `${p.name} (${p.version})` : p.name))
            .join(", ");
          const disabledMap = disabled
            .map((p) => (version ? `${p.name} (${p.version})` : p.name))
            .join(", ");
          switch (list) {
            case "enabled":
              return `**Enabled Plugins (${enabled.length}):** \n ${enabledMap}`;
              break;
            case "disabled":
              return `**Disabled Plugins (${disabled.length}):** \n ${disabledMap}`;
              break;
            default:
              return `**Enabled Plugins (${enabled.length}):** \n ${enabledMap} \n\n **Disabled Plugins (${disabled.length}):** \n ${disabledMap}`;
          }
        }
        onStop() {
          ApplicationCommandAPI.unregister(`${config.info.name}_themes`);
          ApplicationCommandAPI.unregister(`${config.info.name}_plugins`);
        }
      };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
