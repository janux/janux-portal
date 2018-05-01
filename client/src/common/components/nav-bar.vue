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
											| People & Organizations
								.accordion-toggle.menu-sub
									.accordion-inner(v-if="subMenu && !noneStyle")
										ul
											li
												a(href="#")
													| Users
											li
												router-link(:to="{name:'staffList'}" active-class="active")
													| Staff
											li
												a(href="#")
													| Clients
								.accordion-toggle(v-if="peopleOrgsFlag && noneStyle")
									.accordion-inner
										ul
											li
												a.submenu-left(href="#")
													| Users
											li
												router-link.submenu-left(to="/staff" active-class="active")
													| Staff
											li
												a.submenu-left(href="#")
													| Clients
</template>

<script>
export default {
	name: 'nav-bar',
	data () {
		return {
			bodyCon: false,
			noneStyle: true,
			subMenu: false,
			subMenuData: false,
			peopleOrgsFlag: false
		}
	},

	methods: {
		peopleOrgsToggleSubmenu: function () {
			this.peopleOrgsFlag = !this.peopleOrgsFlag
		},
		toggleStyle: function () {
			// If they are true, they will become false
			// and false will become true
			this.bodyCon = !this.bodyCon
			this.noneStyle = !this.noneStyle

			this.$root.$emit('toogleNavBar', this.noneStyle)
		}
	}
}
</script>
