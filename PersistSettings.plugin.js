/**
 * @name PersistSettings
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.2.1
 * @invite SgKSKyh9gY
 * @description Backs up your settings and restores them in case discord clears them after logouts or for other reasons.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PersistSettings.plugin.js
 */
/* PersistSettings, a powercord/replugged plugin to make sure you never lose your favourites again!
 * Copyright (C) 2021 Vendicated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Ported to BetterDiscord
 * Copyright 2022 Ahlawat
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
      name: "PersistSettings",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.1",
      description:
        "Backs up your settings and restores them in case discord clears them after logouts or for other reasons",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PersistSettings.plugin.js",
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
          "Fuck You Discord (>'-'<)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Bug Fixes", "Library Handler fixed"],
      },
      {
        title: "v1.2.1",
        items: ["Fixed some bugs","its recommended to delete config file and restart discord."],
      },
    ],
    main: "PersistSettings.plugin.js",
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
        const { WebpackModules, PluginUpdater, Logger, Utilities } = Library;
        const AccessiblityEvents = Object.freeze([
          "ACCESSIBILITY_SET_MESSAGE_GROUP_SPACING",
          "ACCESSIBILITY_SET_PREFERS_REDUCED_MOTION",
          "ACCESSIBILITY_DESATURATE_ROLES_TOGGLE",
          "ACCESSIBILITY_DARK_SIDEBAR_TOGGLE",
          "ACCESSIBILITY_SET_SATURATION",
          "ACCESSIBILITY_SET_FONT_SIZE",
          "ACCESSIBILITY_SET_ZOOM",
        ]);
        const VoiceEvents = Object.freeze([
          "AUDIO_SET_DISPLAY_SILENCE_WARNING",
          "AUDIO_SET_AUTOMATIC_GAIN_CONTROL",
          "MEDIA_ENGINE_SET_HARDWARE_H264",
          "MEDIA_ENGINE_SET_VIDEO_DEVICE",
          "AUDIO_SET_NOISE_SUPPRESSION",
          "AUDIO_SET_ECHO_CANCELLATION",
          "MEDIA_ENGINE_SET_OPEN_H264",
          "MEDIA_ENGINE_SET_AEC_DUMP",
          "AUDIO_SET_OUTPUT_VOLUME",
          "AUDIO_SET_OUTPUT_DEVICE",
          "AUDIO_SET_INPUT_DEVICE",
          "AUDIO_SET_ATTENUATION",
          "AUDIO_SET_MODE",
          "AUDIO_SET_QOS",
        ]);
        const NotificationEvents = Object.freeze([
          "NOTIFICATIONS_SET_DISABLE_UNREAD_BADGE",
          "NOTIFICATIONS_SET_PERMISSION_STATE",
          "NOTIFICATIONS_SET_DISABLED_SOUNDS",
          "NOTIFICATIONS_SET_TASKBAR_FLASH",
          "NOTIFICATIONS_SET_DESKTOP_TYPE",
          "NOTIFICATIONS_SET_TTS_TYPE",
        ]);
        const Dispatcher = WebpackModules.getByProps(
          "dispatch",
          "_actionHandlers"
        );
        const ExperimentsStore = WebpackModules.getByProps("hasRegisteredExperiment");
        const NotificationStore = WebpackModules.getByProps("getDesktopType");
        const AccessibilityStore = WebpackModules.getByProps("isZoomedIn");
        const KeybindStore = WebpackModules.getByProps("hasKeybind");
        const VoiceStore = WebpackModules.getByProps("isDeaf");
        return class PersistSettings extends Plugin {
          constructor(...args) {
            super(...args);
            this.restore = this.restore.bind(this);
            this.backupVoice = this.backupVoice.bind(this);
            this.backupKeybinds = this.backupKeybinds.bind(this);
            this.backupSettings = this.backupSettings.bind(this);
            this.backupExperiments = this.backupExperiments.bind(this);
            this.backupAccessibility = this.backupAccessibility.bind(this);
            this.backupNotifications = this.backupNotifications.bind(this);
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
            this.addListeners();
          }
          addListeners() {
            Dispatcher.subscribe("CONNECTION_OPEN", this.restore);
            Dispatcher.subscribe("KEYBINDS_ADD_KEYBIND", this.backupKeybinds);
            Dispatcher.subscribe("KEYBINDS_SET_KEYBIND", this.backupKeybinds);
            Dispatcher.subscribe("USER_SETTINGS_UPDATE", this.backupSettings);
            Dispatcher.subscribe(
              "KEYBINDS_DELETE_KEYBIND",
              this.backupKeybinds
            );
            Dispatcher.subscribe(
              "KEYBINDS_ENABLE_ALL_KEYBINDS",
              this.backupKeybinds
            );
            Dispatcher.subscribe(
              "EXPERIMENT_OVERRIDE_BUCKET",
              this.backupExperiments
            );
            for (const event of AccessiblityEvents) {
              Dispatcher.subscribe(event, this.backupAccessibility);
            }
            for (const event of VoiceEvents) {
              Dispatcher.subscribe(event, this.backupVoice);
            }
            for (const event of NotificationEvents) {
              Dispatcher.subscribe(event, this.backupNotifications);
            }
            setTimeout(() => this.didRestore || this.restore(), 1000 * 10);
          }

          backupKeybinds() {
            const keybinds = KeybindStore.__getLocalVars();
            Utilities.saveData(config.info.name, "keybinds", keybinds);
          }
          backupAccessibility() {
            const accessibility = AccessibilityStore.__getLocalVars();
            Utilities.saveData(
              config.info.name,
              "accessibility",
              accessibility
            );
          }
          backupNotifications() {
            const notifications = NotificationStore.__getLocalVars();
            Utilities.saveData(
              config.info.name,
              "notifications",
              notifications
            );
          }
          backupExperiments() {
            const experiments =
              ExperimentsStore.__getLocalVars()?.experimentOverrides;
            Utilities.saveData(config.info.name, "experiments", experiments);
          }
          backupVoice() {
            const voice = VoiceStore.__getLocalVars()?.settingsByContext;
            Utilities.saveData(config.info.name, "voice", voice);
          }
          backupSettings() {
            this.backupVoice();
            this.backupKeybinds();
            this.backupExperiments();
            this.backupAccessibility();
            this.backupNotifications();
          }
          restore() {
            this.didRestore = true;
            this.restoreVoice();
            this.restoreKeybinds();
            this.restoreExperiments();
            this.restoreAccessibility();
            this.restoreNotifications();
          }

          restoreKeybinds() {
            const backup = Utilities.loadData(
              config.info.name,
              "keybinds",
              false
            );
    
            if (!backup) return void this.backupKeybinds();
            const keybinds = KeybindStore.__getLocalVars();
            for (const state in keybinds) {
              Object.defineProperty(keybinds, state, {
                value: backup[state],
                writable: false
              });
            }
          }
          restoreExperiments() {
            const backup = Utilities.loadData(
              config.info.name,
              "experiments",
              false
            );
            if (!backup) return void this.backupExperiments();
            const experiments = ExperimentsStore.__getLocalVars();
            Object.defineProperty(experiments, "experimentOverrides", {
              value:  backup,
              writable: false
            });
          }

          restoreVoice() {
            const backup = Utilities.loadData(config.info.name, "voice", false);
            if (!backup) return void this.backupVoice();
            const voice = VoiceStore.__getLocalVars();
            Object.defineProperty(voice, "settingsByContext", {
              value:  backup,
              writable: false
            });
          }
          restoreAccessibility() {
            const backup = Utilities.loadData(
              config.info.name,
              "accessibility",
              false
            );
            if (!backup) return void this.backupAccessibility();
            const accessibility = AccessibilityStore.__getLocalVars();
            for (const state in accessibility) {
              Object.defineProperty(accessibility, state, {
                value:  backup[state],
                writable: false
              });
            }
          }
          restoreNotifications() {
            const backup = Utilities.loadData(
              config.info.name,
              "notifications",
              false
            );
            if (!backup) return void this.backupNotifications();
            const notifications = NotificationStore.__getLocalVars();
            for (const state in notifications) {
              Object.defineProperty(notifications, state, {
                value:  backup[state],
                writable: false
              });
            }
          }
          onStop() {
            this.removeListeners();
          }
          removeListeners() {
            Dispatcher.unsubscribe("CONNECTION_OPEN", this.restore);
            Dispatcher.unsubscribe("KEYBINDS_ADD_KEYBIND", this.backupKeybinds);
            Dispatcher.unsubscribe("KEYBINDS_SET_KEYBIND", this.backupKeybinds);
            Dispatcher.unsubscribe("USER_SETTINGS_UPDATE", this.backupSettings);
            Dispatcher.unsubscribe(
              "KEYBINDS_DELETE_KEYBIND",
              this.backupKeybinds
            );
            Dispatcher.unsubscribe(
              "KEYBINDS_ENABLE_ALL_KEYBINDS",
              this.backupKeybinds
            );
            Dispatcher.unsubscribe(
              "EXPERIMENT_OVERRIDE_BUCKET",
              this.backupExperiments
            );
            for (const event of AccessiblityEvents) {
              Dispatcher.unsubscribe(event, this.backupAccessibility);
            }
            for (const event of VoiceEvents) {
              Dispatcher.unsubscribe(event, this.backupVoice);
            }
            for (const event of NotificationEvents) {
              Dispatcher.unsubscribe(event, this.backupNotifications);
            }
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
