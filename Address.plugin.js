/**
	* @name Address
	* @author Kirai
	* @authorId 887483349369765930
	* @version 1.0.0
	* @invite SgKSKyh9gY
	* @description Get a option to copy current web address by right clicking on home button.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Address.plugin.js
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
            name: "Address",
            authors: [{
                    name: "Kirai",
                    discord_id: "872383230328832031",
                    github_username: "HiddenKirai",
                },
            ],
            version: "1.0.0",
            description:
            "Get a option to copy current web address by right clicking on home button.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Address.plugin.js",
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
				"Who uses web discord anyways (ノω<。)ノ))☆.。"
			]
		}
        ],
        main: "Address.plugin.js",
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
            WebpackModules,
            Patcher,
            ContextMenu,
            Settings,
            DiscordModules,
			Toasts
		} = Library;
        const {
            clipboard
		} = require("electron");
		 const {
			 React
		} = DiscordModules;
        const copy = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w
			}, React.createElement('path', {
				style: {
					fill: 'currentColor'
				},
				d: 'M20.005 11.5a1 1 0 0 1 .993.883l.007.117V17a5.5 5.5 0 0 1-5.279 5.495l-.221.005H8.25a2.5 2.5 0 0 1-2.452-2.012h2.347l.052.009.053.003h7.255a3.5 3.5 0 0 0 3.494-3.296l.006-.192V12.5a1 1 0 0 1 1-1Zm-3.006-2.013a1 1 0 0 1 .993.883l.007.117v6.5a2.5 2.5 0 0 1-2.336 2.495l-.164.006h-10a2.5 2.5 0 0 1-2.495-2.336l-.005-.164v-6.49a1 1 0 0 1 1.993-.116l.007.116v6.49a.5.5 0 0 0 .41.492l.09.008h10a.5.5 0 0 0 .492-.41l.008-.09v-6.501a1 1 0 0 1 1-1ZM6.293 5.793l3.497-3.5a1 1 0 0 1 1.32-.084l.095.084 3.502 3.5a1 1 0 0 1-1.32 1.497l-.094-.083L11.5 5.415v8.84a1 1 0 0 1-.883.993l-.117.007a1 1 0 0 1-.993-.883l-.007-.117V5.412L7.707 7.207a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094 3.497-3.5-3.497 3.5Z'
			}));
		
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
        return class Address extends Plugin {
            onStart() {
                this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
                const copyAddress = {
                    label: "Copy Address",
                    id: "copy-address",
					icon: () => copy('20'),
                    action: async() => {						
                        try {
                            let Address = window.location.href;							
                            if (!Address) {
                                console.log(`Whoops! I couldn't find Address.`)
                                if (this.showToast)
								Toasts.show(`Whoops! I couldn't find Address.`, {
									icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
									timeout: 5000,
									type: 'error'
								})
								return;
							}							
                            clipboard.writeText(Address);
                            if (this.showToast)						
							Toasts.show(`Address Copied to Clipboard.`, {
									icon: 'https://cdn.discordapp.com/attachments/887750789781676092/991000223100850266/ic_fluent_send_copy_24_filled.png?size=4096',
									timeout: 5000,
									type: 'success'
								})							
							} catch (e) {
                            if (this.showToast)
							Toasts.show(` Error: ${e}.`, {
									icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
									timeout: 5000,
									type: 'error'
								})							
						}
						
					}
				}				
                ContextMenuAPI.insert("copyAddress", copyAddress);
			}
            onStop() {
                ContextMenuAPI.remove("copyAddress");
			}
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Switch("Popup/Toast", "Confirmation/Error message when copying Address", this.showToast, (e) => {
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
