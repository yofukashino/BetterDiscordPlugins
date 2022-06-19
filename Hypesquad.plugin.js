/**
	* @name Hypesquad
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.4
	* @invite SgKSKyh9gY
	* @description Get a option to change hypesquad of your account right clicking on home button.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Hypesquad.plugin.js
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
            name: "Hypesquad",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.4",
            description:
            "Get a option to change hypesquad of your account right clicking on home button",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Hypesquad.plugin.js",
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
				"Better than Astrological sign []~(￣▽￣)~*"
			]
		}, {
			title: "v1.0.2",
			items: [
				"Custom Icons"
			]
            }
        ],
        main: "Hypesquad.plugin.js",
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
            WebpackModules,
            ContextMenu,
            Settings,
            Toasts            
		} = Library;
        const SideBar = WebpackModules.getByProps("ListNavigatorItem");
        const ContextMenuAPI = window.HomeButtonContextMenu ||= (() => {
            const items = new Map();
            function insert(id, item) {
                items.set(id, item);
			}
            function remove(id) {
                items.delete(id);
			}
            Patcher.after(SideBar, "ListNavigatorItem", (_, args, res) => {
                if (!args[0] || args[0].id !== "home")
				return res;
                let menu = Array.from(items.values())
				res.props.onContextMenu = (event) => {
                    ContextMenu.openContextMenu(event, ContextMenu.buildMenu(menu))
				};
			})
            return {
                items,
                remove,
                insert
			};
		})();
        return class Hypesquad extends Plugin {
            async onStart() {
                this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
                this.initiate()
			}
            async Hypesquad() {
                let menu = {
                    label: "Change Hypesquad",
                    id: "change-hypesquad",
                    action: async() => {
                        await WebpackModules.getByProps(`joinHypeSquadOnline`).leaveHypeSquadOnline();
                        if (this.showToast)
						Toasts.show(`You are member of none of the houses`, {
							icon: 'https://cdn.discordapp.com/attachments/889198641775001670/987914489905180772/Hypesquad.webp',
							timeout: 1000,
							type: 'error'
						})
						
					},
                    children: ContextMenu.buildMenuChildren([{
						label: "Bravery",
						id: "bravery",
						action: async() => {
							await WebpackModules.getByProps(`joinHypeSquadOnline`).joinHypeSquadOnline({
								houseID: 'HOUSE_1'
							});
							if (this.showToast)
							Toasts.show(`You are now Member of House of Bravery`, {
								icon: 'https://cdn.discordapp.com/attachments/889198641775001670/987914489171152926/BraveryLogo.webp',
								timeout: 1000,
								type: 'default'
								})
						}
						}, {
						label: "Brilliance",
						id: "brilliance",
						action: async() => {
							await WebpackModules.getByProps(`joinHypeSquadOnline`).joinHypeSquadOnline({
								houseID: 'HOUSE_2'
							});
							if (this.showToast)
							Toasts.show(`You are now Member of House of Brillance`, {
								icon: 'https://cdn.discordapp.com/attachments/889198641775001670/987914490433646642/BrillianceLogo.webp',
								timeout: 1000,
								type: 'default'
							})
						}
						}, {
						label: "Balance",
						id: "balance",
						action: async() => {
							await WebpackModules.getByProps(`joinHypeSquadOnline`).joinHypeSquadOnline({
								houseID: 'HOUSE_3'
							});
							if (this.showToast)
							Toasts.show(`You are now Member of House of Balance`, {
								icon: 'https://cdn.discordapp.com/attachments/889198641775001670/987914488827248760/BalanceLogo.webp',
								timeout: 1000,
								type: 'default'
							})
						}
						}, {
						label: "None",
						id: "leave-hypesquad",
						action: async() => {
							await WebpackModules.getByProps(`joinHypeSquadOnline`).leaveHypeSquadOnline();
							if (this.showToast)
							Toasts.show(`You are member of none of the houses`, {
								icon: 'https://cdn.discordapp.com/attachments/889198641775001670/987914489905180772/Hypesquad.webp',
								timeout: 1000,
								type: 'default'
							})
						},
						
					}
					])
				}
                return menu;
			}
            async initiate() {
                ContextMenuAPI.insert("Hypesquad", await this.Hypesquad());
			}
            onStop() {
                ContextMenuAPI.remove(`Hypesquad`)
				
			}
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Switch("Popup/Toast", "Display message Hidden popup", this.showToast, (e) => {
                        this.showToast = e;
					}))
			}
            saveSettings() {
                BdApi.saveData(config.info.name, "showToast", this.showToast);
			}
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
