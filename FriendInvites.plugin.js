/**
	* @name FriendInvites
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.3
	* @invite SgKSKyh9gY
	* @description Get a option to manage friend invites of your account right clicking on home button.
	* @website https://tharki-god.github.io/
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
            version: "1.0.3",
            description:
            "Get a option to manage friend invites of your account right clicking on home button",
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
				"You Have friends? DAMN φ(゜▽゜*)♪"
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
            Modals,
			Toasts,
			DiscordModules
		} = Library;
        const {
            clipboard
		} = require("electron");
		const {
            React
		} = DiscordModules;
        const {
            createFriendInvite,
			getAllFriendInvites,
			revokeInvite,
			revokeFriendInvites
		} = WebpackModules.getByProps("createFriendInvite");
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
			const viewAll = w => React.createElement('svg', {
				viewBox: '0 0 24 24',
				width: w,
				height: w
				}, React.createElement('path', {
					style: {
						fill: 'currentColor'
					},
					d: 'M2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H3C2.44772 6 2 5.55228 2 5ZM6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L10.7071 11.2929C11.0976 11.6834 11.0976 12.3166 10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L8 11.4142V19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19V11.4142L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L6.29289 8.29289ZM21 10H12C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8H21C21.5523 8 22 8.44772 22 9C22 9.55228 21.5523 10 21 10Z'
				}));
				const copyError = w => React.createElement('svg', {
					viewBox: '0 0 24 24',
					width: w,
					height: w
					}, React.createElement('path', {
						style: {
							fill: 'currentColor'
						},
						d: 'M10.25 2H13.75C14.9079 2 15.8616 2.87472 15.9862 3.99944L17.75 4C18.9926 4 20 5.00736 20 6.25V11.4982C19.2304 11.1772 18.3859 11 17.5 11C13.9101 11 11 13.9101 11 17.5C11 19.2465 11.6888 20.8321 12.8096 22H6.25C5.00736 22 4 20.9926 4 19.75V6.25C4 5.00736 5.00736 4 6.25 4L8.01379 3.99944C8.13841 2.87472 9.09205 2 10.25 2ZM13.75 3.5H10.25C9.83579 3.5 9.5 3.83579 9.5 4.25C9.5 4.66421 9.83579 5 10.25 5H13.75C14.1642 5 14.5 4.66421 14.5 4.25C14.5 3.83579 14.1642 3.5 13.75 3.5ZM23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM17.5 14C17.2239 14 17 14.2239 17 14.5V18.5C17 18.7761 17.2239 19 17.5 19C17.7761 19 18 18.7761 18 18.5V14.5C18 14.2239 17.7761 14 17.5 14ZM17.5 21.125C17.8452 21.125 18.125 20.8452 18.125 20.5C18.125 20.1548 17.8452 19.875 17.5 19.875C17.1548 19.875 16.875 20.1548 16.875 20.5C16.875 20.8452 17.1548 21.125 17.5 21.125Z'
					}));
					const trash = w => DiscordModules.React.createElement(WebpackModules.getByDisplayName("Trash"), {
						width: w,
						height: w
					});
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
										Toasts.show(`Friend Invite Generated and Copied to Clipboard.`, {
											icon: 'https://cdn.discordapp.com/attachments/887750789781676092/991000223100850266/ic_fluent_send_copy_24_filled.png?size=4096',
											timeout: 5000,
											type: 'success'
										})	
										} catch (e) {
										console.log(e);
										if (this.showToast)
										Toasts.show(` Error: ${e}.`, {
											icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
											timeout: 5000,
											type: 'error'
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
											Toasts.show(`Friend Invite Generated and Copied to Clipboard.`, {
												icon: 'https://cdn.discordapp.com/attachments/887750789781676092/991000223100850266/ic_fluent_send_copy_24_filled.png?size=4096',
												timeout: 5000,
												type: 'success'
											})	
											} catch (e) {
											console.log(e);
											if (this.showToast)
											Toasts.show(` Error: ${e}.`, {
												icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
												timeout: 5000,
												type: 'error'
											})	
										}
									}
									}, {
									label: "View All Friend Invites",						
									id: "view-all-friend-invite",
									icon: () => viewAll('20'),
									action: async() => {
										try {
											const invites = await getAllFriendInvites();
											if (invites.length === 0) {
												if (this.showToast)
												Toasts.show(`You have no friend invites..`, {
													icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
													timeout: 5000,
													type: 'error'
												})							
												return;
											}
											let invitesMapped = invites.map((invite, index) => `***${++index}.*** **Code:**  https://discord.gg/${invite.code} \n\n **Created At:**  ${new Date(invite.created_at).toLocaleDateString()} ${new Date(invite.created_at).toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'  }).toUpperCase()} \n\n **Expire At:**  ${new Date(invite.expires_at).toLocaleDateString()} ${new Date(invite.expires_at).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit'  }).toUpperCase()}`).join("\n\n\n\n\n\n")
											Modals.showAlertModal("All your Friend Invites", invitesMapped)											
											} catch (e) {
											console.log(e);
											if (this.showToast)
											Toasts.show(` Error: ${e}.`, {
												icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
												timeout: 5000,
												type: 'error'
											})	
										}										
									}
									}, {
									label: "Delelte All Friend Invites",
									id: "delete-friend-invite",
									icon: () => trash("20"),
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
													Toasts.show(`Successfully deleted all of your links`, {
														icon: 'https://cdn.discordapp.com/attachments/991059796759310386/991097320458313778/ic_fluent_delete_24_filled.png?size=4096',
														timeout: 5000,
														type: 'error'
													});
													} catch (e) {
													console.log(e);
													if (this.showToast)
													Toasts.show(` Error: ${e}.`, {
														icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
														timeout: 5000,
														type: 'error'
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
										icon: () => copyError("20"),
										label: "You have no friend invites.",
									})
									return ContextMenu.buildMenuChildren(codes)
								}
								for (const i of invites) {
									codes.push({
										id: i.code,
										label: i.code,
										icon: () => copy('20'),
										action: async() => {
											try {
												clipboard.writeText(`https://discord.gg/${i.code}`);
												if (this.showToast)
												Toasts.show(`Friend Invite Copied to Clipboard.`, {
													icon: 'https://cdn.discordapp.com/attachments/887750789781676092/991000223100850266/ic_fluent_send_copy_24_filled.png?size=4096',
													timeout: 5000,
													type: 'success'
												})									
												await this.initiate();
												} catch (e) {
												console.log(e);
												if (this.showToast)
												Toasts.show(`Error: ${e}.`, {
													icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
													timeout: 5000,
													type: 'error'
												})							
											}
											
										}
									})
								}
								return ContextMenu.buildMenuChildren(codes)
								} catch (e) {
								console.log(e);
								if (this.showToast)
												Toasts.show(`Error: ${e}.`, {
													icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
													timeout: 5000,
													type: 'error'
												});
								codes.push({
									id: "failed-to-get-invites",
									icon: () => copyError("20"),
									label: "Failed to get your links.",
								})
								return ContextMenu.buildMenuChildren(codes)								
							}							
						}
						onStop() {
							ContextMenuAPI.remove(`friendInvites`);							
						}
						getSettingsPanel() {
							return Settings.SettingPanel.build(this.saveSettings.bind(this),
								new Settings.Switch("Popup/Toast", "Display error/success popup", this.showToast, (e) => {
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
