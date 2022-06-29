/**
	* @name BDPluginDownloader
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.4
	* @invite SgKSKyh9gY
	* @description Download Better Discord Plugin by right clicking on message containing github link.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDPluginDownloader.plugin.js
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
module.exports = (_ => {
    const config = {
        info: {
            name: "BDPluginDownloader",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
                }, {
				name: "Kirai",
				discord_id: "872383230328832031",
				github_username: "HiddenKirai",
			},
            ],
            version: "1.0.4",
            description:
            "Download Better Discord Plugin by right clicking on message containing github link.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDPluginDownloader.plugin.js",
		},
        changelog: [{
			title: "v0.0.1",
			items: [
				"Idea in mind"
			]
            }, {
			title: "v0.0.5",
			items: [
				"Base Model"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"Couldn't Have been possible without my sis, Thank you Kirai",
				"No Incest but you are great",
				"btw guys get those illegal plugins easily (>'-'<)"
			]
		},
        ],
        main: "BDPluginDownloader.plugin.js",
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
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
				} catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
            BdApi.showConfirmationModal(
                "Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async(error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", {
												href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
												target: "_blank"
											}, "Plugin Link")
										], );
								}
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
										"0PluginLibrary.plugin.js"),
										body,
									r));
							});
					},
				});
		}
        start() {}
        stop() {}
	}
	: (([Plugin, Library]) => {
        const {
            Patcher,
            ContextMenu,
            Settings,
            DiscordModules
		} = Library;
        const {
            React
		} = DiscordModules;
        const Download = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w
			}, React.createElement('path', {
				style: {
					fill: 'currentColor'
				},
				d: 'M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z'
			}));
			return class BDPluginDownloader extends Plugin {
				getLinks(message) {
					var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
					return message.match(urlRegex)
				}
				async onStart() {
					this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
					this.autoEnable = BdApi.loadData(config.info.name, "autoEnable") ?? true;
					const menu = await ContextMenu.getDiscordMenu("MessageContextMenu");
					Patcher.after(
						menu,
						"default",
						(_, [props], ret) => {
							const message = props.message;
							const isGithubUrl = new RegExp('(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?');
							const isGithubRawUrl = new RegExp('(?:git|https?|git@)(?:\\:\\/\\/)?raw.githubusercontent.com[/|:][A-Za-z0-9-]+?');
							const fs = require("fs").promises;
							let links = this.getLinks(message.content);
							links = links?.filter((c, index) => {
								if ((c.endsWith(".plugin.js") && links.indexOf(c) === index) && (isGithubUrl.test(c) || isGithubRawUrl.test(c)))
								return true;
							});
							if (links?.length) {
								ret.props.children.splice(3, 0, ContextMenu.buildMenuItem({
									name: 'Download Plugin',
									separate: true,
									id: 'download-plugin',
									label: 'Download Plugin',
									icon: () => Download('20'),
									action: async() => {
										for (const plugin of links) {
											if (isGithubUrl.test(plugin)) {
												let split = plugin.split("/")
                                                let rawLiink = `https://raw.githubusercontent.com/${split[3]}/${split[4]}/${split[6]}/${split[7]}`
                                                this.download(rawLiink, split[7]);
												} else if (isGithubRawUrl.test(plugin)) {
												let split = plugin.split("/")
                                                this.download(plugin, split[6]);
												} else {
												if (this.showToast)
                                                BdApi.showToast(`Link Type Not Supported`, {
                                                    icon: true,
                                                    timeout: 5000,
                                                    type: 'danger'
												});
											}
										}
									}
								}, true));
							}
						});
				}
				async download(plugin, name) {
					if (this.showToast)
                    BdApi.showToast(
						`Downloading Plugin: ${name.split(".")[0]}`, {
							icon: true,
							timeout: 5000,
							type: 'info'
						});
						
						await fetch(plugin).then((response) => {
							return response.text();
							}).then(async(data) => {
							await fs.writeFile(require("path").join(
								BdApi.Plugins.folder,
							name),
							data,
							(err) => {
								if (err) {
									if (this.showToast) {
										BdApi.showToast(
											`Error While Downloading: ${name}! Trying again later or download manually.`, {
												icon: true,
												timeout: 5000,
												type: 'danger'
											});
									}
									console.log(err);
								}
								}).then(() => {
								if (this.autoEnable) {
									setTimeout(() => {
										BdApi.Plugins.enable(name)
									}, 2000);
								}
							})
							}).catch((err) => {
							if (this.showToast) {
								BdApi.showToast(
									`Error While Downloading: ${name}! Trying again later or download manually.`, {
										icon: true,
										timeout: 5000,
										type: 'danger'
									});
							}
							console.warn('Something went wrong.', err);
						});
				}
				onStop() {
					Patcher.unpatchAll();
				}
				getSettingsPanel() {
					return Settings.SettingPanel.build(this.saveSettings.bind(this),
						new Settings.Switch("Popup/Toast", "Display error/success popup", this.showToast, (e) => {
							this.showToast = e;
						}),
						new Settings.Switch("Auto Enable", "Automatically Enable the plugin after download", this.autoEnable, (e) => {
							this.autoEnable = e;
						}))
				}
				saveSettings() {
					BdApi.saveData(config.info.name, "showToast", this.showToast);
					BdApi.saveData(config.info.name, "autoEnable", this.autoEnable);
				}
			};
			return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
