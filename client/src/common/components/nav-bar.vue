/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">
	.sidebar
		.sidebar-nav
			.sidebar-wrapper(@mouseleave="subMenu = false; subMenuData = false" v-bind:class="{ noneStyle: noneStyle }")
				ul.sidebar-nav
					li
						a(href="#" v-on:click="toggleStyle")
							i.fa.fa-bars
							span
								| &nbsp;
					li
						.accordion(id="rightMenu1")
							.accordion-group
								.accordion-heading(v-on:click="subMenu = true; subMenuData = false; peopleOrgsToggleSubmenu();")
									a.accordion-toggle(data-toggle="collapse" data-parent="#rightMenu1" href="#")
										i.fa.fa-users(v-on:click="subMenu = !subMenu")
										span.down(v-on:click="subMenu=true")
											| {{ $t('staff.title') }}
								.accordion-toggle.menu-sub
									.accordion-inner(v-if="subMenu && !noneStyle")
										ul
											li
												router-link(:to="{name:'userList'}" active-class="active")
													| {{ $t('user.listTitle') }}
											li
												router-link(:to="{name:'staffList'}" active-class="active")
													| {{ $t('staff.staff') }}
											<!--li-->
												<!--a(href="#")-->
													<!--| {{ $t('client.listTitle') }}-->
								.accordion-toggle(v-if="peopleOrgsFlag && noneStyle")
									.accordion-inner
										ul
											li
												router-link.submenu-left(:to="{name:'userList'}" active-class="active")
													| {{ $t('user.listTitle') }}
											li
												router-link.submenu-left(:to="{name:'staffList'}" active-class="active")
													| {{ $t('staff.staff') }}
											<!--li-->
												<!--a.submenu-left(href="#")-->
													<!--| {{ $t('client.listTitle') }}-->
					li
						.accordion(id="rightMenu2")
							.accordion-group
								.accordion-heading(v-on:click="subMenu = true; subMenuData = false; authSchemaToggleSubmenu();")
									a.accordion-toggle(data-toggle="collapse" data-parent="#rightMenu2" href="#")
										i.fa.fa-users(v-on:click="subMenu = !subMenu")
										span.down(v-on:click="subMenu=true")
											| {{ $t('permission.title') }}
								.accordion-toggle.menu-sub
									.accordion-inner(v-if="subMenu && !noneStyle")
										ul
											li
												router-link(:to="{name:'roleList'}" active-class="active")
													| {{ $t('role.title') }}
											li
												router-link(:to="{name:'authContextList'}" active-class="active")
													| {{ $t('permission.title') }}
								.accordion-toggle(v-if="authSchemaFlag && noneStyle")
									.accordion-inner
										ul
											li
												router-link.submenu-left(:to="{name:'roleList'}" active-class="active")
													| {{ $t('role.title') }}
											li
												router-link.submenu-left(:to="{name:'authContextList'}" active-class="active")
													| {{ $t('permission.title') }}

</template>

<script>
import store from 'Common/store'
import * as actionTypes from 'Common/store/action-types'

export default {
	name: 'nav-bar',
	data () {
		return {
			bodyCon: false,
			noneStyle: true,
			subMenu: false,
			subMenuData: false,
			peopleOrgsFlag: false,
			authSchemaFlag: false
		}
	},

	methods: {
		peopleOrgsToggleSubmenu: function () {
			this.peopleOrgsFlag = !this.peopleOrgsFlag
		},
		authSchemaToggleSubmenu: function () {
			this.authSchemaFlag = !this.authSchemaFlag
		},
		toggleStyle: function () {
			// If they are true, they will become false
			// and false will become true
			this.bodyCon = !this.bodyCon
			this.noneStyle = !this.noneStyle

			store.dispatch({
				type: actionTypes.ToggleNavBar,
				value: this.noneStyle
			})
		}
	}
}
</script>
