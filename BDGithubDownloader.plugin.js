/**
 * @name BDGithubDownloader
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.0.9
 * @invite SgKSKyh9gY
 * @description Download BetterDiscord Plugin/Theme by right clicking on message containing github link.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDGithubDownloader.plugin.js
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
 } else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
 fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
 // Show the user where to put plugins in the future
 shell.Exec("explorer " + pathPlugins);
 shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
 }
 WScript.Quit();
 @else@*/
 module.exports = ((_) => {
   const config = {
     info: {
       name: "BDGithubDownloader",
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
       description:
         "Download BetterDiscord Plugin/Theme by right clicking on message containing github link.",
       github: "https://github.com/Tharki-God/BetterDiscordPlugins",
       github_raw:
         "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDGithubDownloader.plugin.js",
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
     ],
     main: "BDPluginDownloader.plugin.js",
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
           Patcher,
           ContextMenu,
           Toasts,
           Utilities,
           Logger,
           PluginUpdater,
           Settings: { SettingPanel, SettingGroup, Switch },
           DiscordModules: { React },
         } = Library;
         const Download = (width, height) =>
           React.createElement(
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
         const isGithubUrl = new RegExp(
           "(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?"
         );
         const isGithubRawUrl = new RegExp(
           "(?:git|https?|git@)(?:\\:\\/\\/)?raw.githubusercontent.com[/|:][A-Za-z0-9-]+?"
         );
         const nameRegex =
           /@name\s+([^\t^\r^\n]+)|\/\/\**META.*["']name["']\s*:\s*["'](.+?)["']/i;
         const fs = require("fs").promises;
         const defaultSettings = {
           showToast: true,
           autoEnablePlugin: true,
           showPluginDownload: true,
           autoEnableTheme: true,
           showThemeDownload: true,
         }
         return class BDGithubDownloader extends Plugin {
           constructor() {
             super();
             this.settings = Utilities.loadData(
               config.info.name,
               "settings",
               defaultSettings
             );     
           }
           getLinks(message) {
             const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
             return message.match(urlRegex);
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
           async addMenu(){
             this.menu = await ContextMenu.getDiscordMenu("MessageContextMenu");
             if (this.settings["showPluginDownload"]) this.addPluginDownload();
             if (this.settings["showThemeDownload"]) this.addThemeDownload();
           }
           addPluginDownload() {
             Patcher.after(this.menu, "default", (_, [props], ret) => {
               const message = props.message;
               let links = this.getLinks(message.content);
               links = links?.filter((link) => link.endsWith(".plugin.js"));
               if (links?.length) {
                 ret.props.children.splice(
                   3,
                   0,
                   ContextMenu.buildMenuItem(
                     {
                       name: "Download Plugin",
                       separate: true,
                       id: "download-plugin",
                       label: "Download Plugin",
                       icon: () => Download("20", "20"),
                       action: async () => {
                         for (let plugin of links) {
                           if (isGithubUrl.test(plugin)) {
                             plugin = `https://raw.githubusercontent.com/${
                               plugin.split("github.com/")[1]
                             }`.replace("/blob/", "/");
                             const split = plugin.split("/");
                             const fileName = split[split.length - 1];
                             this.download(plugin, fileName, "Plugin");
                           } else if (isGithubRawUrl.test(plugin)) {
                             const split = plugin.split("/");
                             const fileName = split[split.length - 1];
                             this.download(plugin, fileName, "Plugin");
                           } else {
                             if (this.showToast)
                               Toasts.show(`Link Type Not Supported`, {
                                 icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                                 timeout: 5000,
                                 type: "error",
                               });
                           }
                         }
                       },
                     },
                     true
                   )
                 );
               }
             });
           }
           async addThemeDownload() {
             Patcher.after(this.menu, "default", (_, [props], ret) => {
               const message = props.message;
               let links = this.getLinks(message.content);
               links = links?.filter((link, index) =>
                 link.endsWith(".theme.css")
               );
               if (links?.length) {
                 ret.props.children.splice(
                   3,
                   0,
                   ContextMenu.buildMenuItem(
                     {
                       name: "Download Theme",
                       separate: true,
                       id: "download-theme",
                       label: "Download Theme",
                       icon: () => Download("20", "20"),
                       action: async () => {
                         for (let theme of links) {
                           if (isGithubUrl.test(theme)) {
                             theme = `https://raw.githubusercontent.com/${
                               theme.split("github.com/")[1]
                             }`.replace("/blob/", "/");
                             const split = theme.split("/");
                             const fileName = split[split.length - 1];
                             this.download(theme, fileName, "Theme");
                           } else if (isGithubRawUrl.test(theme)) {
                             const split = theme.split("/");
                             const fileName = split[split.length - 1];
                             this.download(theme, fileName, "Theme");
                           } else {
                             if (this.showToast)
                               Toasts.show(`Link Type Not Supported`, {
                                 icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                                 timeout: 5000,
                                 type: "error",
                               });
                           }
                         }
                       },
                     },
                     true
                   )
                 );
               }
             });
           }
           async download(url, fileName, type) {
             const response = await fetch(url);
             if (!response.ok && this.settings["showToast"])
               Toasts.show(`Downloading Error!`, {
                 icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                 timeout: 5000,
                 type: "error",
               });
             const data = await response.text();
             let name = (nameRegex.exec(data) || []).filter((n) => n)[1];
             if (this.settings["showToast"])
               Toasts.show(`Downloading ${type}: ${name}`, {
                 icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_arrow_download_24_filled.pn",
                 timeout: 5000,
                 type: "error",
               });
             try {
               await fs
                 .writeFile(
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
                           icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                           timeout: 5000,
                           type: "error",
                         });
                       Logger.err(err);
                     }
                   }
                 )
                 .then(() => {
                   if (this.settings["autoEnableTheme"] && type === "Theme") {
                     setTimeout(() => {
                       BdApi.Themes.enable(name);
                     }, 2000);
                   } else if (this.settings["autoEnablePlugin"] && type === "Plugin") {
                     setTimeout(() => {
                       BdApi.Plugins.enable(name);
                     }, 2000);
                   }
                 });
             } catch (err) {
               if (this.settings["showToast"])
                 Toasts.show(` Error: ${err}.`, {
                   icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                   timeout: 5000,
                   type: "error",
                 });
               Logger.warn("Something went wrong.", err);
             }
           }
           onStop() {
             Patcher.unpatchAll();
           }
           getSettingsPanel() {
             return SettingPanel.build(
               this.saveSettings.bind(this),
               new Switch(
                 "Popup/Toast",
                 "Display error/success popup",
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
                   "Show Option",
                   "Weather to option to download plugins.",
                   this.settings["showPluginDownload"],
                   (e) => {
                     this.settings["showPluginDownload"] = e;
                   }
                 ),
                 new Switch(
                   "Auto Enable",
                   "Weather to Automatically Enable the plugin after download.",
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
                   "Show Option",
                   "Weather to option to download themes.",
                   this.settings["showThemeDownload"],
                   (e) => {
                     this.settings["showThemeDownload"] = e;
                   }
                 ),
                 new Switch(
                   "Auto Enable",
                   "Weather to Automatically Enable the themes after download.",
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
         return plugin(Plugin, Library);
       })(window.ZeresPluginLibrary.buildPlugin(config));
 })();
 /*@end@*/
 