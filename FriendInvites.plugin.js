/**
	* @name FriendInvites
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.0
	* @invite SgKSKyh9gY
	* @description Get a option to copy your token by right clicking on home button.
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FriendInvites.plugin.js
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
            name: "FriendInvites",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.0",
            description:
            "Get a option to copy your token by right clicking on home button",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FriendInvites.plugin.js",
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
				"Don't Let Them Enforce rules on you o((>ω< ))o"
			]
            }
		],
        main: "FriendInvites.plugin.js",
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
            Modals
		} = Library;
        const {
            clipboard
		} = require("electron");
        const {
            createFriendInvite
		} = WebpackModules.getByProps("createFriendInvite");
        const {
            getAllFriendInvites
		} = WebpackModules.getByProps("getAllFriendInvites");
        const {
			revokeInvite
		} = WebpackModules.getByProps("revokeInvite")
		const {
			revokeFriendInvites
		} = WebpackModules.getByProps("revokeFriendInvites");
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
        return class FriendInvites extends Plugin {
			
			async onStart() {
				this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
				this.initiate()
			}
			async friendInvites() {
				let menu = {
					label: "Friend Invites",
					id: "friend-invites",
					action: async() => {
						try {
							const {
								invite
							} = await createFriendInvite();
							console.log(`${invite} is your friend invite.`)
							clipboard.writeText(`https://discord.gg/${invite}`);
							await this.initiate()
							if (this.showToast)
							BdApi.showToast(`Friend Invite Generated and Copied to Clipboard`, {
								icon: true,
								timeout: 5000,
								type: 'info'
							})
							} catch (e) {
							console.log(e);
							if (this.showToast)
							BdApi.showToast(`Failed to generate and copy the invite.`, {
								icon: true,
								timeout: 5000,
								type: 'info'
							})
						}
					},
					children: ContextMenu.buildMenuChildren([{
						label: "Generate Copy New Friend Invite",
						id: "generate-and-cody-friend-invite",
						children: await this.mapInvites(),
						action: async() => {
							try {
								const {
									code
								} = await createFriendInvite();
								await this.initiate()
								console.log(`https://discord.gg/${code} is your friend invite.`)
								clipboard.writeText(`https://discord.gg/${code}`);
								if (this.showToast)
								BdApi.showToast(`Friend Invite Generated and Copied to Clipboard`, {
									icon: true,
									timeout: 5000,
									type: 'info'
								})
								} catch (e) {
								console.log(e);
								if (this.showToast)
								BdApi.showToast(`Failed to generate and copy the invite.`, {
									icon: true,
									timeout: 5000,
									type: 'info'
								})
							}
						}
						}, {
						label: "View All Friend Invites",						
						id: "view-all-friend-invite",
						action: async() => {
							try {
								const invites = await getAllFriendInvites();
								if (invites.length === 0) {
									if (this.showToast)
									BdApi.showToast("You have no friend invites.", {
										icon: true,
										timeout: 5000,
										type: 'danger'
									})
									return;
								}
								let invitesMapped = invites.map((invite, index) => `***${index}.*** **Code:**  https://discord.gg/${invite.code} \n\n **Created At:**  ${new Date(invite.created_at).toLocaleDateString()} ${new Date(invite.created_at).toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'  }).toUpperCase()} \n\n **Expire At:**  ${new Date(invite.expires_at).toLocaleDateString()} ${new Date(invite.expires_at).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit'  }).toUpperCase()}`).join("\n\n\n\n\n\n")
								Modals.showAlertModal("All your Friend Invites", invitesMapped)
								
								} catch (e) {
								console.log(e);
								if (this.showToast)
								BdApi.showToast("Failed to get your links.", {
									icon: true,
									timeout: 5000,
									type: 'danger'
								})
								
							}
							
						}
						}, {
						label: "Delelte All Friend Invites",
						id: "delete-friend-invite",
						action: async() => {
							Modals.showConfirmationModal("Are you sure?", "By Confimirming you will make all your friend invites invalid.\nDo you still wish to proceed?", {
								danger: true,
								confirmText: "Delete All",
								cancelText: "Go back",
								onConfirm: async() => {
									try {
										await revokeFriendInvites();
										await this.initiate();
										if (this.showToast)
										BdApi.showToast(`Successfully deleted all of your links.`, {
											icon: true,
											timeout: 5000,
											type: 'danger'
										})
										} catch (e) {
										console.log(e);
										if (this.showToast)
										BdApi.showToast(`Failed to delete your links.`, {
											icon: true,
											timeout: 5000,
											type: 'danger'
										})
									}
								}
							})
						},
						
					}
					])
				}
				return menu;
			}
			async initiate() {
				ContextMenuAPI.insert("friendInvites", await this.friendInvites());
			}
			async mapInvites() {
				const invites = await getAllFriendInvites();
				let codes = []
				try {
					const invites = await getAllFriendInvites();
					if (invites.length === 0) {
						codes.push({
							id: "no-invites",
							action: async() => await this.initiate(),
							label: "You have no friend invites.",
						})
						return ContextMenu.buildMenuChildren(codes)
					}
					invites.forEach((i) => {
						codes.push({
							id: i.code,
							label: i.code,
							action: async() => {
								try {
									clipboard.writeText(`https://discord.gg/${i.code}`);
									if (this.showToast)
									BdApi.showToast(`Friend Invite Copied to Clipboard`, {
										icon: true,
										timeout: 5000,
										type: 'info'
									});
									await this.initiate();
									} catch (e) {
									console.log(e);
									if (this.showToast)
									BdApi.showToast(`Failed to copy your links.`, {
										icon: true,
										timeout: 5000,
										type: 'danger'
									})
								}
								
							}
						})
					})
					return ContextMenu.buildMenuChildren(codes)
					} catch (e) {
					console.log(e);
					codes.push({
						id: "failed-to-get-invites",
						label: "Failed to get your links.",
					})
					return ContextMenu.buildMenuChildren(codes)
					
				}
				
			}
			onStop() {
				ContextMenuAPI.remove(`friendInvites`)
				
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
